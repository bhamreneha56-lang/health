"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { patients, medicalHistory } from "@/lib/mockData";
import { Search, Filter, Eye, Activity, Droplets, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DoctorPatientsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === selected);
  const patientHistory = medicalHistory.filter(h => h.patientId === selected);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Patient Records</h1>
          <p className="text-muted-foreground text-sm mt-0.5">View and manage patient health records</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-2">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search patients"
              />
            </div>
            <div className="space-y-2">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all",
                    selected === p.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-border bg-card hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {p.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.id} &bull; {p.age}y &bull; {p.bloodType}</div>
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full ${p.healthScore >= 80 ? "bg-emerald-500" : p.healthScore >= 60 ? "bg-amber-500" : "bg-red-500"}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Patient Detail */}
          <div className="lg:col-span-3">
            {selectedPatient ? (
              <div className="space-y-4">
                {/* Patient Card */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {selectedPatient.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-bold text-foreground">{selectedPatient.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedPatient.id} &bull; {selectedPatient.age}y &bull; {selectedPatient.gender}</div>
                      <div className="text-sm text-muted-foreground">{selectedPatient.phone}</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${selectedPatient.healthScore >= 80 ? "text-emerald-600" : selectedPatient.healthScore >= 60 ? "text-amber-600" : "text-red-600"}`}>
                        {selectedPatient.healthScore}
                      </div>
                      <div className="text-xs text-muted-foreground">Health Score</div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-3">
                      <div className="text-xs text-red-600 font-semibold mb-1">Blood Type</div>
                      <div className="text-xl font-bold text-red-700 dark:text-red-400">{selectedPatient.bloodType}</div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-3">
                      <div className="text-xs text-amber-600 font-semibold mb-1">Allergies</div>
                      <div className="text-sm text-foreground">{selectedPatient.allergies.join(", ") || "None"}</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3">
                      <div className="text-xs text-blue-600 font-semibold mb-1">Conditions</div>
                      <div className="text-sm text-foreground">{selectedPatient.chronicConditions.join(", ") || "None"}</div>
                    </div>
                  </div>
                </div>

                {/* Medical History */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <h3 className="font-semibold text-foreground mb-3">Medical History</h3>
                  {patientHistory.length > 0 ? (
                    <div className="space-y-2">
                      {patientHistory.map((h) => (
                        <div key={h.id} className="p-3 bg-muted/40 rounded-xl">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium text-foreground text-sm">{h.diagnosis}</div>
                            <span className="text-xs text-muted-foreground">{h.date}</span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{h.type} &bull; {h.doctor}</div>
                          <div className="text-xs text-muted-foreground mt-1">{h.notes}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No medical history available for this patient.</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Activity className="w-4 h-4" />
                    Write Prescription
                  </Button>
                  <Button size="sm" variant="outline" className="gap-2">
                    <Eye className="w-4 h-4" />
                    Full Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-3">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="font-semibold text-foreground">Select a Patient</div>
                <div className="text-sm text-muted-foreground mt-1">Click on a patient from the list to view their details</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
