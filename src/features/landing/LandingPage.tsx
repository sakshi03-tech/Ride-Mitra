import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  QrCode,
  ArrowRight,
  TrendingDown,
  Users,
  Smartphone,
  Star,
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith("mr");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-rickshaw-100/60 via-background to-background dark:from-rickshaw-950/30 py-12 sm:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rickshaw-400/30 border border-rickshaw-400 text-rickshaw-950 dark:text-rickshaw-200 text-xs sm:text-sm font-extrabold shadow-sm">
              <span>🛺 लावेल ↔ जीआयटी कॉलेज आणि हॉस्टेल कॉरिडॉर</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
              {isMr ? (
                <>
                  हक्काची रिक्षा, <span className="text-rickshaw-600 dark:text-rickshaw-400">फिक्स दर</span> आणि शून्य घासाघिस.
                </>
              ) : (
                <>
                  Fair Rides, <span className="text-rickshaw-600 dark:text-rickshaw-400">Fixed Fares</span> & Zero Bargaining.
                </>
              )}
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground font-medium">
              {isMr
                ? "विद्यार्थ्यांना वेळेवर रिक्षा मिळवण्यासाठी आणि रिक्षा चालकांना फेऱ्यांची समान संधी देऊन इंधन व वेळ वाचवणारे स्थानिक बुकिंग पोर्टल."
                : "Dedicated corridor auto booking connecting Lavel Highway Stop with GIT Campus & Hostel with transparent pricing."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/book" className="w-full sm:w-auto">
                <Button
                  variant="driverAction"
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl"
                >
                  <span>{t("nav.bookRide")}</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/drivers" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto text-base font-bold px-6 py-6 rounded-2xl border-2 hover:border-rickshaw-400"
                >
                  <Car className="w-5 h-5 mr-2 text-rickshaw-600" />
                  <span>{t("nav.driverPitch")}</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 4 STEPS HOW IT WORKS */}
        <section className="py-12 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {isMr ? "कसे कार्य करते? (How it works)" : "How Ride Mitra Works"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isMr ? "केवळ ४ सोप्या टप्प्यांत रिक्षा प्रवास" : "Book your auto in 4 simple taps"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                step: "१",
                title: isMr ? "थांबा निवडा" : "Select Stops",
                desc: isMr
                  ? "लावेल हायवे, बाजार, जीआयटी मुख्य गेट किंवा हॉस्टेल निवडा."
                  : "Choose pickup and drop from fixed corridor stops.",
                icon: MapPin,
              },
              {
                step: "२",
                title: isMr ? "नक्की भाडे पाहा" : "Upfront Fixed Fare",
                desc: isMr
                  ? "भाडे आधीच स्पष्ट दिसते. कसलीही घासाघिस किंवा अनिश्चितता नाही."
                  : "Transparent fare from matrix. Zero bargaining.",
                icon: ShieldCheck,
              },
              {
                step: "३",
                title: isMr ? "रांगेतील चालकास वाटप" : "Fair Turn Allocation",
                desc: isMr
                  ? "सर्वात जास्त वेळ थांबलेल्या चालकाला फेऱ्यांची पहिली संधी."
                  : "Fair rotation queue offers ride to longest-waiting driver.",
                icon: Clock,
              },
              {
                step: "४",
                title: isMr ? "सुरक्षित प्रवास" : "Safe & Direct Trip",
                desc: isMr
                  ? "चालकाचे नाव, रिक्षा नंबर, फोन नंबर व थेट रोख भाडे."
                  : "Track your auto, call driver directly, and pay cash.",
                icon: CheckCircle2,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={idx} className="border-2 p-5 text-center relative overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-rickshaw-400 text-black font-black text-sm flex items-center justify-center mx-auto mb-3 shadow">
                    {item.step}
                  </div>
                  <Icon className="w-6 h-6 text-rickshaw-600 mx-auto mb-2" />
                  <h3 className="font-extrabold text-base text-foreground mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* BENEFITS FOR BOTH SIDES */}
        <section className="py-12 bg-muted/40 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {/* Students */}
            <Card className="border-2 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                  🎓
                </div>
                <div>
                  <h3 className="font-black text-xl text-foreground">विद्यार्थ्यांचे फायदे</h3>
                  <p className="text-xs text-muted-foreground">कॉलेज व हॉस्टेल विद्यार्थ्यांसाठी</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-foreground font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>रस्त्यावर रिक्षा शोधण्यात वेळ वाया जात नाही.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>फिक्स दर असल्याने जादा भाडे आकारले जात नाही.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>शेअरिंग पर्यायामुळे दर डोई भाडे कमी होते.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>आपत्कालीन SOS बटणामुळे सुरक्षिततेची हमी.</span>
                </li>
              </ul>
            </Card>

            {/* Drivers */}
            <Card className="border-2 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rickshaw-400 text-black flex items-center justify-center text-xl font-bold">
                  🛺
                </div>
                <div>
                  <h3 className="font-black text-xl text-foreground">रिक्षा चालकांचे फायदे</h3>
                  <p className="text-xs text-muted-foreground">स्थानिक चालक बंधूंसाठी</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-foreground font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>०% कमिशन • नोंदणी मोफत • पूर्ण भाडे चालकाचे.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>रांगेनुसार निष्पक्ष वाटप (Fair Turn Queue) - कोणावरही अन्याय नाही.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>रिकामी फेरी कमी होऊन डिझेल/पेट्रोलची बचत.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>गर्दीच्या वेळा आधीच समजतात (Demand Forecast).</span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* BOTTOM BANNER */}
        <section className="py-12 px-4 max-w-4xl mx-auto text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            आजच रिक्षा मित्रचा अनुभव घ्या
          </h2>
          <div className="flex justify-center gap-3">
            <Link to="/book">
              <Button variant="driverAction" className="rounded-xl px-6">
                रिक्षा बुक करा (Book Now) →
              </Button>
            </Link>
            <Link to="/poster">
              <Button variant="outline" className="rounded-xl px-5 border-2">
                <QrCode className="w-4 h-4 mr-2" />
                QR पोस्टर पाहा
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t py-6 px-4 bg-background text-center text-xs text-muted-foreground space-y-2">
        <p className="font-bold text-foreground">
          रिक्षा मित्र (Ride Mitra) • लावेल ↔ जीआयटी कॉलेज कॉरिडॉर
        </p>
        <p>Gharda Institute of Technology (GIT), Lavel • Final Year Engineering Project</p>
        <p className="text-[11px] pt-1">
          <Link to="/login" className="hover:underline text-rickshaw-600 font-semibold mr-3">
            लॉगिन
          </Link>
          <Link to="/drivers" className="hover:underline text-rickshaw-600 font-semibold mr-3">
            चालकांसाठी
          </Link>
          <Link to="/admin" className="hover:underline text-rickshaw-600 font-semibold">
            प्रशासक
          </Link>
        </p>
      </footer>
    </div>
  );
};
