import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDriver } from "./DriverContext";
import { useAuth } from "@/features/auth/AuthContext";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/MapView";
import {
  Power,
  RotateCcw,
  TrendingUp,
  Clock,
  Phone,
  Navigation,
  CheckCircle,
  MapPin,
  Car,
  Star,
  Users,
  ShieldCheck,
  AlertCircle,
  Volume2,
} from "lucide-react";

export const DriverDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith("mr");
  const { profile } = useAuth();
  const {
    driver,
    currentOffer,
    activeTrip,
    queuePosition,
    totalOnlineDrivers,
    offerCountdown,
    todayEarnings,
    weeklyEarnings,
    completedTripsCount,
    isOnline,
    toggleOnline,
    acceptOffer,
    declineOffer,
    markArrived,
    startTrip,
    completeTrip,
  } = useDriver();

  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!driver) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground font-semibold">चालक प्रोफाइल लोड होत आहे...</p>
      </div>
    );
  }

  // Deep link to Google Maps Navigation
  const openNavigation = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-5 flex flex-col gap-4">
        {/* Driver Profile Bar */}
        <div className="p-4 rounded-2xl bg-card border-2 border-border shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rickshaw-400 text-black flex items-center justify-center text-2xl font-black shadow-sm">
              🛺
            </div>
            <div>
              <h2 className="font-extrabold text-lg leading-tight text-foreground">
                {profile?.full_name || "संतोष तांबडे"}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono font-black text-xs px-2 py-0.5 bg-muted rounded border">
                  {driver.auto_number}
                </span>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {driver.rating_avg.toFixed(1)} ({driver.rating_count})
                </span>
              </div>
            </div>
          </div>

          <Badge
            variant={
              driver.status === "approved"
                ? "success"
                : driver.status === "pending"
                ? "warning"
                : "destructive"
            }
            className="text-xs font-bold uppercase tracking-wide"
          >
            {driver.status === "approved" && "मंजूर (Approved)"}
            {driver.status === "pending" && "पडताळणी प्रलंबित"}
            {driver.status === "suspended" && "निलंबित"}
          </Badge>
        </div>

        {/* PENDING APPROVAL NOTICE */}
        {driver.status === "pending" && (
          <Card className="border-2 border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-extrabold text-lg">
                <Clock className="w-5 h-5" />
                <span>खाते पडताळणी सुरू आहे</span>
              </div>
              <CardDescription className="text-foreground text-sm font-medium">
                {t("driver.pendingApproval")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-background rounded-xl border text-xs text-muted-foreground space-y-1">
                <p>✓ तुमची रिक्षा नोंदणी: <strong>{driver.auto_number}</strong></p>
                <p>✓ क्षमता: <strong>{driver.seat_capacity} प्रवासी</strong></p>
                <p className="text-amber-600 font-semibold pt-1">
                  प्रशासक मंजुरीनंतर तुम्ही ऑनलाइन होऊन थेट प्रवासी भाडे घेऊ शकाल.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ACTIVE TRIP SCREEN */}
        {activeTrip ? (
          <Card className="border-2 border-rickshaw-400 shadow-xl overflow-hidden animate-in fade-in">
            <div className="p-4 bg-rickshaw-400 text-black flex items-center justify-between font-extrabold">
              <span className="text-lg flex items-center gap-2">
                <Car className="w-6 h-6 animate-pulse" />
                {activeTrip.status === "assigned" && "नवीन भाडे नियुक्त झाले"}
                {activeTrip.status === "arriving" && "पिकअप कडे निघालो"}
                {activeTrip.status === "on_trip" && "प्रवास चालू आहे 🛺"}
              </span>
              <span className="text-2xl font-black">₹{activeTrip.fare_amount}</span>
            </div>

            <CardContent className="p-5 space-y-4">
              {/* Passenger Info & Call */}
              <div className="p-3.5 bg-muted/60 rounded-2xl border flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">प्रवासी (Student):</span>
                  <strong className="text-base text-foreground">
                    {activeTrip.student?.full_name || "विद्यार्थी"}
                  </strong>
                  <span className="text-xs text-muted-foreground block">
                    {activeTrip.seats} सीट • {activeTrip.is_shared ? "शेअरिंग" : "फुल रिक्षा"}
                  </span>
                </div>

                <a
                  href={`tel:${activeTrip.student?.phone || "9123456789"}`}
                  className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow hover:bg-emerald-600 transition"
                  title="प्रवाशाला कॉल करा"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>

              {/* Map */}
              <MapView
                pickupCoords={
                  activeTrip.pickup
                    ? [activeTrip.pickup.lat, activeTrip.pickup.lng]
                    : [17.7289, 73.4981]
                }
                dropCoords={
                  activeTrip.drop
                    ? [activeTrip.drop.lat, activeTrip.drop.lng]
                    : [17.7425, 73.5132]
                }
                pickupName={isMr ? activeTrip.pickup?.name_mr : activeTrip.pickup?.name_en}
                dropName={isMr ? activeTrip.drop?.name_mr : activeTrip.drop?.name_en}
                className="h-44 w-full rounded-2xl"
              />

              {/* Navigation button */}
              {activeTrip.pickup && (
                <Button
                  variant="outline"
                  onClick={() =>
                    openNavigation(
                      activeTrip.status === "on_trip" && activeTrip.drop
                        ? activeTrip.drop.lat
                        : activeTrip.pickup!.lat,
                      activeTrip.status === "on_trip" && activeTrip.drop
                        ? activeTrip.drop.lng
                        : activeTrip.pickup!.lng
                    )
                  }
                  className="w-full rounded-xl border-2 font-bold flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5 text-blue-600" />
                  <span>
                    {activeTrip.status === "on_trip"
                      ? "ड्रॉपचे लोकेशन उघडा (Google Maps)"
                      : "पिकअप कडे नेव्हिगेशन सुरू करा"}
                  </span>
                </Button>
              )}

              {/* Cash Collection Banner */}
              <div className="p-3 bg-rickshaw-100 dark:bg-zinc-800 rounded-xl border-2 border-rickshaw-400 text-center">
                <span className="text-xs font-bold text-muted-foreground block">
                  {t("driver.collectCash")}
                </span>
                <span className="text-2xl font-black text-foreground">
                  ₹{activeTrip.fare_amount}
                </span>
                <span className="text-[11px] text-muted-foreground block">
                  (०% कमिशन • १००% भाडे तुमचे)
                </span>
              </div>

              {/* Lifecycle Action Buttons */}
              {activeTrip.status === "assigned" && (
                <Button
                  onClick={markArrived}
                  variant="driverAction"
                  className="w-full text-lg py-5 rounded-2xl"
                >
                  {t("driver.arrivedAtPickup")} (I Arrived)
                </Button>
              )}

              {activeTrip.status === "arriving" && (
                <Button
                  onClick={startTrip}
                  variant="driverAction"
                  className="w-full text-lg py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white border-black"
                >
                  {t("driver.startTrip")} (Start Trip)
                </Button>
              )}

              {activeTrip.status === "on_trip" && (
                <Button
                  onClick={completeTrip}
                  variant="driverAction"
                  className="w-full text-lg py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white border-black"
                >
                  ✓ {t("driver.completeTrip")} (Finish)
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          /* STANDARD ONLINE / OFFLINE CONTROLS & DASHBOARD */
          driver.status === "approved" && (
            <div className="space-y-4">
              {/* Big Online / Offline Toggle Button */}
              <button
                type="button"
                onClick={toggleOnline}
                className={`w-full py-6 px-4 rounded-3xl border-4 font-black text-2xl flex flex-col items-center justify-center gap-2 shadow-xl transition-all duration-300 active:scale-[0.98] ${
                  isOnline
                    ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600"
                    : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                }`}
              >
                <Power className="w-10 h-10 animate-pulse" />
                <span>{isOnline ? t("driver.online") : t("driver.offline")}</span>
                <span className="text-xs font-semibold opacity-90">
                  {isOnline ? "टॅप करा: काम थांबवा (Go Offline)" : "टॅप करा: भाडे मिळण्यास सुरुवात करा"}
                </span>
              </button>

              {/* FAIR TURN SYSTEM STATUS */}
              {isOnline && (
                <Card className="border-2 border-rickshaw-400 bg-rickshaw-50/70 dark:bg-zinc-900 shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("driver.turnStatus")}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rickshaw-200 dark:bg-rickshaw-900 text-rickshaw-900 dark:text-rickshaw-200">
                        एकूण {totalOnlineDrivers} चालक ऑनलाइन
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-black text-foreground">
                      {queuePosition === 1 ? (
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {t("driver.nextInLine")} 🎯
                        </span>
                      ) : (
                        `तुम्ही रांगेत #${queuePosition} क्रमांकावर आहात`
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {t("driver.turnExplanation")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}

              {/* EARNINGS METRICS */}
              <div className="grid grid-cols-3 gap-2.5">
                <Card className="border-2 text-center p-3">
                  <span className="text-[11px] font-bold text-muted-foreground block">
                    {t("driver.todayEarnings")}
                  </span>
                  <span className="text-xl font-black text-rickshaw-600 dark:text-rickshaw-400">
                    ₹{todayEarnings}
                  </span>
                </Card>
                <Card className="border-2 text-center p-3">
                  <span className="text-[11px] font-bold text-muted-foreground block">
                    {t("driver.weekEarnings")}
                  </span>
                  <span className="text-xl font-black text-foreground">
                    ₹{weeklyEarnings}
                  </span>
                </Card>
                <Card className="border-2 text-center p-3">
                  <span className="text-[11px] font-bold text-muted-foreground block">
                    {t("driver.completedTrips")}
                  </span>
                  <span className="text-xl font-black text-foreground">
                    {completedTripsCount || driver.total_trips}
                  </span>
                </Card>
              </div>

              {/* DEMAND FORECAST WIDGET */}
              <Card className="border-2 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-rickshaw-600" />
                    <CardTitle className="text-lg">{t("driver.demandForecast")}</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    {t("driver.busyHours")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-bold text-emerald-700 dark:text-emerald-300">
                      ८ - १० AM<br /><span className="text-[10px]">🔥 जास्त गर्दी</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/60 border font-bold text-muted-foreground">
                      ११ - २ PM<br /><span className="text-[10px]">मध्यम</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-bold text-emerald-700 dark:text-emerald-300">
                      ४ - ६ PM<br /><span className="text-[10px]">🔥 जास्त गर्दी</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-muted/60 border font-bold text-muted-foreground">
                      ७ - ९ PM<br /><span className="text-[10px]">हॉस्टेल परत</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground text-center">
                    💡 लावेल हायवे थांबा किंवा कॉलेज गेटवर या वेळेत उपस्थित राहून रिकामी फेरी वाचवा.
                  </p>
                </CardContent>
              </Card>
            </div>
          )
        )}
      </main>

      {/* FULL SCREEN INCOMING RIDE REQUEST MODAL */}
      {currentOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-background rounded-3xl max-w-sm w-full p-6 border-4 border-rickshaw-400 shadow-2xl space-y-4 animate-ring-pulse">
            {/* Countdown timer */}
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rickshaw-400 text-black text-xs font-black animate-pulse">
                <Volume2 className="w-4 h-4" /> {t("driver.incomingRequest")}
              </span>
              <span className="font-mono text-sm font-black px-2 py-0.5 bg-muted rounded border text-destructive">
                ⏱ {offerCountdown}s
              </span>
            </div>

            {/* Fare Callout */}
            <div className="text-center py-2 bg-rickshaw-50 dark:bg-zinc-900 rounded-2xl border-2 border-rickshaw-400">
              <span className="text-xs font-bold text-muted-foreground block">
                नक्की मिळणारे भाडे
              </span>
              <span className="text-4xl font-black text-foreground">
                ₹{currentOffer.ride?.fare_amount}
              </span>
              <span className="text-xs font-bold text-emerald-600 block mt-0.5">
                {currentOffer.ride?.seats} प्रवासी •{" "}
                {currentOffer.ride?.is_shared ? "शेअरिंग" : "फुल रिक्षा"}
              </span>
            </div>

            {/* Stops */}
            <div className="space-y-2 text-sm bg-muted/50 p-3 rounded-xl border">
              <div>
                <span className="text-xs text-muted-foreground block">📍 पिकअप (Pickup):</span>
                <strong className="text-foreground">
                  {isMr
                    ? currentOffer.ride?.pickup?.name_mr
                    : currentOffer.ride?.pickup?.name_en}
                </strong>
              </div>
              <div className="pt-1 border-t">
                <span className="text-xs text-muted-foreground block">🏁 ड्रॉप (Drop):</span>
                <strong className="text-foreground">
                  {isMr
                    ? currentOffer.ride?.drop?.name_mr
                    : currentOffer.ride?.drop?.name_en}
                </strong>
              </div>
            </div>

            {/* Accept / Decline Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Button
                variant="destructive"
                onClick={() => declineOffer("चालकाने नाकारले")}
                className="rounded-2xl font-bold h-14 text-base"
              >
                {t("driver.decline")}
              </Button>
              <Button
                onClick={acceptOffer}
                variant="driverAction"
                className="rounded-2xl font-black h-14 text-lg bg-emerald-500 hover:bg-emerald-600 text-white border-black"
              >
                {t("driver.accept")} ✓
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
