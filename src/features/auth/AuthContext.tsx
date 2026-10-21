import React, { createContext, useContext, useState, useEffect } from "react";
import { Profile, Driver, UserRole } from "@/types/database";
import { getDemoDB, saveDemoDB, isDemoMode, supabase } from "@/lib/supabase";

interface AuthContextType {
  user: { id: string; phone?: string; email?: string } | null;
  profile: Profile | null;
  driver: Driver | null;
  role: UserRole | null;
  isLoading: boolean;
  sendOtp: (phone: string) => Promise<{ success: boolean; message?: string }>;
  verifyOtp: (
    phone: string,
    otp: string,
    additionalData?: { fullName?: string; collegeId?: string; hostelRoom?: string }
  ) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerDriver: (data: {
    fullName: string;
    phone: string;
    autoNumber: string;
    seatCapacity: number;
    licenceUrl?: string;
    rcUrl?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  switchDemoUser: (targetRole: UserRole, id?: string) => void;
  logout: () => void;
  refreshProfile: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "ride_mitra_active_session_v1";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; phone?: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [driver, setDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSession = () => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const session = JSON.parse(saved);
        setUser(session.user);
        setProfile(session.profile);
        setDriver(session.driver || null);
      } else if (isDemoMode) {
        // Default to student in demo mode if unauthenticated
        const db = getDemoDB();
        const defaultStudent = db.profiles.find((p) => p.role === "student");
        if (defaultStudent) {
          const sUser = { id: defaultStudent.id, phone: defaultStudent.phone };
          setUser(sUser);
          setProfile(defaultStudent);
          localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ user: sUser, profile: defaultStudent, driver: null })
          );
        }
      }
    } catch (err) {
      console.error("Session load failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();

    // Listen for database updates from other components
    const handleDbUpdate = () => {
      if (user) {
        const db = getDemoDB();
        const updatedProf = db.profiles.find((p) => p.id === user.id);
        if (updatedProf) setProfile(updatedProf);
        const updatedDriver = db.drivers.find((d) => d.profile_id === user.id);
        if (updatedDriver) setDriver(updatedDriver);
      }
    };
    window.addEventListener("storage_db_updated", handleDbUpdate);
    return () => window.removeEventListener("storage_db_updated", handleDbUpdate);
  }, [user?.id]);

  const refreshProfile = () => {
    if (!user) return;
    const db = getDemoDB();
    const updatedProf = db.profiles.find((p) => p.id === user.id);
    if (updatedProf) setProfile(updatedProf);
    const updatedDriver = db.drivers.find((d) => d.profile_id === user.id);
    if (updatedDriver) setDriver(updatedDriver);
  };

  const sendOtp = async (phone: string) => {
    if (!phone || phone.length < 10) {
      return { success: false, message: "कृपया १० अंकी मोबाईल नंबर टाका" };
    }
    // In demo mode or local presentation, OTP 123456 is prefilled/accepted
    return { success: true, message: "ओटीपी पाठवला आहे (डेमो कोड: 123456)" };
  };

  const verifyOtp = async (
    phone: string,
    otp: string,
    additionalData?: { fullName?: string; collegeId?: string; hostelRoom?: string }
  ) => {
    if (otp !== "123456" && otp.length !== 6) {
      return { success: false, error: "अवैध ओटीपी. डेमोसाठी 123456 वापरा." };
    }

    const db = getDemoDB();
    let userProfile = db.profiles.find((p) => p.phone === phone);

    if (!userProfile) {
      // Create new student profile
      userProfile = {
        id: "student-" + Date.now(),
        role: "student",
        full_name: additionalData?.fullName || "विद्यार्थी (" + phone.slice(-4) + ")",
        phone,
        language: "mr",
        is_blocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      db.profiles.push(userProfile);
      saveDemoDB(db);
    }

    const sessionUser = { id: userProfile.id, phone: userProfile.phone };
    setUser(sessionUser);
    setProfile(userProfile);
    setDriver(null);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: sessionUser, profile: userProfile, driver: null })
    );

    return { success: true };
  };

  const loginAdmin = async (email: string, pass: string) => {
    if (email === "admin@git.edu" && pass === "admin123") {
      const db = getDemoDB();
      const adminProfile = db.profiles.find((p) => p.role === "admin") || {
        id: "admin-1",
        role: "admin",
        full_name: "प्रा. जोशी सर (GIT Admin)",
        phone: "9876543210",
        language: "mr",
        is_blocked: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const sessionUser = { id: adminProfile.id, email };
      setUser(sessionUser);
      setProfile(adminProfile);
      setDriver(null);

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: sessionUser, profile: adminProfile, driver: null })
      );

      return { success: true };
    }
    return { success: false, error: "अवैध ईमेल किंवा पासवर्ड" };
  };

  const registerDriver = async (data: {
    fullName: string;
    phone: string;
    autoNumber: string;
    seatCapacity: number;
    licenceUrl?: string;
    rcUrl?: string;
  }) => {
    const db = getDemoDB();

    // Check if auto number already exists
    const existingAuto = db.drivers.find(
      (d) => d.auto_number.toLowerCase() === data.autoNumber.toLowerCase()
    );
    if (existingAuto) {
      return { success: false, error: "हा रिक्षा नंबर आधीच नोंदणीकृत आहे." };
    }

    const driverId = "driver-" + Date.now();
    const newProfile: Profile = {
      id: driverId,
      role: "driver",
      full_name: data.fullName,
      phone: data.phone,
      language: "mr",
      is_blocked: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newDriver: Driver = {
      profile_id: driverId,
      auto_number: data.autoNumber.toUpperCase(),
      seat_capacity: data.seatCapacity,
      licence_url: data.licenceUrl,
      rc_url: data.rcUrl,
      status: "pending", // Starts as pending per section 3.2
      is_online: false,
      queue_position: db.drivers.length + 1,
      consecutive_declines: 0,
      rating_avg: 5.0,
      rating_count: 0,
      total_trips: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.profiles.push(newProfile);
    db.drivers.push(newDriver);
    saveDemoDB(db);

    const sessionUser = { id: driverId, phone: data.phone };
    setUser(sessionUser);
    setProfile(newProfile);
    setDriver(newDriver);

    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ user: sessionUser, profile: newProfile, driver: newDriver })
    );

    return { success: true };
  };

  const switchDemoUser = (targetRole: UserRole, targetId?: string) => {
    const db = getDemoDB();
    let targetProfile = targetId ? db.profiles.find((p) => p.id === targetId) : undefined;
    if (!targetProfile) {
      targetProfile = db.profiles.find((p) => p.role === targetRole);
    }

    if (targetProfile) {
      const targetDriver =
        targetRole === "driver"
          ? db.drivers.find((d) => d.profile_id === targetProfile!.id) || null
          : null;

      const sessionUser = { id: targetProfile.id, phone: targetProfile.phone };
      setUser(sessionUser);
      setProfile(targetProfile);
      setDriver(targetDriver);

      localStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({ user: sessionUser, profile: targetProfile, driver: targetDriver })
      );
    }
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
    setDriver(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        driver,
        role: profile?.role || null,
        isLoading,
        sendOtp,
        verifyOtp,
        loginAdmin,
        registerDriver,
        switchDemoUser,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
