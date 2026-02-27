"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { hospitalResources } from "@/lib/mockData";
import { Hospital, Bed, Users, Wind, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function HospitalsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Hospital Resource Tracker</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Real-time hospital capacity and resource availability</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Beds", value: hospitalResources.reduce((a, h) => a + h.totalBeds, 0).toLocaleString(), color: "text-blue-600" },
            { label: "Occupied", value: hospitalResources.reduce((a, h) => a + h.occupied, 0).toLocaleString(), color: "text-amber-600" },
            { label: "ICU Available", value: hospitalResources.reduce((a, h) => a + (h.icu - h.icuOccupied), 0).toLocaleString(), color: "text-emerald-600" },
            { label: "Ventilators Free", value: hospitalResources.reduce((a, h) => a + (h.ventilators - h.ventilatorsOccupied), 0).toLocaleString(), color: "text-violet-600" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {hospitalResources.map((h) => {
            const bedPct = Math.round((h.occupied / h.totalBeds) * 100);
            const icuPct = Math.round((h.icuOccupied / h.icu) * 100);
            const ventPct = Math.round((h.ventilatorsOccupied / h.ventilators) * 100);

            const alertLevel = bedPct > 90 || icuPct > 90
              ? "critical" : bedPct > 80 || icuPct > 80
              ? "high" : "normal";

            return (
              <div key={h.hospital} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Hospital className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-foreground">{h.hospital}</h3>
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">{h.city}</div>
                    <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{h.doctors} doctors</span>
                      <span>{h.nurses} nurses</span>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    alertLevel === "critical" ? "bg-red-100 text-red-700" :
                    alertLevel === "high" ? "bg-amber-100 text-amber-700" :
                    "bg-emerald-100 text-emerald-700"
                  )}>
                    {alertLevel === "critical" ? "Critical Capacity" : alertLevel === "high" ? "High Demand" : "Normal Operations"}
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { label: "Total Beds", occupied: h.occupied, total: h.totalBeds, pct: bedPct, icon: Bed, color: bedPct > 90 ? "bg-red-500" : bedPct > 75 ? "bg-amber-500" : "bg-emerald-500" },
                    { label: "ICU Beds", occupied: h.icuOccupied, total: h.icu, pct: icuPct, icon: AlertTriangle, color: icuPct > 90 ? "bg-red-500" : icuPct > 75 ? "bg-amber-500" : "bg-blue-500" },
                    { label: "Ventilators", occupied: h.ventilatorsOccupied, total: h.ventilators, pct: ventPct, icon: Wind, color: ventPct > 90 ? "bg-red-500" : ventPct > 75 ? "bg-amber-500" : "bg-violet-500" },
                  ].map((resource) => {
                    const Icon = resource.icon;
                    return (
                      <div key={resource.label} className="bg-muted/40 rounded-xl p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            {resource.label}
                          </div>
                          <span className="text-sm font-bold text-foreground">{resource.pct}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden mb-1.5">
                          <div className={`h-full rounded-full ${resource.color}`} style={{ width: `${resource.pct}%` }} />
                        </div>
                        <div className="text-xs text-muted-foreground">{resource.occupied} / {resource.total} occupied</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
