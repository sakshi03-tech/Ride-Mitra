import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { UserRole } from "@/types/database";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rickshaw-400 border-t-transparent" />
          <p className="font-semibold text-muted-foreground">लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(profile.role)) {
    // Redirect to respective authorized home
    if (profile.role === "student") {
      return <Navigate to="/book" replace />;
    } else if (profile.role === "driver") {
      return <Navigate to="/driver" replace />;
    } else if (profile.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
  }

  return <>{children}</>;
};
