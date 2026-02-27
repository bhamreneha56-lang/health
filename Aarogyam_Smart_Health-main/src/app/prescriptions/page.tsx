"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { prescriptions } from "@/lib/mockData";
import { FileText, Download, Printer, Clock, User, Hospital, Pill, ChevronDown, ChevronUp, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PrescriptionsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(prescriptions[0]?.id);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Digital Prescriptions</h1>
          <p className="text-muted-foreground text-sm mt-0.5">All your prescriptions in one place, always accessible</p>
        </div>

        <div className="space-y-4">
          {prescriptions.map((rx) => {
            const isOpen = expanded === rx.id;
            return (
              <div key={rx.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Header */}
                <button
                  className="w-full text-left p-5"
                  onClick={() => setExpanded(isOpen ? null : rx.id)}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{rx.id}</div>
                        <div className="text-sm text-muted-foreground">{rx.diagnosis}</div>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" />{rx.doctorName}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{rx.date}</span>
                          <span className="flex items-center gap-1"><Hospital className="w-3 h-3" />{rx.hospital}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">{rx.medications.length} meds</Badge>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Prescription */}
                {isOpen && (
                  <div className="border-t border-border">
                    {/* Prescription paper */}
                    <div className="m-4 border-2 border-dashed border-border rounded-2xl p-5 bg-muted/20">
                      {/* Hospital Header */}
                      <div className="text-center border-b border-border pb-4 mb-4">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Activity className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-lg text-foreground">{rx.hospital}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{rx.hospitalAddress}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Reg. No: {rx.registrationNo}</div>
                      </div>

                      {/* Patient & Doctor Info */}
                      <div className="grid sm:grid-cols-2 gap-4 mb-5">
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Patient</div>
                          <div className="font-semibold text-foreground">{rx.patientName}</div>
                          <div className="text-sm text-muted-foreground">ID: {rx.patientId}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Prescribed by</div>
                          <div className="font-semibold text-foreground">{rx.doctorName}</div>
                          <div className="text-sm text-muted-foreground">Date: {rx.date}</div>
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-0.5">Diagnosis</div>
                        <div className="text-sm text-foreground font-medium">{rx.diagnosis}</div>
                      </div>

                      {/* Medications */}
                      <div className="mb-4">
                        <div className="text-xs text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5" />
                          Medications (Rx)
                        </div>
                        <div className="space-y-2.5">
                          {rx.medications.map((med, idx) => (
                            <div key={idx} className="flex gap-3 p-3 bg-background rounded-xl border border-border">
                              <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="font-semibold text-foreground text-sm">{med.name}</span>
                                  <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium text-muted-foreground">{med.dosage}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-1 mt-1.5 text-xs text-muted-foreground">
                                  <span>{med.frequency}</span>
                                  <span>{med.duration}</span>
                                  <span>{med.route}</span>
                                </div>
                                <div className="mt-1 text-xs text-amber-600 italic">⚠ {med.instructions}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Advice & Follow-up */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wide mb-1">Advice</div>
                          <div className="text-sm text-foreground">{rx.advice}</div>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                          <div className="text-xs text-amber-600 font-semibold uppercase tracking-wide mb-1">Follow-up</div>
                          <div className="text-sm font-semibold text-foreground">{rx.followUp}</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 pt-3 border-t border-border text-center text-xs text-muted-foreground">
                        Generated by AAROGYAM Health Intelligence System &bull; Valid prescription
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 px-4 pb-4">
                      <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => toast.success("Downloading prescription PDF...")}>
                        <Download className="w-3.5 h-3.5" />
                        Download PDF
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("Print dialog opened...")}>
                        <Printer className="w-3.5 h-3.5" />
                        Print
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
