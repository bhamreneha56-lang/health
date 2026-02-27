"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { vaccinations } from "@/lib/mockData";
import { Syringe, CheckCircle, Clock, AlertTriangle, Calendar, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const statusConfig = {
  completed: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200", label: "Completed" },
  due: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20 border-red-200", label: "Due Now" },
  upcoming: { icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20 border-amber-200", label: "Upcoming" },
};

export default function VaccinationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const completedCount = vaccinations.filter(v => v.status === "completed").length;
  const dueCount = vaccinations.filter(v => v.status === "due").length;
  const upcomingCount = vaccinations.filter(v => v.status === "upcoming").length;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Vaccination Tracker</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Monitor your immunization history and upcoming doses</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 text-center">
            <CheckCircle className="w-7 h-7 text-emerald-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{completedCount}</div>
            <div className="text-xs text-emerald-600">Completed</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4 text-center">
            <AlertTriangle className="w-7 h-7 text-red-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">{dueCount}</div>
            <div className="text-xs text-red-600">Due Now</div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-center">
            <Clock className="w-7 h-7 text-amber-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">{upcomingCount}</div>
            <div className="text-xs text-amber-600">Upcoming</div>
          </div>
        </div>

        {/* Vaccination Protection */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-4 mb-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">Immunization Coverage</span>
          </div>
          <div className="relative bg-white/20 rounded-full h-3 mb-1">
            <div className="absolute left-0 top-0 h-3 rounded-full bg-white" style={{ width: `${(completedCount / vaccinations.length) * 100}%` }} />
          </div>
          <div className="text-sm text-white/80">{completedCount} of {vaccinations.length} vaccinations completed ({Math.round((completedCount / vaccinations.length) * 100)}%)</div>
        </div>

        {/* Vaccination Cards */}
        <div className="space-y-3">
          {vaccinations.map((vac) => {
            const cfg = statusConfig[vac.status as keyof typeof statusConfig];
            const Icon = cfg.icon;

            return (
              <div key={vac.id} className={cn("bg-card border rounded-2xl p-4", vac.status === "due" ? "border-red-200 dark:border-red-800" : "border-border")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0", cfg.bg)}>
                      <Syringe className={`w-5 h-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{vac.name}</div>
                      <div className="text-sm text-muted-foreground">{vac.dose}</div>
                      {vac.date && (
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Administered: {vac.date}
                          {vac.administeredBy && ` by ${vac.administeredBy}`}
                        </div>
                      )}
                      {vac.nextDue && (
                        <div className={cn("text-xs mt-1 flex items-center gap-1 font-medium", vac.status === "due" ? "text-red-600" : "text-amber-600")}>
                          <Clock className="w-3 h-3" />
                          {vac.status === "due" ? "Overdue since" : "Next due"}: {vac.nextDue}
                        </div>
                      )}
                      {vac.batchNo && (
                        <div className="text-xs text-muted-foreground mt-0.5">Batch: {vac.batchNo}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={cn("text-xs border", cfg.bg, cfg.color)}>
                      <Icon className="w-3 h-3 mr-1" />
                      {cfg.label}
                    </Badge>
                    {(vac.status === "due" || vac.status === "upcoming") && (
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => toast.success("Appointment booking opened!")}>
                        Book Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
