import React from "react";
import { NotificationItem } from "@/types/database";
import { getDemoDB, saveDemoDB } from "@/lib/supabase";
import { useAuth } from "@/features/auth/AuthContext";
import { Bell, CheckCheck, X, Car, AlertTriangle, ShieldCheck } from "lucide-react";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  if (!isOpen) return null;

  const db = getDemoDB();
  const notifications = db.notifications
    .filter((n) => n.user_id === user?.id)
    .sort((a, b) => (b.created_at > a.created_at ? 1 : -1));

  const markAllRead = () => {
    notifications.forEach((n) => (n.is_read = true));
    saveDemoDB(db);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-background w-full max-w-sm h-full shadow-2xl flex flex-col p-5 border-l border-border animate-in slide-in-from-right">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rickshaw-600" />
            <h3 className="font-extrabold text-lg text-foreground">सूचना (Notifications)</h3>
          </div>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground p-1"
                title="सर्व वाचल्या म्हणून चिन्हांकित करा"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground text-sm">
              कोणतीही नवीन सूचना नाही.
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-2xl border text-sm transition ${
                  item.is_read
                    ? "bg-card border-border"
                    : "bg-rickshaw-50 dark:bg-zinc-900 border-rickshaw-400 font-semibold"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {item.type === "ride_offer" ? (
                      <Car className="w-5 h-5 text-rickshaw-600" />
                    ) : item.type === "sos_alert" ? (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    ) : (
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h4 className="font-extrabold text-xs text-foreground leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{item.body}</p>
                    <span className="text-[10px] text-muted-foreground block pt-1">
                      {new Date(item.created_at).toLocaleTimeString("mr-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
