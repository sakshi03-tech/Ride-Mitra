import React from "react";
import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";
import { Button } from "./ui/button";

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("en") ? "en" : "mr";

  const toggleLanguage = () => {
    const nextLang = currentLang === "mr" ? "en" : "mr";
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center gap-1.5 font-bold rounded-full px-3 py-1 bg-background/80 backdrop-blur-sm border-2 ${className}`}
      title="भाषा बदला / Change Language"
    >
      <Languages className="w-4 h-4 text-rickshaw-600" />
      <span>{currentLang === "mr" ? "English" : "मराठी"}</span>
    </Button>
  );
};
