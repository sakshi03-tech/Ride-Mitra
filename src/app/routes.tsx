import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { InteractiveApp } from "@/features/mockup/InteractiveApp";
import { LandingPage } from "@/features/landing/LandingPage";
import { DriverPitchPage } from "@/features/landing/DriverPitchPage";
import { QrPosterPage } from "@/features/landing/QrPosterPage";
import { LoginPage } from "@/features/auth/LoginPage";
import { DriverRegisterPage } from "@/features/auth/DriverRegisterPage";
import { RoleGuard } from "@/features/auth/RoleGuard";
import { StudentBookingPage } from "@/features/student/StudentBookingPage";
import { BookingProvider } from "@/features/student/BookingContext";
import { DriverDashboardPage } from "@/features/driver/DriverDashboardPage";
import { DriverProvider } from "@/features/driver/DriverContext";
import { AdminDashboardPage } from "@/features/admin/AdminDashboardPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Exact UI from uploaded specification */}
      <Route path="/" element={<InteractiveApp />} />

      {/* Alternate Public & Portal Pages */}
      <Route path="/portal" element={<LandingPage />} />
      <Route path="/drivers" element={<DriverPitchPage />} />
      <Route path="/poster" element={<QrPosterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-driver" element={<DriverRegisterPage />} />

      {/* Student App */}
      <Route
        path="/book"
        element={
          <RoleGuard allowedRoles={["student"]}>
            <BookingProvider>
              <StudentBookingPage />
            </BookingProvider>
          </RoleGuard>
        }
      />

      {/* Driver App */}
      <Route
        path="/driver"
        element={
          <RoleGuard allowedRoles={["driver"]}>
            <DriverProvider>
              <DriverDashboardPage />
            </DriverProvider>
          </RoleGuard>
        }
      />

      {/* Admin Portal */}
      <Route
        path="/admin"
        element={
          <RoleGuard allowedRoles={["admin"]}>
            <AdminDashboardPage />
          </RoleGuard>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
