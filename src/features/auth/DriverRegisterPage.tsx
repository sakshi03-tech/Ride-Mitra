import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";
import { validateAadhaar } from "@/lib/aadhaar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CheckCircle2, ShieldCheck, AlertCircle, FileText, Upload } from "lucide-react";

export const DriverRegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { registerDriver } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [autoNumber, setAutoNumber] = useState("");
  const [seatCapacity, setSeatCapacity] = useState(3);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [licenceUploaded, setLicenceUploaded] = useState(false);
  const [rcUploaded, setRcUploaded] = useState(false);
  const [aadhaarUploaded, setAadhaarUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const aadhaarCheck = validateAadhaar(aadhaarNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!autoNumber.trim() || autoNumber.length < 6) {
      setErrorMsg("कृपया वैध रिक्षा नंबर टाका (उदा. MH 08 AB 1234)");
      return;
    }

    if (aadhaarNumber.replace(/\D/g, "").length !== 12 && !aadhaarCheck.isValid) {
      setErrorMsg("कृपया वैध १२ अंकी आधार नंबर टाका");
      return;
    }

    setLoading(true);
    const res = await registerDriver({
      fullName,
      phone,
      autoNumber,
      seatCapacity,
      aadhaarNumber,
      aadhaarUrl: aadhaarUploaded ? "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80" : undefined,
      licenceUrl: licenceUploaded ? "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80" : undefined,
      rcUrl: rcUploaded ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&auto=format&fit=crop&q=80" : undefined,
    });
    setLoading(false);

    if (res.success) {
      setIsSuccess(true);
    } else {
      setErrorMsg(res.error || "नोंदणी अयशस्वी झाली.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-rickshaw-400 flex items-center justify-center font-black text-black text-xl shadow">
            RM
          </div>
          <div>
            <h1 className="font-extrabold text-xl leading-tight text-foreground">रिक्षा मित्र</h1>
            <p className="text-xs text-muted-foreground">चालक नोंदणी • Free Registration</p>
          </div>
        </Link>
        <LanguageSwitcher />
      </div>

      {isSuccess ? (
        <Card className="border-2 border-emerald-500 shadow-xl my-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-2xl text-emerald-600 dark:text-emerald-400">
              नोंदणी यशस्वी झाली!
            </CardTitle>
            <CardDescription className="text-base text-foreground mt-2">
              तुमची रिक्षा मित्र चालक नोंदणी पूर्ण झाली आहे. प्रशासकीय पडताळणीनंतर तुमचे खाते सक्रिय
              होईल.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-xl space-y-2 text-sm">
              <p>
                <strong>रिक्षा चालक:</strong> {fullName}
              </p>
              <p>
                <strong>रिक्षा नंबर:</strong> {autoNumber.toUpperCase()}
              </p>
              <p>
                <strong>स्थिती (Status):</strong>{" "}
                <span className="font-bold text-amber-600">Pending (पडताळणी प्रलंबित)</span>
              </p>
            </div>
            <Button onClick={() => navigate("/driver")} className="w-full font-bold text-base">
              चालक कक्षात जा (Driver Dashboard) →
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 shadow-lg my-2">
          <CardHeader>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold w-fit mb-2">
              <ShieldCheck className="w-4 h-4" /> 100% मोफत नोंदणी • ०% कमिशन
            </div>
            <CardTitle className="text-2xl">{t("auth.driverRegister")}</CardTitle>
            <CardDescription>
              लावेल ↔ जीआयटी मार्गावर थेट भाडे मिळवा. फेरीची समान संधी व फिक्स दर.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold flex items-center gap-2 border border-destructive/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">{t("auth.fullName")} *</label>
                <Input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा. संतोष तांबडे"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">{t("common.phone")} *</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-muted-foreground font-semibold">
                    +91
                  </span>
                  <Input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9822114455"
                    className="pl-14 font-mono text-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">{t("auth.autoNumber")} *</label>
                <Input
                  type="text"
                  required
                  value={autoNumber}
                  onChange={(e) => setAutoNumber(e.target.value.toUpperCase())}
                  placeholder="MH 08 AB 1234"
                  className="font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">{t("auth.seatCapacity")}</label>
                <select
                  value={seatCapacity}
                  onChange={(e) => setSeatCapacity(Number(e.target.value))}
                  className="w-full h-12 rounded-xl border-2 border-input bg-background px-4 font-bold text-base"
                >
                  <option value={3}>३ सीट (स्टँडर्ड रिक्षा)</option>
                  <option value={4}>४ सीट</option>
                  <option value={6}>६ सीट (मोठी रिक्षा)</option>
                </select>
              </div>

              {/* Aadhaar Number with Verhoeff validation */}
              <div className="p-3.5 rounded-xl border-2 border-amber-300 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-black text-amber-950 dark:text-amber-200">
                    आधार कार्ड नंबर (Aadhaar Number) *
                  </label>
                  <span className="text-[10px] text-muted-foreground font-semibold">१२ अंक</span>
                </div>
                <Input
                  type="text"
                  required
                  value={aadhaarNumber}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 12);
                    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
                    setAadhaarNumber(formatted);
                  }}
                  placeholder="3675 9834 6012"
                  className="font-mono tracking-wider font-bold text-base bg-background"
                />
                {aadhaarNumber.length > 0 && (
                  <p
                    className={`text-xs font-bold flex items-center gap-1 pt-1 ${
                      aadhaarCheck.isValid ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {aadhaarCheck.isValid ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>✓ वैध आधार कार्ड (Verhoeff Verified)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{aadhaarCheck.message}</span>
                      </>
                    )}
                  </p>
                )}
              </div>

              {/* Document upload section */}
              <div className="pt-2 border-t space-y-2">
                <label className="block text-sm font-bold text-muted-foreground">
                  कागदपत्रे अपलोड (Upload Required Documents)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAadhaarUploaded(!aadhaarUploaded)}
                    className={`p-2.5 rounded-xl border-2 text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                      aadhaarUploaded
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "border-input bg-background hover:border-rickshaw-400"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{aadhaarUploaded ? "✓ आधार जोडले" : "+ आधार कार्ड"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLicenceUploaded(!licenceUploaded)}
                    className={`p-2.5 rounded-xl border-2 text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                      licenceUploaded
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "border-input bg-background hover:border-rickshaw-400"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{licenceUploaded ? "✓ लायसन्स जोडले" : "+ लायसन्स"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRcUploaded(!rcUploaded)}
                    className={`p-2.5 rounded-xl border-2 text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                      rcUploaded
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                        : "border-input bg-background hover:border-rickshaw-400"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{rcUploaded ? "✓ आरसी जोडली" : "+ वाहन आरसी"}</span>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="driverAction"
                className="w-full text-lg mt-4"
                disabled={loading}
              >
                {loading ? t("common.loading") : "नोंदणी सबमिट करा (Register)"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="py-4 text-center">
        <Link
          to="/login"
          className="text-sm font-semibold text-rickshaw-600 dark:text-rickshaw-400 hover:underline"
        >
          आधीच नोंदणी आहे? इथे लॉगिन करा
        </Link>
      </div>
    </div>
  );
};
