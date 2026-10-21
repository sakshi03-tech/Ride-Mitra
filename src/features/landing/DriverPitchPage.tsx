import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  TrendingDown,
  Printer,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";

export const DriverPitchPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith("mr");

  const registrationUrl = `${window.location.origin}/register-driver`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    registrationUrl
  )}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-8">
        {/* Banner */}
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-rickshaw-400 via-amber-400 to-amber-500 text-black shadow-xl space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-black text-white text-xs font-black uppercase tracking-wider">
              रिक्षा चालक बंधूंसाठी खास योजना
            </span>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              ०% कमिशन • १००% भाडे तुमचेच!
            </h1>
            <p className="text-sm sm:text-lg font-bold opacity-90">
              लावेल थांबा ↔ जीआयटी कॉलेज मार्गावर रिकाम्या फेऱ्या थांबवा. थेट मोबाईलवर भाडे मिळवा.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <Link to="/register-driver">
                <Button className="bg-black text-white hover:bg-zinc-800 text-base font-black px-6 py-5 rounded-2xl">
                  मोफत चालक नोंदणी करा →
                </Button>
              </Link>
              <Link to="/poster">
                <Button
                  variant="outline"
                  className="bg-white/90 text-black hover:bg-white border-2 border-black font-extrabold rounded-2xl"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  QR पोस्टर प्रिंट करा
                </Button>
              </Link>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="bg-white p-4 rounded-3xl shadow-2xl flex flex-col items-center flex-shrink-0 border-4 border-black">
            <img
              src={qrCodeUrl}
              alt="Scan to Register Driver"
              className="w-40 h-40 object-contain rounded-xl"
            />
            <span className="text-[11px] font-black mt-2 text-black">
              कॅमेऱ्याने स्कॅन करा व नोंदणी करा
            </span>
          </div>
        </div>

        {/* 3 CORE PROMISES */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-2 p-5 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rickshaw-400 text-black mx-auto flex items-center justify-center font-black text-xl shadow">
              ₹0
            </div>
            <h3 className="font-extrabold text-lg text-foreground">शून्य कमिशन (0% Cut)</h3>
            <p className="text-xs text-muted-foreground">
              कोणतीही छुपी फी किंवा कट नाही. विद्यार्थ्याने दिलेले सर्व रोख भाडे थेट तुमच्या हातात.
            </p>
          </Card>

          <Card className="border-2 p-5 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rickshaw-400 text-black mx-auto flex items-center justify-center font-black text-xl shadow">
              ⚖️
            </div>
            <h3 className="font-extrabold text-lg text-foreground">समान फेरी नियम (Fair Turn)</h3>
            <p className="text-xs text-muted-foreground">
              रांगेत जो आधी आला त्याला आधी भाडे. कोणावरही अन्याय नाही. सर्वांना रोज समान कमाईची हमी.
            </p>
          </Card>

          <Card className="border-2 p-5 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rickshaw-400 text-black mx-auto flex items-center justify-center font-black text-xl shadow">
              ⛽
            </div>
            <h3 className="font-extrabold text-lg text-foreground">इंधनाची बचत</h3>
            <p className="text-xs text-muted-foreground">
              रिकामी फेरी करावी लागत नाही. कॉलेज सुटायच्या वेळेची आधीच माहिती मिळते (Demand Forecast).
            </p>
          </Card>
        </div>

        {/* STEP BY STEP DRIVER PROCESS */}
        <Card className="border-2 p-6 space-y-4">
          <h2 className="text-2xl font-black text-foreground">चालक म्हणून काम कसे करायचे?</h2>
          <div className="space-y-4">
            {[
              {
                step: "१. एक वेळ नोंदणी करा (२ मिनिटे)",
                desc: "फक्त नाव, रिक्षा नंबर आणि मोबाईल नंबर टाकून मोफत नोंदणी करा. कॉलेज प्रशासनाकडून लगेच मंजुरी मिळेल.",
              },
              {
                step: "२. कामावर असताना 'ऑनलाइन' बटण दाबा",
                desc: "तुम्ही लावेल थांबा किंवा कॉलेज जवळ असताना ॲपमध्ये ऑनलाइन व्हा. तुम्ही रांगेत किती नंबरवर आहात ते दिसेल.",
              },
              {
                step: "३. भाड्याची घंटी वाजल्यावर 'स्वीकारा'",
                desc: "स्क्रीनवर विद्यार्थ्याचे नाव, पिकअप आणि फिक्स भाडे दिसेल. ३० सेकंदात हिरवे बटण दाबून भाडे स्वीकारा.",
              },
              {
                step: "४. पिकअप करा आणि रोख पैसे मिळवा",
                desc: "प्रवाशाला घेऊन जा आणि प्रवास पूर्ण झाल्यावर फिक्स रोख भाडे घ्या. कसलीही घासाघिस नाही.",
              },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 bg-muted/50 rounded-2xl border flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-sm text-foreground">{item.step}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};
