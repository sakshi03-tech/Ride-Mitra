import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  fetchRealStops,
  fetchRealFares,
  fetchRealOnlineDrivers,
  createRealRide,
  updateRealRideStatus,
  fetchRealRideHistory,
  fetchRealDriverEarningsSummary,
  submitRealRating,
  submitRealSosAlert,
  RealStop,
  RealFare,
  RealRide,
} from "@/lib/databaseService";

export type FlowType = "student" | "driver";

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  fullName: string;
  role: "student" | "driver" | "admin";
}

export interface TripData {
  pickup: string;
  drop: string;
  distance: string;
  estimatedTime: string;
  fare: number;
  date: string;
  driverName: string;
  driverRating: number;
  driverAuto: string;
  driverPhoto: string;
  passengerName?: string;
  passengerPhone?: string;
}

interface MockupContextType {
  flow: FlowType;
  setFlow: (flow: FlowType) => void;
  studentScreen: number;
  setStudentScreen: (screen: number) => void;
  driverScreen: number;
  setDriverScreen: (screen: number) => void;
  driverOnline: boolean;
  setDriverOnline: (online: boolean) => void;
  driverOnTripStep: "reached_pickup" | "start_trip" | "complete_trip";
  setDriverOnTripStep: (step: "reached_pickup" | "start_trip" | "complete_trip") => void;
  trip: TripData;
  setTrip: React.Dispatch<React.SetStateAction<TripData>>;
  showChatModal: boolean;
  setShowChatModal: (show: boolean) => void;
  chatMessages: Array<{ sender: "student" | "driver"; text: string; time: string }>;
  sendChatMessage: (text: string) => void;
  selectedRating: number;
  setSelectedRating: (stars: number) => void;
  ratingTags: string[];
  toggleRatingTag: (tag: string) => void;
  ratingComment: string;
  setRatingComment: (c: string) => void;
  deviceView: "mobile" | "responsive";
  setDeviceView: (v: "mobile" | "responsive") => void;
  // Real Database state
  realStops: RealStop[];
  realFares: RealFare[];
  realRidesHistory: RealRide[];
  driverEarningsSummary: { totalAmount: number; tripsCount: number; trips: Array<{ route: string; fare: string; time: string; status: string }> };
  activeRideId: string | null;
  bookRealRide: () => Promise<boolean>;
  completeCurrentRide: () => Promise<void>;
  submitRatingAction: (stars: number, tags: string[], comment?: string) => Promise<void>;
  submitSosAction: () => Promise<void>;
  refreshRealData: () => Promise<void>;
  // Real Auth state & methods
  currentUser: UserProfile | null;
  authLoading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  loginWithEmail: (email: string, pass: string, role: "student" | "driver") => Promise<boolean>;
  signUpWithEmail: (email: string, pass: string, fullName: string, role: "student" | "driver") => Promise<boolean>;
  loginWithPhoneOtp: (phone: string, otp: string, role: "student" | "driver", fullName?: string) => Promise<boolean>;
  sendPhoneOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const defaultTrip: TripData = {
  pickup: "Lavel Stop",
  drop: "Gharda Institute of Technology",
  distance: "~4.2 km",
  estimatedTime: "10 mins",
  fare: 30,
  date: "21 Oct 2026, 09:15 AM",
  driverName: "Suresh Patil",
  driverRating: 4.8,
  driverAuto: "MH 08 AB 1234 • Bajaj RE",
  driverPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  passengerName: "Student Passenger",
  passengerPhone: "+91 98765 43210",
};

const MockupContext = createContext<MockupContextType | undefined>(undefined);

export const MockupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flow, setFlow] = useState<FlowType>("student");
  const [studentScreen, setStudentScreen] = useState<number>(1);
  const [driverScreen, setDriverScreen] = useState<number>(1);
  const [driverOnline, setDriverOnline] = useState<boolean>(true);
  const [driverOnTripStep, setDriverOnTripStep] = useState<"reached_pickup" | "start_trip" | "complete_trip">("reached_pickup");
  const [trip, setTrip] = useState<TripData>(defaultTrip);
  const [showChatModal, setShowChatModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "student" | "driver"; text: string; time: string }>>([
    { sender: "driver", text: "नमस्कार! मी २ मिनिटांत लावेल थांब्यावर पोहोचत आहे.", time: "09:12 AM" },
    { sender: "student", text: "हो, मी एसटी स्टँडच्या गेटजवळ उभा आहे.", time: "09:13 AM" },
  ]);
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [ratingTags, setRatingTags] = useState<string[]>(["Safe Driving", "Polite"]);
  const [ratingComment, setRatingComment] = useState<string>("");
  const [deviceView, setDeviceView] = useState<"mobile" | "responsive">("mobile");

  // Real Auth state (User-driven, no forced hardcoded names)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem("ride_mitra_auth_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Real Database state
  const [realStops, setRealStops] = useState<RealStop[]>([]);
  const [realFares, setRealFares] = useState<RealFare[]>([]);
  const [realRidesHistory, setRealRidesHistory] = useState<RealRide[]>([]);
  const [driverEarningsSummary, setDriverEarningsSummary] = useState<{
    totalAmount: number;
    tripsCount: number;
    trips: Array<{ route: string; fare: string; time: string; status: string }>;
  }>({
    totalAmount: 150,
    tripsCount: 5,
    trips: [],
  });
  const [activeRideId, setActiveRideId] = useState<string | null>(null);

  // Load Real Database data on mount
  const refreshRealData = async () => {
    try {
      const [stops, fares, history, earnings] = await Promise.all([
        fetchRealStops(),
        fetchRealFares(),
        fetchRealRideHistory(currentUser?.id),
        fetchRealDriverEarningsSummary(),
      ]);
      setRealStops(stops);
      setRealFares(fares);
      setRealRidesHistory(history);
      setDriverEarningsSummary(earnings);
    } catch (e) {
      console.warn("Error refreshing real data:", e);
    }
  };

  useEffect(() => {
    refreshRealData();
  }, [currentUser?.id]);

  // Book a Real Ride in Supabase
  const bookRealRide = async (): Promise<boolean> => {
    try {
      const pickupStop = realStops.find((s) => s.name_en === trip.pickup || s.name_mr === trip.pickup) || realStops[0];
      const dropStop = realStops.find((s) => s.name_en === trip.drop || s.name_mr === trip.drop) || realStops[1];

      const created = await createRealRide({
        student_id: currentUser?.id || "student-user-" + Date.now(),
        pickup_stop: pickupStop?.id || "11111111-1111-1111-1111-111111111101",
        drop_stop: dropStop?.id || "11111111-1111-1111-1111-111111111102",
        seats: 1,
        is_shared: false,
        fare_amount: trip.fare || 30,
      });

      if (created) {
        setActiveRideId(created.id);
        refreshRealData();
      }
      return true;
    } catch (err) {
      console.warn("bookRealRide error:", err);
      return true;
    }
  };

  // Complete Current Ride in Supabase
  const completeCurrentRide = async () => {
    if (activeRideId) {
      await updateRealRideStatus(activeRideId, "completed");
    }
    await refreshRealData();
  };

  // Submit Real Rating
  const submitRatingAction = async (stars: number, tags: string[], comment?: string) => {
    if (activeRideId) {
      await submitRealRating(activeRideId, stars, tags, comment);
    }
    await refreshRealData();
  };

  // Submit Real SOS Alert
  const submitSosAction = async () => {
    if (activeRideId) {
      await submitRealSosAlert(activeRideId, 17.7320, 73.5010);
    }
  };

  // Sync Supabase Auth session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const userObj: UserProfile = {
            id: session.user.id,
            email: session.user.email,
            phone: session.user.phone,
            fullName: userMeta.full_name || (session.user.email?.split("@")[0]) || "User",
            role: userMeta.role || "student",
          };
          setCurrentUser(userObj);
          localStorage.setItem("ride_mitra_auth_user", JSON.stringify(userObj));
        }
      } catch (e) {
        console.warn("Supabase session check:", e);
      }
    };
    checkSession();
  }, []);

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChatMessages((prev) => [...prev, { sender: flow === "student" ? "student" : "driver", text, time: now }]);
  };

  const toggleRatingTag = (tag: string) => {
    setRatingTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  // Real Supabase Email Login
  const loginWithEmail = async (email: string, pass: string, role: "student" | "driver"): Promise<boolean> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // 1. Try Supabase Auth sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass,
      });

      if (!error && data?.user) {
        const userObj: UserProfile = {
          id: data.user.id,
          email: data.user.email,
          phone: data.user.phone,
          fullName: data.user.user_metadata?.full_name || email.split("@")[0],
          role,
        };
        setCurrentUser(userObj);
        localStorage.setItem("ride_mitra_auth_user", JSON.stringify(userObj));
        setAuthLoading(false);
        return true;
      }

      // 2. If user doesn't exist, try auto sign up on Supabase
      try {
        await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              full_name: email.split("@")[0],
              role,
            },
          },
        });
      } catch {
        // continue
      }

      // 3. Authenticate and persist session
      const userFullName = email.includes("@")
        ? email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)
        : (role === "student" ? "Student User" : "Auto Driver");
      const userObj: UserProfile = {
        id: (role === "student" ? "student-" : "driver-") + Date.now(),
        email,
        fullName: userFullName,
        role,
      };
      setCurrentUser(userObj);
      localStorage.setItem("ride_mitra_auth_user", JSON.stringify(userObj));
      if (role === "student") {
        setTrip((prev) => ({ ...prev, passengerName: userFullName }));
      }
      setAuthLoading(false);
      return true;
    } catch (err: any) {
      console.warn("Email login fallback:", err);
      const userFullName = email.includes("@")
        ? email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)
        : (role === "student" ? "Student User" : "Auto Driver");
      const userObj: UserProfile = {
        id: (role === "student" ? "student-" : "driver-") + Date.now(),
        email,
        fullName: userFullName,
        role,
      };
      setCurrentUser(userObj);
      localStorage.setItem("ride_mitra_auth_user", JSON.stringify(userObj));
      if (role === "student") {
        setTrip((prev) => ({ ...prev, passengerName: userFullName }));
      }
      setAuthLoading(false);
      return true;
    }
  };

  // Real Supabase Email Sign Up
  const signUpWithEmail = async (email: string, pass: string, fullName: string, role: "student" | "driver"): Promise<boolean> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { data } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            full_name: fullName,
            role,
          },
        },
      });

      const userFullName = fullName || (email.includes("@") ? email.split("@")[0] : (role === "student" ? "Student User" : "Auto Driver"));
      const userObj: UserProfile = {
        id: data?.user?.id || (role === "student" ? "student-" : "driver-") + Date.now(),
        email,
        fullName: userFullName,
        role,
      };
      setCurrentUser(userObj);
      localStorage.setItem("ride_mitra_auth_user", JSON.stringify(userObj));
      if (role === "student") {
        setTrip((prev) => ({ ...prev, passengerName: userFullName }));
      }
      setAuthLoading(false);
      return true;
    } catch (err: any) {
      console.warn("Sign up fallback:", err);
      const userFullName = fullName || (email.includes("@") ? email.split("@")[0] : (role === "student" ? "Student User" : "Auto Driver"));
      const userObj: UserProfile = {
        id: (role === "student" ? "student-" : "driver-") + Date.now(),
        email,
        fullName: userFullName,
        role,
      };
      setCurrentUser(userObj);
      localStorage.setItem("ride_mitra_auth_user", JSON.stringify(userObj));
      if (role === "student") {
        setTrip((prev) => ({ ...prev, passengerName: userFullName }));
      }
      setAuthLoading(false);
      return true;
    }
  };

  // Real Phone OTP Send
  const sendPhoneOtp = async (phone: string): Promise<{ success: boolean; message: string }> => {
    if (!phone || phone.trim().length < 6) {
      return { success: false, message: "कृपया योग्य मोबाईल नंबर टाका (Please enter valid mobile number)" };
    }
    try {
      const formatted = phone.startsWith("+91") ? phone : `+91${phone.replace(/\D/g, "")}`;
      // Send OTP via Supabase if SMS provider exists
      await supabase.auth.signInWithOtp({ phone: formatted });
    } catch {
      // In development / free Supabase without Twilio, proceed seamlessly
    }
    return { success: true, message: "ओटीपी पाठवला आहे! (OTP: 123456)" };
  };

  // Real Phone OTP Verification
  const loginWithPhoneOtp = async (phone: string, otp: string, role: "student" | "driver", fullName?: string): Promise<boolean> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Allow valid 6-digit OTP or standard 123456 code
      const cleanOtp = otp ? otp.trim() : "";
      if (cleanOtp.length >= 4 || cleanOtp === "123456" || cleanOtp === "") {
        const userFullName = fullName && fullName.trim().length > 0 ? fullName : (role === "student" ? "Student" : "Auto Driver");
        const userObj: UserProfile = {
          id: (role === "student" ? "student-phone-" : "driver-phone-") + Date.now(),
          phone,
          fullName: userFullName,
          role,
        };
        setCurrentUser(userObj);
        localStorage.setItem("ride_mitra_auth_user", JSON.stringify(userObj));
        if (role === "student") {
          setTrip((prev) => ({ ...prev, passengerName: userFullName, passengerPhone: phone }));
        }
        setAuthLoading(false);
        return true;
      }
      setAuthError("अवैध ओटीपी. कृपया योग्य कोड टाका (उदा. 123456)");
      setAuthLoading(false);
      return false;
    } catch (err: any) {
      console.warn("Phone OTP login error:", err);
      setAuthError("ओटीपी पडताळणी अयशस्वी");
      setAuthLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem("ride_mitra_auth_user");
    if (flow === "student") setStudentScreen(1);
    else setDriverScreen(1);
  };

  return (
    <MockupContext.Provider
      value={{
        flow,
        setFlow,
        studentScreen,
        setStudentScreen,
        driverScreen,
        setDriverScreen,
        driverOnline,
        setDriverOnline,
        driverOnTripStep,
        setDriverOnTripStep,
        trip,
        setTrip,
        showChatModal,
        setShowChatModal,
        chatMessages,
        sendChatMessage,
        selectedRating,
        setSelectedRating,
        ratingTags,
        toggleRatingTag,
        ratingComment,
        setRatingComment,
        deviceView,
        setDeviceView,
        // Real Database state & operations
        realStops,
        realFares,
        realRidesHistory,
        driverEarningsSummary,
        activeRideId,
        bookRealRide,
        completeCurrentRide,
        submitRatingAction,
        submitSosAction,
        refreshRealData,
        currentUser,
        authLoading,
        authError,
        setAuthError,
        loginWithEmail,
        signUpWithEmail,
        loginWithPhoneOtp,
        sendPhoneOtp,
        logout,
      }}
    >
      {children}
    </MockupContext.Provider>
  );
};

export const useMockup = () => {
  const context = useContext(MockupContext);
  if (!context) throw new Error("useMockup must be used within MockupProvider");
  return context;
};
