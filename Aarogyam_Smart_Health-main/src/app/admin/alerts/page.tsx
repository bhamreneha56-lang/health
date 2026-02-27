"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { healthAlerts } from "@/lib/mockData";
import { Bell, AlertTriangle, CheckCircle, Clock, MapPin, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const severityConfig = {
  critical: { bg: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800", icon: "🔴", badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  high: { bg: "bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800", icon: "🟠", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  moderate: { bg: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800", icon: "🟡", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  low: { bg: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800", icon: "🟢", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

const statusConfig = {
  active: { badge: "bg-red-100 text-red-700 border border-red-200", label: "Active" },
  monitoring: { badge: "bg-amber-100 text-amber-700 border border-amber-200", label: "Monitoring" },
  resolved: { badge: "bg-emerald-100 text-emerald-700 border border-emerald-200", label: "Resolved" },
};

export default function AdminAlertsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const filtered = filterStatus === "all" ? healthAlerts : healthAlerts.filter(a => a.status === filterStatus);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="w-6 h-6 text-red-600" />
              Health Alerts
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">Automated early warning notifications for disease outbreaks</p>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Alerts refreshed!")}>
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{healthAlerts.filter(a => a.status === "active").length}</div>
            <div className="text-xs text-red-600">Active</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 text-center">
            <div className="text-2xl font-bold text-amber-600">{healthAlerts.filter(a => a.status === "monitoring").length}</div>
            <div className="text-xs text-amber-600">Monitoring</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 text-center">
            <div className="text-2xl font-bold text-emerald-600">{healthAlerts.filter(a => a.status === "resolved").length}</div>
            <div className="text-xs text-emerald-600">Resolved</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-4">
          {["all", "active", "monitoring", "resolved"].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize",
                filterStatus === s ? "bg-blue-600 text-white border-blue-600" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
              )}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map((alert) => {
            const sevCfg = severityConfig[alert.severity as keyof typeof severityConfig] || severityConfig.low;
            const stsCfg = statusConfig[alert.status as keyof typeof statusConfig] || statusConfig.resolved;
            const isOpen = expanded === alert.id;

            return (
              <div key={alert.id} className={cn("border rounded-2xl overflow-hidden", sevCfg.bg)}>
                <button
                  className="w-full text-left p-4"
                  onClick={() => setExpanded(isOpen ? null : alert.id)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg flex-shrink-0 mt-0.5">{sevCfg.icon}</span>
                      <div>
                        <div className="font-semibold text-foreground">{alert.title}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location} &bull; {alert.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge className={cn("text-xs border", stsCfg.badge)}>{stsCfg.label}</Badge>
                      <Badge className={cn("text-xs capitalize", sevCfg.badge)}>{alert.severity}</Badge>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 border-t border-border/50 pt-3">
                    <p className="text-sm text-foreground leading-relaxed">{alert.description}</p>
                    <div className="flex gap-2 mt-3">
                      {alert.status === "active" && (
                        <>
                          <Button size="sm" className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white" onClick={() => toast.success("Alert escalated to IDSP!")}>
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Escalate
                          </Button>
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => toast.success("Alert marked as resolved!")}>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Resolve
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => toast.success("Report generated!")}>
                        Generate Report
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
