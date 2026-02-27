"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { labReports } from "@/lib/mockData";
import { FlaskConical, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  normal: { color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20", icon: CheckCircle, label: "Normal" },
  high: { color: "text-red-600 bg-red-50 dark:bg-red-900/20", icon: TrendingUp, label: "High" },
  low: { color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20", icon: AlertTriangle, label: "Low" },
};

export default function LabReportsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(labReports[0]?.id);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Lab Reports</h1>
          <p className="text-muted-foreground text-sm mt-0.5">All your diagnostic test results in one place</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{labReports.length}</div>
            <div className="text-xs text-muted-foreground">Total Reports</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-red-600">
              {labReports.reduce((acc, r) => acc + r.results.filter(res => res.status === "high" || res.status === "low").length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Abnormal Values</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-emerald-600">
              {labReports.filter(r => r.status === "completed").length}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
        </div>

        <div className="space-y-4">
          {labReports.map((report) => {
            const isOpen = expanded === report.id;
            const abnormals = report.results.filter(r => r.status !== "normal").length;

            return (
              <div key={report.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <button
                  className="w-full text-left p-5"
                  onClick={() => setExpanded(isOpen ? null : report.id)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <FlaskConical className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{report.name}</div>
                        <div className="text-sm text-muted-foreground">{report.lab} &bull; {report.date}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Ordered by: {report.orderedBy}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {abnormals > 0 && (
                        <Badge className="bg-red-100 text-red-700 text-xs">{abnormals} abnormal</Badge>
                      )}
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">{report.status}</Badge>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border p-5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-2">Test</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-2">Result</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-2">Unit</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-2">Reference</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {report.results.map((result, idx) => {
                            const cfg = statusConfig[result.status] || statusConfig.normal;
                            const Icon = cfg.icon;
                            return (
                              <tr key={idx} className={cn("py-2", result.status !== "normal" ? "bg-red-50/30 dark:bg-red-900/5" : "")}>
                                <td className="py-3 font-medium text-foreground">{result.test}</td>
                                <td className="py-3 font-bold text-foreground">{result.value}</td>
                                <td className="py-3 text-muted-foreground">{result.unit}</td>
                                <td className="py-3 text-muted-foreground">{result.reference}</td>
                                <td className="py-3">
                                  <span className={cn("flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full w-fit", cfg.color)}>
                                    <Icon className="w-3 h-3" />
                                    {cfg.label}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
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
