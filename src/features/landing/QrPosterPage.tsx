import React from "react";
import { Link } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const QrPosterPage: React.FC = () => {
  const registerUrl = `${window.location.origin}/register-driver`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    registerUrl
  )}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 p-4 sm:p-8 flex flex-col items-center justify-center">
      {/* Top Action Bar (hidden when printing) */}
      <div className="w-full max-w-xl flex items-center justify-between mb-4 print:hidden">
        <Link to="/drivers" className="flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> मागे जा
        </Link>
        <Button onClick={handlePrint} className="bg-black text-white hover:bg-zinc-800 font-bold rounded-xl flex items-center gap-2">
          <Printer className="w-4 h-4" />
          पोस्टर प्रिंट करा (Print A4)
        </Button>
      </div>

      {/* A4 Printable Sheet */}
      <div className="w-full max-w-xl bg-white text-black p-8 rounded-3xl shadow-2xl border-4 border-black print:border-none print:shadow-none print:m-0 print:p-6 space-y-6 text-center">
        {/* Top Header Badge */}
        <div className="bg-amber-400 text-black py-2.5 px-4 rounded-2xl border-2 border-black inline-block font-black text-lg uppercase tracking-wider">
          🛺 रिक्षा चालक बंधूंसाठी सुवर्णसंधी!
        </div>

        {/* Big Heading */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight leading-tight">
            रिक्षा मित्र (Ride Mitra)
          </h1>
          <p className="text-xl font-bold text-zinc-800">
            लावेल हायवे थांबा ↔ जीआयटी कॉलेज व हॉस्टेल
          </p>
        </div>

        {/* 3 Value Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-zinc-100 rounded-xl border border-black font-extrabold text-sm">
            <span className="text-xl font-black block">०%</span>
            कमिशन
          </div>
          <div className="p-3 bg-zinc-100 rounded-xl border border-black font-extrabold text-sm">
            <span className="text-xl font-black block">१००%</span>
            रोख भाडे
          </div>
          <div className="p-3 bg-zinc-100 rounded-xl border border-black font-extrabold text-sm">
            <span className="text-xl font-black block">समान</span>
            रांग वाटप
          </div>
        </div>

        {/* Big High-Contrast QR Code */}
        <div className="p-4 bg-zinc-50 border-4 border-dashed border-black rounded-3xl inline-block shadow-sm">
          <img
            src={qrCodeUrl}
            alt="Scan to Register Driver"
            className="w-56 h-56 mx-auto object-contain rounded-xl"
          />
          <p className="mt-3 text-sm font-black text-black">
            📱 मोबाईल कॅमेऱ्याने हा QR कोड स्कॅन करा
          </p>
          <p className="text-xs font-semibold text-zinc-600">
            किंवा भेट द्या: <span className="font-mono text-black">{registerUrl}</span>
          </p>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-amber-100/70 rounded-2xl border-2 border-amber-400 text-left space-y-1.5 text-xs font-bold text-zinc-900">
          <p>✓ नोंदणी पूर्णपणे मोफत आहे (Zero Fees).</p>
          <p>✓ कॉलेज विद्यार्थ्यांकडून फिक्स दराने थेट प्रवासी मिळतील.</p>
          <p>✓ एका दिवसात कॉलेज प्रशासनाकडून पडताळणी पूर्ण.</p>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t text-[11px] text-zinc-600 font-semibold">
          Gharda Institute of Technology (GIT), Lavel • अंतिम वर्ष विद्यार्थी प्रकल्प
        </div>
      </div>
    </div>
  );
};
