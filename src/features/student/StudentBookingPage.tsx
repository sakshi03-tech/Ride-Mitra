import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBooking } from "./BookingContext";
import { useAuth } from "@/features/auth/AuthContext";
import { Header } from "@/components/Header";
import { MapView } from "@/components/MapView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Users,
  Clock,
  Phone,
  ShieldAlert,
  Star,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  History,
  Car,
} from "lucide-react";

export const StudentBookingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith("mr");
  const { profile } = useAuth();
  const {
    stops,
    activeRide,
    ridesHistory,
    pickupStopId,
    dropStopId,
    seats,
    isShared,
    scheduledTime,
    calculatedFare,
    isSearching,
    setPickupStopId,
    setDropStopId,
    setSeats,
    setIsShared,
    setScheduledTime,
    bookRide,
    cancelActiveRide,
    raiseSos,
    rateTrip,
  } = useBooking();

  const [bookingLoading, setBookingLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSosModal, setShowSosModal] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [ratingTags, setRatingTags] = useState<string[]>(["polite", "safeDriving"]);
  const [ratingComment, setRatingComment] = useState("");
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const pickupStop = stops.find((s) => s.id === pickupStopId);
  const dropStop = stops.find((s) => s.id === dropStopId);

  const handleBook = async () => {
    setBookingLoading(true);
    await bookRide();
    setBookingLoading(false);
  };

  const handleSos = async () => {
    await raiseSos();
    setSosSent(true);
    setTimeout(() => {
      setShowSosModal(false);
      setSosSent(false);
    }, 3000);
  };

  const handleRateSubmit = async () => {
    await rateTrip(selectedRating, ratingTags, ratingComment);
    setRatingSubmitted(true);
  };

  const toggleTag = (tag: string) => {
    if (ratingTags.includes(tag)) {
      setRatingTags(ratingTags.filter((t) => t !== tag));
    } else {
      setRatingTags([...ratingTags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-5 flex flex-col gap-4">
        {/* Welcome greeting & quick tab */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">
              {isMr ? "नमस्कार" : "Hello"},{" "}
              <span className="text-rickshaw-600 dark:text-rickshaw-400">
                {profile?.full_name || "विद्यार्थी"}
              </span>
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              लावेल ↔ जीआयटी कॉलेज हक्काचा रिक्षा प्रवास
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
            className="rounded-xl border-2 font-bold flex items-center gap-1.5"
          >
            <History className="w-4 h-4 text-rickshaw-600" />
            <span>{showHistory ? "बुकिंग करा" : "प्रवास इतिहास"}</span>
          </Button>
        </div>

        {/* ACTIVE RIDE CARD / TIMELINE */}
        {activeRide && !showHistory ? (
          <Card className="border-2 border-rickshaw-400 shadow-xl overflow-hidden animate-in fade-in">
            {/* Top Status Header */}
            <div className="p-4 bg-rickshaw-400 text-black flex items-center justify-between font-extrabold">
              <div className="flex items-center gap-2">
                <Car className="w-6 h-6 animate-bounce" />
                <span className="text-lg">
                  {activeRide.status === "searching" && "चालकाचा शोध सुरू आहे..."}
                  {activeRide.status === "assigned" && "चालक मिळाला!"}
                  {activeRide.status === "arriving" && "चालक पिकअप कडे येत आहे"}
                  {activeRide.status === "on_trip" && "प्रवास सुरू आहे 🛺"}
                  {activeRide.status === "completed" && "प्रवास पूर्ण झाला! ✓"}
                </span>
              </div>
              <span className="text-xl font-black">₹{activeRide.fare_amount}</span>
            </div>

            <CardContent className="p-5 space-y-4">
              {/* Map Preview */}
              <MapView
                pickupCoords={
                  activeRide.pickup
                    ? [activeRide.pickup.lat, activeRide.pickup.lng]
                    : [17.7289, 73.4981]
                }
                dropCoords={
                  activeRide.drop
                    ? [activeRide.drop.lat, activeRide.drop.lng]
                    : [17.7425, 73.5132]
                }
                pickupName={isMr ? activeRide.pickup?.name_mr : activeRide.pickup?.name_en}
                dropName={isMr ? activeRide.drop?.name_mr : activeRide.drop?.name_en}
                driverName={activeRide.driver?.profile?.full_name}
                driverCoords={
                  activeRide.driver
                    ? [17.735, 73.505]
                    : undefined
                }
                className="h-48 w-full rounded-xl"
              />

              {/* Status Specific Content */}
              {activeRide.status === "searching" && (
                <div className="py-4 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-rickshaw-100 dark:bg-rickshaw-950 mx-auto flex items-center justify-center animate-pulse">
                    <Clock className="w-8 h-8 text-rickshaw-600 animate-spin" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">{t("booking.searchingDriver")}</h3>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      {t("booking.searchingWait")}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => cancelActiveRide("प्रवाशाने विनंती मागे घेतली")}
                    className="border-destructive text-destructive hover:bg-destructive/10 rounded-xl"
                  >
                    {t("booking.cancelRide")}
                  </Button>
                </div>
              )}

              {(activeRide.status === "assigned" ||
                activeRide.status === "arriving" ||
                activeRide.status === "on_trip") && (
                <div className="space-y-4">
                  {/* Driver Profile Card */}
                  <div className="p-4 bg-muted/60 rounded-2xl border-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-rickshaw-400 flex items-center justify-center text-2xl font-black shadow-sm">
                        🛺
                      </div>
                      <div>
                        <h4 className="font-extrabold text-base text-foreground">
                          {activeRide.driver?.profile?.full_name || "संतोष तांबडे"}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-black text-sm bg-background px-2 py-0.5 rounded border">
                            {activeRide.driver?.auto_number || "MH 08 AG 4521"}
                          </span>
                          <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            {activeRide.driver?.rating_avg || 4.9}
                          </span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`tel:${activeRide.driver?.profile?.phone || "9822114455"}`}
                      className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow hover:bg-emerald-600 transition"
                      title={t("booking.callDriver")}
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Trip Steps */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        १
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">पिकअप (Pickup):</span>
                        <strong className="text-foreground">
                          {isMr ? activeRide.pickup?.name_mr : activeRide.pickup?.name_en}
                        </strong>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        २
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">ड्रॉप (Drop):</span>
                        <strong className="text-foreground">
                          {isMr ? activeRide.drop?.name_mr : activeRide.drop?.name_en}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Emergency SOS */}
                  <div className="flex items-center gap-2 pt-2">
                    {activeRide.status !== "on_trip" ? (
                      <Button
                        variant="outline"
                        onClick={() => cancelActiveRide("प्रवाशाने रद्द केले")}
                        className="flex-1 rounded-xl text-destructive hover:bg-destructive/10 border-destructive"
                      >
                        {t("booking.cancelRide")}
                      </Button>
                    ) : (
                      <div className="flex-1 p-2.5 bg-emerald-500/10 rounded-xl text-emerald-700 dark:text-emerald-300 font-bold text-center text-sm">
                        प्रवास सुरू आहे • पोहोचल्यावर रोख भाडे द्या
                      </div>
                    )}

                    <Button
                      variant="destructive"
                      onClick={() => setShowSosModal(true)}
                      className="rounded-xl px-4 flex items-center gap-1.5 font-extrabold animate-pulse"
                      title="आपत्कालीन मदत"
                    >
                      <ShieldAlert className="w-5 h-5" />
                      <span>SOS</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* RATING FORM (When Completed) */}
              {activeRide.status === "completed" && (
                <div className="py-2 space-y-4">
                  {!ratingSubmitted ? (
                    <>
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-1" />
                        <h3 className="font-extrabold text-xl">{t("rating.title")}</h3>
                        <p className="text-xs text-muted-foreground">
                          तुमचा अभिप्राय सेवेचा दर्जा सुधारण्यासाठी महत्त्वाचा आहे
                        </p>
                      </div>

                      {/* 5-Star Selector */}
                      <div className="flex justify-center gap-2 py-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setSelectedRating(star)}
                            className="p-1 text-3xl focus:outline-none transition transform hover:scale-110"
                          >
                            <Star
                              className={`w-9 h-9 ${
                                star <= selectedRating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {/* Tag pills */}
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {[
                          { id: "polite", label: t("rating.polite") },
                          { id: "safeDriving", label: t("rating.safeDriving") },
                          { id: "onTime", label: t("rating.onTime") },
                          { id: "cleanAuto", label: t("rating.cleanAuto") },
                        ].map((tag) => (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                              ratingTags.includes(tag.id)
                                ? "bg-rickshaw-400 text-black border-black"
                                : "bg-background text-muted-foreground border-border hover:border-rickshaw-400"
                            }`}
                          >
                            {tag.label}
                          </button>
                        ))}
                      </div>

                      <textarea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        placeholder={t("rating.comment")}
                        className="w-full p-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:border-rickshaw-500"
                        rows={2}
                      />

                      <Button
                        onClick={handleRateSubmit}
                        className="w-full font-bold text-base rounded-xl"
                      >
                        {t("rating.submit")}
                      </Button>
                    </>
                  ) : (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-center space-y-2 border border-emerald-500/20">
                      <p className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        रेटिंग सबमिट केले! धन्यवाद.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => window.location.reload()}
                        className="rounded-xl font-bold"
                      >
                        नवीन रिक्षा बुक करा
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : showHistory ? (
          /* RIDE HISTORY LIST */
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <History className="w-5 h-5 text-rickshaw-600" />
                <span>माझे प्रवास (Ride History)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ridesHistory.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  अजून कोणताही प्रवास झालेला नाही.
                </div>
              ) : (
                ridesHistory.map((ride) => {
                  const pStop = stops.find((s) => s.id === ride.pickup_stop);
                  const dStop = stops.find((s) => s.id === ride.drop_stop);
                  return (
                    <div
                      key={ride.id}
                      className="p-3.5 rounded-xl border bg-card hover:border-rickshaw-400 transition space-y-2 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-base text-foreground">
                          ₹{ride.fare_amount}
                        </span>
                        <Badge
                          variant={
                            ride.status === "completed"
                              ? "success"
                              : ride.status === "cancelled"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {ride.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-0.5">
                        <p>
                          📍 <strong>पिकअप:</strong> {isMr ? pStop?.name_mr : pStop?.name_en}
                        </p>
                        <p>
                          🏁 <strong>ड्रॉप:</strong> {isMr ? dStop?.name_mr : dStop?.name_en}
                        </p>
                        <p className="pt-1 text-[11px]">
                          {new Date(ride.requested_at).toLocaleString("mr-IN")}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        ) : (
          /* NEW BOOKING FORM */
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-black">{t("booking.title")}</CardTitle>
              <p className="text-xs text-muted-foreground">
                नक्की फिक्स दर • शून्य घासाघिस • थेट रिक्षा चालक वाटप
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Corridor Stops Selection */}
              <div className="space-y-3 p-4 bg-muted/40 rounded-2xl border-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    १. {t("booking.pickup")}
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-emerald-600 absolute left-3.5 top-3.5" />
                    <select
                      value={pickupStopId}
                      onChange={(e) => setPickupStopId(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-input bg-background font-bold text-base focus:border-rickshaw-500 focus:outline-none"
                    >
                      {stops.map((s) => (
                        <option key={s.id} value={s.id}>
                          {isMr ? s.name_mr : s.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    २. {t("booking.drop")}
                  </label>
                  <div className="relative">
                    <Navigation className="w-5 h-5 text-red-600 absolute left-3.5 top-3.5" />
                    <select
                      value={dropStopId}
                      onChange={(e) => setDropStopId(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-input bg-background font-bold text-base focus:border-rickshaw-500 focus:outline-none"
                    >
                      {stops.map((s) => (
                        <option key={s.id} value={s.id} disabled={s.id === pickupStopId}>
                          {isMr ? s.name_mr : s.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Ride Type & Passenger Options */}
              <div className="grid grid-cols-2 gap-3">
                {/* Private vs Shared */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground block">
                    प्रवासाचा प्रकार
                  </label>
                  <div className="grid grid-cols-2 p-1 bg-muted rounded-xl border">
                    <button
                      type="button"
                      onClick={() => setIsShared(false)}
                      className={`py-2 text-xs font-bold rounded-lg transition ${
                        !isShared ? "bg-rickshaw-400 text-black shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      फुल रिक्षा
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsShared(true)}
                      className={`py-2 text-xs font-bold rounded-lg transition ${
                        isShared ? "bg-rickshaw-400 text-black shadow-sm" : "text-muted-foreground"
                      }`}
                    >
                      शेअरिंग
                    </button>
                  </div>
                </div>

                {/* Seats */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground block">
                    प्रवासी संख्या (Seats)
                  </label>
                  <div className="flex items-center gap-1.5 h-10">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setSeats(num)}
                        className={`flex-1 h-10 rounded-xl font-black text-sm border-2 transition ${
                          seats === num
                            ? "border-black bg-rickshaw-400 text-black"
                            : "border-input bg-background text-foreground hover:border-rickshaw-400"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leaflet Corridor Map Preview */}
              <MapView
                pickupCoords={
                  pickupStop ? [pickupStop.lat, pickupStop.lng] : [17.7289, 73.4981]
                }
                dropCoords={dropStop ? [dropStop.lat, dropStop.lng] : [17.7425, 73.5132]}
                pickupName={isMr ? pickupStop?.name_mr : pickupStop?.name_en}
                dropName={isMr ? dropStop?.name_mr : dropStop?.name_en}
                className="h-44 w-full rounded-2xl"
              />

              {/* Upfront Fare Callout */}
              <div className="p-4 rounded-2xl bg-rickshaw-50 dark:bg-zinc-900 border-2 border-rickshaw-400 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-muted-foreground block">
                    {t("booking.fareEstimate")}
                  </span>
                  <span className="text-2xl font-black text-foreground">
                    ₹{calculatedFare}
                  </span>
                  <span className="text-[11px] text-muted-foreground block">
                    {isShared ? `(₹${calculatedFare / seats} प्रति सीट)` : "थेट फिक्स भाडे"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
                    ✓ नो बार्गेनिंग
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <Button
                onClick={handleBook}
                disabled={bookingLoading || calculatedFare <= 0}
                variant="driverAction"
                className="w-full text-lg py-5 rounded-2xl"
              >
                {bookingLoading ? t("common.loading") : t("booking.confirmBooking")} (₹
                {calculatedFare}) →
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Emergency SOS Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-background rounded-3xl max-w-sm w-full p-6 border-2 border-destructive shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive mx-auto flex items-center justify-center">
              <ShieldAlert className="w-10 h-10 animate-bounce" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-destructive">
                {t("booking.sos")} (Emergency Alert)
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t("booking.sosConfirm")}
              </p>
            </div>

            {sosSent ? (
              <div className="p-3 bg-destructive/10 text-destructive rounded-xl text-center font-bold text-sm">
                ✓ आपत्कालीन इशारा प्रशासकांकडे पाठवला आहे!
              </div>
            ) : (
              <>
                <div className="p-3 bg-muted rounded-xl space-y-1.5 text-xs">
                  <p className="font-bold text-foreground">तात्काळ संपर्क क्रमांक:</p>
                  <p>🚨 पोलीस नियंत्रण कक्ष: <strong>112</strong></p>
                  <p>🏫 GIT सुरक्षा कक्ष: <strong>02356-262795</strong></p>
                  <p>🚑 रुग्णवाहिका: <strong>108</strong></p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSosModal(false)}
                    className="flex-1 rounded-xl"
                  >
                    रद्द करा
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleSos}
                    className="flex-1 rounded-xl font-bold"
                  >
                    होय, SOS पाठवा
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
