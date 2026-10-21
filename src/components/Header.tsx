import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "./ui/button";
import { LogOut, Bell, Shield, User, Car } from "lucide-react";

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-rickshaw-400 flex items-center justify-center font-black text-black text-lg shadow-sm">
            🛺
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg leading-tight tracking-tight">
              {t("brand.name")}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold tracking-wide">
              Lavel ↔ GIT Corridor
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {profile && (
            <div className="flex items-center gap-1.5 ml-1">
              {profile.role === "admin" && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20">
                  <Shield className="w-3.5 h-3.5" /> Admin
                </span>
              )}
              {profile.role === "driver" && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-rickshaw-400/20 text-rickshaw-800 dark:text-rickshaw-300 rounded-full border border-rickshaw-400/30">
                  <Car className="w-3.5 h-3.5" /> Driver
                </span>
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title={t("nav.logout")}
                className="text-muted-foreground hover:text-destructive h-10 w-10 min-h-[40px] min-w-[40px]"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
