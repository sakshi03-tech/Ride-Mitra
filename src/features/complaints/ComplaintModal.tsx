import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Complaint, Ride } from "@/types/database";
import { getDemoDB, saveDemoDB } from "@/lib/supabase";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, X } from "lucide-react";

interface ComplaintModalProps {
  ride: Ride;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  ride,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [category, setCategory] = useState("overcharging");
  const [description, setDescription] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setLoading(true);
    const db = getDemoDB();
    const newComplaint: Complaint = {
      id: "comp-" + Date.now(),
      ride_id: ride.id,
      raised_by: user.id,
      against: ride.driver_id || "unknown",
      category,
      description,
      status: "open",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.complaints.push(newComplaint);

    // Notify admins
    const admins = db.profiles.filter((p) => p.role === "admin");
    admins.forEach((admin) => {
      db.notifications.push({
        id: "notif-comp-" + Date.now(),
        user_id: admin.id,
        title: "नवीन तक्रार दाखल झाली!",
        body: `प्रवासाविषयी नवीन तक्रार: ${category}`,
        type: "complaint",
        data: { complaint_id: newComplaint.id, ride_id: ride.id },
        is_read: false,
        created_at: new Date().toISOString(),
      });
    });

    saveDemoDB(db);
    setLoading(false);
    setIsSubmitted(true);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-background rounded-3xl max-w-md w-full p-6 border-2 border-border shadow-2xl relative space-y-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-muted-foreground hover:text-foreground rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-black text-foreground">तक्रार नोंदवली गेली!</h3>
            <p className="text-xs text-muted-foreground">
              कॉलेज प्रशासन यावर लवकरात लवकर कारवाई करेल आणि तुम्हाला कळवले जाईल.
            </p>
            <Button onClick={onClose} className="rounded-xl font-bold w-full mt-2">
              पूर्ण झाले (Done)
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground">{t("complaint.title")}</h3>
                <p className="text-xs text-muted-foreground">फेरी क्रमांक: #{ride.id.slice(-6)}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  {t("complaint.category")}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 rounded-xl border-2 border-input bg-background px-3 font-semibold text-sm"
                >
                  <option value="overcharging">{t("complaint.overcharging")}</option>
                  <option value="misbehavior">{t("complaint.misbehavior")}</option>
                  <option value="cancelledWithoutReason">
                    {t("complaint.cancelledWithoutReason")}
                  </option>
                  <option value="recklessDriving">{t("complaint.recklessDriving")}</option>
                  <option value="other">{t("complaint.other")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                  {t("complaint.description")}
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="काय अडचण आली ते थोडक्यात लिहा..."
                  className="w-full p-3 rounded-xl border-2 border-input bg-background text-sm font-medium focus:outline-none focus:border-rickshaw-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-xl"
                >
                  रद्द करा
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={loading}
                  className="flex-1 rounded-xl font-bold"
                >
                  {loading ? t("common.loading") : t("complaint.submit")}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
