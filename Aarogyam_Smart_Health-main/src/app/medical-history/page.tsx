"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { medicalHistory } from "@/lib/mockData";
import { FileText, AlertTriangle, Stethoscope, FlaskConical, Scissors, Activity, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, React.ElementType> = {
  "Consultation": Stethoscope,
  "Lab Report": FlaskConical,
  "Emergency": AlertTriangle,
  "Routine Checkup": Activity,
  "Surgery": Scissors,
};

const severityConfig: Record<string, { dot: string; badge: string; label: string }> = {
  high: { dot: "bg-red-500", badge: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400", label: "Critical" },
  moderate: { dot: "bg-amber-500", badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400", label: "Moderate" },
  mild: { dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400", label: "Mild" },
  low: { dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400", label: "Routine" },
};

export default function MedicalHistoryPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const types = ["all", ...Array.from(new Set(medicalHistory.map(r => r.type)))];
  const filtered = filter === "all" ? medicalHistory : medicalHistory.filter(r => r.type === filter);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Medical History</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Complete chronological record of all medical events</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-1.5">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                    filter === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                  )}
                >
                  {t === "all" ? "All" : t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Records", value: medicalHistory.length, color: "text-blue-600" },
            { label: "Emergencies", value: medicalHistory.filter(r => r.type === "Emergency").length, color: "text-red-600" },
            { label: "Surgeries", value: medicalHistory.filter(r => r.type === "Surgery").length, color: "text-violet-600" },
            { label: "Consultations", value: medicalHistory.filter(r => r.type === "Consultation").length, color: "text-emerald-600" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-4">
            {filtered.map((record) => {
              const Icon = typeIcons[record.type] || FileText;
              const sev = severityConfig[record.severity] || severityConfig.low;
              const isOpen = expanded === record.id;

              return (
                <div key={record.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className={`absolute left-3.5 top-4 w-3 h-3 rounded-full border-2 border-background ${sev.dot}`} />

                  <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <button
                      className="w-full text-left p-4"
                      onClick={() => setExpanded(isOpen ? null : record.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                            <Icon className="w-4.5 h-4.5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{record.diagnosis}</div>
                            <div className="text-sm text-muted-foreground mt-0.5">{record.doctor} &bull; {record.hospital}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{record.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={`text-xs border ${sev.badge}`}>{record.type}</Badge>
                          {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
                        {record.symptoms.length > 0 && (
                          <div>
                            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Symptoms</div>
                            <div className="flex flex-wrap gap-1.5">
                              {record.symptoms.map(s => (
                                <span key={s} className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-lg">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Doctor's Notes</div>
                          <p className="text-sm text-foreground bg-muted/50 rounded-xl p-3">{record.notes}</p>
                        </div>
                        {record.prescription && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <FileText className="w-4 h-4" />
                            <span>Prescription: {record.prescription}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
