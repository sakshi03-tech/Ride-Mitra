import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { UserCheck, KeyRound, ShieldAlert, Sparkles } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, loginAdmin, switchDemoUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"student" | "driver" | "admin">("student");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("123456");
  const [fullName, setFullName] = useState("");
  const [collegeId, setCollegeId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [adminEmail, setAdminEmail] = useState("admin@git.edu");
  const [adminPass, setAdminPass] = useState("admin123");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const res = await sendOtp(phone);
    setLoading(false);
    if (res.success) {
      setOtpSent(true);
    } else {
      setErrorMsg(res.message || "त्रुटी आली");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const res = await verifyOtp(phone, otp, { fullName, collegeId });
    setLoading(false);
    if (res.success) {
      if (activeTab === "driver") {
        navigate("/driver");
      } else {
        navigate("/book");
      }
    } else {
      setErrorMsg(res.error || "ओटीपी चुकीचा आहे");
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);
    const res = await loginAdmin(adminEmail, adminPass);
    setLoading(false);
    if (res.success) {
      navigate("/admin");
    } else {
      setErrorMsg(res.error || "लॉगिन अयशस्वी");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-rickshaw-400 flex items-center justify-center font-black text-black text-xl shadow">
            RM
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-tight text-foreground">रिक्षा मित्र</h1>
            <p className="text-xs text-muted-foreground">Ride Mitra • Lavel Corridor</p>
          </div>
        </div>
        <LanguageSwitcher />
      </div>

      {/* Demo Quick Switcher Banner */}
      <div className="my-3 p-3 bg-rickshaw-100/60 dark:bg-rickshaw-950/40 border-2 border-rickshaw-300 dark:border-rickshaw-800 rounded-2xl">
        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-rickshaw-900 dark:text-rickshaw-200">
          <Sparkles className="w-4 h-4 text-rickshaw-600 animate-pulse" />
          <span>१-क्लिक डेमो लॉगिन (1-Click Demo Switcher):</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => {
              switchDemoUser("student");
              navigate("/book");
            }}
            className="text-xs font-bold py-1.5 px-2 bg-white dark:bg-zinc-800 border rounded-lg hover:border-rickshaw-500 text-left transition shadow-sm"
          >
            🎓 विद्यार्थी (Student)
          </button>
          <button
            type="button"
            onClick={() => {
              switchDemoUser("driver", "driver-1");
              navigate("/driver");
            }}
            className="text-xs font-bold py-1.5 px-2 bg-white dark:bg-zinc-800 border rounded-lg hover:border-rickshaw-500 text-left transition shadow-sm"
          >
            🛺 चालक १ (Santosh)
          </button>
          <button
            type="button"
            onClick={() => {
              switchDemoUser("driver", "driver-2");
              navigate("/driver");
            }}
            className="text-xs font-bold py-1.5 px-2 bg-white dark:bg-zinc-800 border rounded-lg hover:border-rickshaw-500 text-left transition shadow-sm"
          >
            🛺 चालक २ (Sanjay)
          </button>
          <button
            type="button"
            onClick={() => {
              switchDemoUser("admin");
              navigate("/admin");
            }}
            className="text-xs font-bold py-1.5 px-2 bg-white dark:bg-zinc-800 border rounded-lg hover:border-rickshaw-500 text-left transition shadow-sm"
          >
            🛡️ प्रशासक (Admin)
          </button>
        </div>
      </div>

      {/* Main Login Card */}
      <Card className="border-2 shadow-lg">
        {/* Role Tabs */}
        <div className="grid grid-cols-3 p-1.5 bg-muted/60 border-b">
          <button
            type="button"
            onClick={() => {
              setActiveTab("student");
              setOtpSent(false);
              setErrorMsg("");
            }}
            className={`py-2 text-sm font-bold rounded-xl transition ${
              activeTab === "student"
                ? "bg-rickshaw-400 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("auth.studentLogin")}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("driver");
              setOtpSent(false);
              setErrorMsg("");
            }}
            className={`py-2 text-sm font-bold rounded-xl transition ${
              activeTab === "driver"
                ? "bg-rickshaw-400 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("auth.driverLogin")}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("admin");
              setErrorMsg("");
            }}
            className={`py-2 text-sm font-bold rounded-xl transition ${
              activeTab === "admin"
                ? "bg-rickshaw-400 text-black shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("auth.adminLogin")}
          </button>
        </div>

        <CardHeader>
          <CardTitle>
            {activeTab === "student" && "विद्यार्थी लॉगिन (Student)"}
            {activeTab === "driver" && "चालक लॉगिन (Driver OTP)"}
            {activeTab === "admin" && "प्रशासक पोर्टल (Admin)"}
          </CardTitle>
          <CardDescription>
            {activeTab === "admin"
              ? "कॉलेज व सिस्टीम प्रशासकांसाठी सुरक्षित प्रवेश"
              : "मोबाईल नंबरवर एसएमएस द्वारे सुरक्षित ओटीपी मिळवा"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold flex items-center gap-2 border border-destructive/20">
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab !== "admin" ? (
            !otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">
                    {t("common.phone")}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3 text-muted-foreground font-semibold">
                      +91
                    </span>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9822114455"
                      className="pl-14 text-lg font-mono tracking-wider"
                      required
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    डेमो नंबर: 9123456789 (विद्यार्थी) किंवा 9822114455 (चालक)
                  </p>
                </div>

                <Button type="submit" className="w-full text-base font-bold" disabled={loading}>
                  {loading ? t("common.loading") : t("common.sendOtp")}
                </Button>

                {activeTab === "driver" && (
                  <div className="pt-2 text-center">
                    <p className="text-xs text-muted-foreground">अजून नोंदणी केली नाही?</p>
                    <Link
                      to="/register-driver"
                      className="text-sm font-bold text-rickshaw-600 dark:text-rickshaw-400 hover:underline block mt-1"
                    >
                      {t("auth.driverRegister")} →
                    </Link>
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="p-3 bg-secondary rounded-xl text-xs flex justify-between items-center">
                  <span>
                    नंबर: <strong className="font-mono text-foreground">+91 {phone}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-primary font-bold hover:underline"
                  >
                    बदला
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-1.5 text-foreground">
                    {t("common.otp")}
                  </label>
                  <Input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    placeholder="123456"
                    className="text-center font-mono text-2xl tracking-widest font-black"
                    required
                  />
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    ✓ चाचणीसाठी तात्पुरता ओटीपी: 123456
                  </p>
                </div>

                {activeTab === "student" && (
                  <>
                    <div>
                      <label className="block text-sm font-bold mb-1 text-foreground">
                        {t("auth.fullName")} (ऐच्छिक)
                      </label>
                      <Input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="उदा. राहुल पाटील"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1 text-foreground">
                        {t("auth.collegeId")} (ऐच्छिक)
                      </label>
                      <Input
                        type="text"
                        value={collegeId}
                        onChange={(e) => setCollegeId(e.target.value)}
                        placeholder="उदा. GIT-TE-2024"
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full text-base font-bold" disabled={loading}>
                  {loading ? t("common.loading") : t("common.verifyOtp")}
                </Button>
              </form>
            )
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1.5 text-foreground">
                  {t("auth.email")}
                </label>
                <Input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@git.edu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1.5 text-foreground">
                  {t("auth.password")}
                </label>
                <Input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="admin123"
                  required
                />
              </div>

              <Button type="submit" className="w-full text-base font-bold" disabled={loading}>
                {loading ? t("common.loading") : "प्रशासक लॉगिन करा"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="py-4 text-center">
        <Link to="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
          ← {t("nav.home")}
        </Link>
        <p className="text-xs text-muted-foreground mt-2">{t("common.allRightsReserved")}</p>
      </div>
    </div>
  );
};
