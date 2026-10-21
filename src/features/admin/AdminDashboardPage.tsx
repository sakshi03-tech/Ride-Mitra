import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import { getDemoDB, saveDemoDB } from "@/lib/supabase";
import { Driver, Profile, Ride, Stop, Fare, Complaint, SosAlert } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ShieldAlert,
  Users,
  Car,
  MapPin,
  Banknote,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Download,
  Settings,
  TrendingUp,
  Activity,
  Layers,
} from "lucide-react";

export const AdminDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isMr = i18n.language.startsWith("mr");

  const [activeTab, setActiveTab] = useState<
    "overview" | "drivers" | "stops_fares" | "complaints_sos" | "analytics" | "settings"
  >("overview");

  const [db, setDb] = useState(getDemoDB());
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionModalDriverId, setRejectionModalDriverId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const refreshData = () => {
    setDb(getDemoDB());
  };

  useEffect(() => {
    window.addEventListener("storage_db_updated", refreshData);
    return () => window.removeEventListener("storage_db_updated", refreshData);
  }, []);

  // Admin Actions
  const handleApproveDriver = (profileId: string) => {
    const database = getDemoDB();
    const d = database.drivers.find((item) => item.profile_id === profileId);
    if (d) {
      d.status = "approved";
      d.rejection_reason = undefined;
      // Add notification to driver
      database.notifications.push({
        id: "notif-appr-" + Date.now(),
        user_id: profileId,
        title: "अभिनंदन! तुमचे खाते मंजूर झाले आहे.",
        body: "तुम्ही आता ऑनलाइन होऊन थेट भाडे मिळवू शकता.",
        type: "driver_approved",
        data: {},
        is_read: false,
        created_at: new Date().toISOString(),
      });
      // Audit log
      database.auditLog = database.auditLog || [];
      database.auditLog.push({
        id: "audit-" + Date.now(),
        action: "APPROVE_DRIVER",
        entity: "drivers",
        entity_id: profileId,
        created_at: new Date().toISOString(),
      });
      saveDemoDB(database);
      refreshData();
    }
  };

  const handleRejectDriver = (profileId: string) => {
    const database = getDemoDB();
    const d = database.drivers.find((item) => item.profile_id === profileId);
    if (d) {
      d.status = "rejected";
      d.rejection_reason = rejectionReason || "कागदपत्रे अपूर्ण आहेत.";
      saveDemoDB(database);
      setRejectionModalDriverId(null);
      setRejectionReason("");
      refreshData();
    }
  };

  const handleToggleSuspendDriver = (profileId: string) => {
    const database = getDemoDB();
    const d = database.drivers.find((item) => item.profile_id === profileId);
    if (d) {
      d.status = d.status === "suspended" ? "approved" : "suspended";
      d.is_online = false;
      saveDemoDB(database);
      refreshData();
    }
  };

  const handleToggleBlockStudent = (profileId: string) => {
    const database = getDemoDB();
    const p = database.profiles.find((item) => item.id === profileId);
    if (p) {
      p.is_blocked = !p.is_blocked;
      saveDemoDB(database);
      refreshData();
    }
  };

  const handleResolveSos = (sosId: string) => {
    const database = getDemoDB();
    const alert = database.sosAlerts.find((item) => item.id === sosId);
    if (alert) {
      alert.status = "resolved";
      saveDemoDB(database);
      refreshData();
    }
  };

  const handleResolveComplaint = (complaintId: string, resolution: string) => {
    const database = getDemoDB();
    const c = database.complaints.find((item) => item.id === complaintId);
    if (c) {
      c.status = "resolved";
      c.resolution_message = resolution;
      c.resolved_at = new Date().toISOString();
      saveDemoDB(database);
      refreshData();
    }
  };

  // CSV Export for Rides
  const exportRidesCsv = () => {
    const headers = "Ride ID,Requested At,Fare,Status,Pickup,Drop\n";
    const rows = db.rides.map(
      (r) =>
        `"${r.id}","${r.requested_at}",${r.fare_amount},"${r.status}","${r.pickup_stop}","${r.drop_stop}"`
    );
    const blob = new Blob([headers + rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ride-mitra-rides-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const onlineDriversCount = db.drivers.filter((d) => d.status === "approved" && d.is_online).length;
  const activeRidesCount = db.rides.filter(
    (r) => r.status === "searching" || r.status === "assigned" || r.status === "on_trip"
  ).length;
  const completedRidesCount = db.rides.filter((r) => r.status === "completed").length;
  const completionRate =
    db.rides.length > 0 ? Math.round((completedRidesCount / db.rides.length) * 100) : 100;

  // Chart data
  const hourlyData = [
    { hour: "8 AM", rides: 14 },
    { hour: "9 AM", rides: 22 },
    { hour: "10 AM", rides: 9 },
    { hour: "12 PM", rides: 6 },
    { hour: "2 PM", rides: 8 },
    { hour: "4 PM", rides: 18 },
    { hour: "5 PM", rides: 25 },
    { hour: "6 PM", rides: 15 },
    { hour: "8 PM", rides: 11 },
  ];

  const pieData = [
    { name: "पूर्ण फेऱ्या (Completed)", value: completedRidesCount || 18, color: "#10B981" },
    { name: "रद्द फेऱ्या (Cancelled)", value: 2, color: "#EF4444" },
    { name: "चालू फेऱ्या (Active)", value: activeRidesCount || 1, color: "#FACC15" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Top Priority SOS Alerts Banner */}
        {db.sosAlerts.filter((s) => s.status === "active").length > 0 && (
          <div className="p-4 bg-destructive text-destructive-foreground rounded-2xl shadow-xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-8 h-8" />
              <div>
                <h4 className="font-black text-lg">
                  🚨 {db.sosAlerts.filter((s) => s.status === "active").length} तात्काळ SOS इशारा!
                </h4>
                <p className="text-xs opacity-90">
                  प्रवासादरम्यान आपत्कालीन मदत मागितली गेली आहे. तातडीने संपर्क साधा.
                </p>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => setActiveTab("complaints_sos")}
              className="font-bold text-xs rounded-xl"
            >
              तपासा (Inspect) →
            </Button>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b">
          {[
            { id: "overview", label: "डॅशबोर्ड (Overview)", icon: Activity },
            { id: "drivers", label: "चालक पडताळणी (Drivers)", icon: Car },
            { id: "stops_fares", label: "थांबे व भाडे (Stops & Fares)", icon: Banknote },
            { id: "complaints_sos", label: "तक्रारी व SOS (Complaints)", icon: AlertCircle },
            { id: "analytics", label: "आकडेवारी (Analytics)", icon: TrendingUp },
            { id: "settings", label: "सेटिंग्ज (Settings)", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? "bg-rickshaw-400 text-black shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-5 animate-in fade-in">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <Card className="border-2 p-4">
                <span className="text-xs font-bold text-muted-foreground block">
                  {t("admin.onlineDrivers")}
                </span>
                <span className="text-3xl font-black text-foreground mt-1 block">
                  {onlineDriversCount}
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  सक्रिय चालक उपलब्ध
                </span>
              </Card>

              <Card className="border-2 p-4">
                <span className="text-xs font-bold text-muted-foreground block">
                  {t("admin.activeRides")}
                </span>
                <span className="text-3xl font-black text-rickshaw-600 mt-1 block">
                  {activeRidesCount}
                </span>
                <span className="text-[11px] text-muted-foreground">मार्गस्थ रिक्षा</span>
              </Card>

              <Card className="border-2 p-4">
                <span className="text-xs font-bold text-muted-foreground block">
                  एकूण फेऱ्या (Trips)
                </span>
                <span className="text-3xl font-black text-foreground mt-1 block">
                  {db.rides.length}
                </span>
                <span className="text-[11px] text-muted-foreground">प्रणालीवरील नोंद</span>
              </Card>

              <Card className="border-2 p-4">
                <span className="text-xs font-bold text-muted-foreground block">
                  {t("admin.completionRate")}
                </span>
                <span className="text-3xl font-black text-emerald-600 mt-1 block">
                  {completionRate}%
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold">उत्कृष्ट सेवा स्तर</span>
              </Card>
            </div>

            {/* Quick Actions & Recent Rides */}
            <Card className="border-2 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-lg">नुकत्याच झालेल्या फेऱ्या (Recent Rides)</CardTitle>
                  <CardDescription className="text-xs">
                    थेट बुकिंग स्थिती व प्रवासी-चालक वाटप
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportRidesCsv}
                  className="rounded-xl border-2 font-bold flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>CSV निर्यात करा</span>
                </Button>
              </CardHeader>

              <CardContent className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground uppercase">
                      <th className="py-2.5 px-3">फेरी आयडी</th>
                      <th className="py-2.5 px-3">पिकअप ↔ ड्रॉप</th>
                      <th className="py-2.5 px-3">भाडे</th>
                      <th className="py-2.5 px-3">प्रकार</th>
                      <th className="py-2.5 px-3">स्थिती</th>
                      <th className="py-2.5 px-3">वेळ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {db.rides.slice(0, 8).map((ride) => (
                      <tr key={ride.id} className="hover:bg-muted/40">
                        <td className="py-3 px-3 font-mono font-bold text-xs">
                          #{ride.id.slice(-6)}
                        </td>
                        <td className="py-3 px-3">
                          {db.stops.find((s) => s.id === ride.pickup_stop)?.name_mr || "Lavel"} →{" "}
                          {db.stops.find((s) => s.id === ride.drop_stop)?.name_mr || "GIT"}
                        </td>
                        <td className="py-3 px-3 font-black">₹{ride.fare_amount}</td>
                        <td className="py-3 px-3 text-xs">
                          {ride.is_shared ? "शेअरिंग" : "फुल"} ({ride.seats} सीट)
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              ride.status === "completed"
                                ? "success"
                                : ride.status === "cancelled"
                                ? "destructive"
                                : "default"
                            }
                          >
                            {ride.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-xs text-muted-foreground">
                          {new Date(ride.requested_at).toLocaleTimeString("mr-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: DRIVER VERIFICATION QUEUE */}
        {activeTab === "drivers" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-foreground">
                  चालक पडताळणी कक्ष ({db.drivers.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  नवीन नोंदणी तपासणे, मंजुरी देणे व गैरवर्तनावर निलंबन करणे
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              {db.drivers.map((drv) => {
                const prof = db.profiles.find((p) => p.id === drv.profile_id);
                return (
                  <Card key={drv.profile_id} className="border-2 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-rickshaw-400 text-black flex items-center justify-center text-2xl font-black">
                          🛺
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-base text-foreground">
                              {prof?.full_name}
                            </h4>
                            <Badge
                              variant={
                                drv.status === "approved"
                                  ? "success"
                                  : drv.status === "pending"
                                  ? "warning"
                                  : "destructive"
                              }
                            >
                              {drv.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            रिक्षा: <strong className="font-mono text-foreground">{drv.auto_number}</strong> • फोन: {prof?.phone} • क्षमता: {drv.seat_capacity} सीट
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            एकूण फेऱ्या: {drv.total_trips} • रेटिंग: ★{drv.rating_avg.toFixed(1)} ({drv.rating_count})
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {drv.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveDriver(drv.profile_id)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl"
                            >
                              ✓ मंजूर करा
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setRejectionModalDriverId(drv.profile_id)}
                              className="rounded-xl font-bold"
                            >
                              नाकारा
                            </Button>
                          </>
                        )}

                        {drv.status === "approved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleSuspendDriver(drv.profile_id)}
                            className="rounded-xl text-destructive hover:bg-destructive/10 border-destructive text-xs font-bold"
                          >
                            निलंबित करा
                          </Button>
                        )}

                        {drv.status === "suspended" && (
                          <Button
                            size="sm"
                            onClick={() => handleToggleSuspendDriver(drv.profile_id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl"
                          >
                            पुन्हा सक्रिय करा
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STOPS & FARES MANAGEMENT */}
        {activeTab === "stops_fares" && (
          <div className="grid md:grid-cols-2 gap-5 animate-in fade-in">
            {/* Stops */}
            <Card className="border-2 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rickshaw-600" />
                  <span>कॉरिडॉर थांबे (Corridor Stops)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {db.stops.map((stop) => (
                  <div
                    key={stop.id}
                    className="p-3 rounded-xl border bg-card flex items-center justify-between"
                  >
                    <div>
                      <p className="font-extrabold text-sm text-foreground">{stop.name_mr}</p>
                      <p className="text-xs text-muted-foreground">{stop.name_en}</p>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {stop.lat}, {stop.lng}
                      </span>
                    </div>
                    <Badge variant={stop.is_active ? "success" : "secondary"}>
                      {stop.is_active ? "सक्रिय" : "निष्क्रिय"}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Fare Matrix */}
            <Card className="border-2 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-emerald-600" />
                  <span>भाडे तक्ता (Fare Matrix)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  नक्की फिक्स दर • कोणतीही घासाघिस नाही
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {db.fares.map((fare) => {
                  const fStop = db.stops.find((s) => s.id === fare.from_stop);
                  const tStop = db.stops.find((s) => s.id === fare.to_stop);
                  return (
                    <div
                      key={fare.id}
                      className="p-3 rounded-xl border bg-card flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          {fStop?.name_mr} ↔ {tStop?.name_mr}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          रात्रीचा जादा दर: ₹{fare.night_surcharge}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-base text-foreground block">
                          ₹{fare.base_fare} (फुल)
                        </span>
                        <span className="text-xs font-bold text-emerald-600 block">
                          ₹{fare.per_seat_fare} / सीट
                        </span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 4: COMPLAINTS & SOS */}
        {activeTab === "complaints_sos" && (
          <div className="space-y-5 animate-in fade-in">
            {/* SOS Alerts */}
            <Card className="border-2 border-destructive/40 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-destructive flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span>आपत्कालीन SOS इशारे ({db.sosAlerts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {db.sosAlerts.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    कोणताही SOS इशारा नाही. सर्व सुरक्षित.
                  </p>
                ) : (
                  db.sosAlerts.map((sos) => (
                    <div
                      key={sos.id}
                      className="p-3.5 rounded-xl border-2 border-destructive/40 bg-destructive/5 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-black text-destructive block">
                          इशारा: #{sos.id.slice(-6)} • फेरी #{sos.ride_id.slice(-6)}
                        </span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          वेळ: {new Date(sos.created_at).toLocaleString("mr-IN")} • Location: {sos.lat}, {sos.lng}
                        </p>
                      </div>
                      {sos.status === "active" ? (
                        <Button
                          size="sm"
                          onClick={() => handleResolveSos(sos.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs"
                        >
                          निवारण केले (Resolve)
                        </Button>
                      ) : (
                        <Badge variant="success">निवारित</Badge>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Complaints */}
            <Card className="border-2 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span>तक्रार निवारण कक्ष ({db.complaints.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {db.complaints.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    कोणतीही प्रलंबित तक्रार नाही.
                  </p>
                ) : (
                  db.complaints.map((comp) => (
                    <div key={comp.id} className="p-4 rounded-xl border bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-foreground">
                          प्रकार: {comp.category}
                        </span>
                        <Badge
                          variant={comp.status === "resolved" ? "success" : "warning"}
                        >
                          {comp.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground bg-muted p-2.5 rounded-lg">
                        "{comp.description}"
                      </p>
                      {comp.status === "open" && (
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleResolveComplaint(comp.id, "चालकास समज देण्यात आली.")
                            }
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg"
                          >
                            ✓ समज दिली व तक्रार मिटवली
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 5: ANALYTICS & CHARTS */}
        {activeTab === "analytics" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Hourly Traffic Chart */}
              <Card className="border-2 p-4">
                <h4 className="font-extrabold text-base mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-rickshaw-600" />
                  <span>तासनिहाय मागणी (Peak Hours Heatmap)</span>
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <XAxis dataKey="hour" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="rides" fill="#FACC15" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  सकाळी ८-१० आणि दुपारी ४-६ या वेळात सर्वाधिक फेऱ्या होतात.
                </p>
              </Card>

              {/* Status Pie Chart */}
              <Card className="border-2 p-4">
                <h4 className="font-extrabold text-base mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  <span>फेऱ्यांची पूर्णता (Trip Completion Breakdown)</span>
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === "settings" && (
          <Card className="border-2 max-w-xl mx-auto animate-in fade-in">
            <CardHeader>
              <CardTitle className="text-lg">सिस्टीम सेटिंग्ज (System Settings)</CardTitle>
              <CardDescription className="text-xs">
                वेळ मर्यादा, फेरी नियम आणि सूचना फलक
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  विनंती वेळ मर्यादा (Request Timeout)
                </label>
                <Input defaultValue="30 सेकंद" readOnly className="font-bold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  नाकारल्यास कमाल संधी (Max Decline Strikes)
                </label>
                <Input defaultValue="3 स्ट्राइक (त्यानंतर आपोआप ऑफलाइन)" readOnly className="font-bold" />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  सार्वजनिक सूचना फलक (Announcement Banner)
                </label>
                <Input
                  defaultValue="रिक्षा मित्र पायलट चाचणी लावेल कॉरिडॉरमध्ये सुरू आहे!"
                  className="font-bold"
                />
              </div>

              <Button className="w-full rounded-xl font-bold">
                सेटिंग्ज जतन करा (Save Settings)
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Driver Rejection Modal */}
      {rejectionModalDriverId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-background rounded-3xl max-w-sm w-full p-6 border-2 border-border shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-destructive">चालक नोंदणी नाकारा</h3>
            <p className="text-xs text-muted-foreground">
              चालकाला नाकारण्याचे स्पष्ट कारण द्या जेणेकरून ते दुरुस्त करू शकतील:
            </p>
            <textarea
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="उदा. ड्रायव्हिंग लायसन्स फोटो अस्पष्ट आहे किंवा नंबर प्लेट जुळत नाही..."
              className="w-full p-3 rounded-xl border-2 border-input bg-background text-sm font-medium"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setRejectionModalDriverId(null)}
                className="flex-1 rounded-xl"
              >
                रद्द करा
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleRejectDriver(rejectionModalDriverId)}
                className="flex-1 rounded-xl font-bold"
              >
                नाकारा
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
