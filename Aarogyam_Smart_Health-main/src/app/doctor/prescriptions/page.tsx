"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { patients, drugDatabase } from "@/lib/mockData";
import { FileText, Plus, Trash2, AlertTriangle, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export default function DoctorPrescriptionsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedPatient, setSelectedPatient] = useState(patients[0].id);
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
    { name: "", dosage: "", frequency: "Once daily", duration: "7 days", instructions: "" }
  ]);
  const [drugSearch, setDrugSearch] = useState<string[]>([""]);
  const [interactions, setInteractions] = useState<string[]>([]);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const addMedication = () => {
    setMedications(prev => [...prev, { name: "", dosage: "", frequency: "Once daily", duration: "7 days", instructions: "" }]);
    setDrugSearch(prev => [...prev, ""]);
  };

  const removeMedication = (idx: number) => {
    setMedications(prev => prev.filter((_, i) => i !== idx));
    setDrugSearch(prev => prev.filter((_, i) => i !== idx));
  };

  const updateMedication = (idx: number, field: keyof Medication, value: string) => {
    setMedications(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };

      // Check drug interactions
      const drugNames = updated.map(m => m.name).filter(Boolean);
      const warns: string[] = [];
      drugNames.forEach(name => {
        const drug = drugDatabase.find(d => d.name === name);
        if (drug) {
          drug.interactions.forEach(int => {
            if (drugNames.some(n => n.includes(int) || int.includes(n))) {
              warns.push(`${name} ⚠️ ${int}`);
            }
          });
        }
      });
      setInteractions(warns);
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis) { toast.error("Please add a diagnosis"); return; }
    if (medications.some(m => !m.name)) { toast.error("Please fill all medication names"); return; }
    toast.success("Prescription saved and sent to patient portal!");
  };

  if (!isAuthenticated) return null;

  const patient = patients.find(p => p.id === selectedPatient) || patients[0];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Write Prescription</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Digital prescription with drug interaction checking</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Patient Selection */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-3">Patient</h2>
            <div className="flex flex-wrap gap-2">
              {patients.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPatient(p.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm transition-all ${
                    selectedPatient === p.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "border-border bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  {p.name}
                </button>
              ))}
            </div>
            {/* Patient info */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>Age: {patient.age}y</span>
              <span>Blood: {patient.bloodType}</span>
              {patient.allergies.length > 0 && (
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Allergic to: {patient.allergies.join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* Diagnosis */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <Label className="font-semibold text-foreground">Diagnosis *</Label>
            <Input
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              placeholder="e.g., Hypertension Grade 1, Type 2 Diabetes"
              className="mt-2"
              required
              aria-label="Diagnosis"
            />
          </div>

          {/* Medications */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground">Medications (Rx)</h2>
              <Button type="button" onClick={addMedication} variant="outline" size="sm" className="gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Add Medication
              </Button>
            </div>

            {/* Drug interaction warning */}
            {interactions.length > 0 && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-amber-700 dark:text-amber-400">Drug Interaction Warning</div>
                    {interactions.map((w, i) => (
                      <div key={i} className="text-xs text-amber-600 mt-0.5">{w}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {medications.map((med, idx) => {
                const filtered = drugDatabase.filter(d =>
                  d.name.toLowerCase().includes(drugSearch[idx]?.toLowerCase() || "") && drugSearch[idx]
                );
                return (
                  <div key={idx} className="p-4 bg-muted/30 rounded-xl border border-border relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-semibold text-muted-foreground">Medicine #{idx + 1}</div>
                      {medications.length > 1 && (
                        <button type="button" onClick={() => removeMedication(idx)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Label className="text-xs">Drug Name *</Label>
                        <div className="relative">
                          <Input
                            value={med.name || drugSearch[idx]}
                            onChange={e => {
                              const newSearch = [...drugSearch];
                              newSearch[idx] = e.target.value;
                              setDrugSearch(newSearch);
                              updateMedication(idx, "name", e.target.value);
                            }}
                            placeholder="Search drug..."
                            className="mt-1 pr-9"
                            aria-label={`Drug name ${idx + 1}`}
                          />
                          <Search className="absolute right-3 top-3.5 w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        {filtered.length > 0 && (
                          <div className="absolute z-10 left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                            {filtered.slice(0, 5).map(d => (
                              <button
                                key={d.name}
                                type="button"
                                className="w-full text-left px-3 py-2 hover:bg-muted text-sm"
                                onClick={() => {
                                  updateMedication(idx, "name", d.name);
                                  const newSearch = [...drugSearch];
                                  newSearch[idx] = "";
                                  setDrugSearch(newSearch);
                                }}
                              >
                                <div className="font-medium">{d.name}</div>
                                <div className="text-xs text-muted-foreground">{d.category} &bull; {d.dosages.join(", ")}</div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs">Dosage</Label>
                        <Input value={med.dosage} onChange={e => updateMedication(idx, "dosage", e.target.value)} placeholder="e.g., 5mg" className="mt-1" aria-label={`Dosage ${idx + 1}`} />
                      </div>
                      <div>
                        <Label className="text-xs">Frequency</Label>
                        <select
                          value={med.frequency}
                          onChange={e => updateMedication(idx, "frequency", e.target.value)}
                          className="w-full mt-1 px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          aria-label={`Frequency ${idx + 1}`}
                        >
                          {["Once daily", "Twice daily", "Three times daily", "Every 8 hours", "Every 6 hours", "As needed"].map(f => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Duration</Label>
                        <Input value={med.duration} onChange={e => updateMedication(idx, "duration", e.target.value)} placeholder="e.g., 7 days" className="mt-1" aria-label={`Duration ${idx + 1}`} />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="text-xs">Special Instructions</Label>
                        <Input value={med.instructions} onChange={e => updateMedication(idx, "instructions", e.target.value)} placeholder="e.g., Take after meals" className="mt-1" aria-label={`Instructions ${idx + 1}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advice & Follow-up */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="font-semibold">Advice / Instructions</Label>
                <textarea
                  value={advice}
                  onChange={e => setAdvice(e.target.value)}
                  placeholder="Dietary advice, lifestyle changes, precautions..."
                  rows={3}
                  className="w-full mt-2 px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Medical advice"
                />
              </div>
              <div>
                <Label className="font-semibold">Follow-up Date</Label>
                <Input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)} className="mt-2" aria-label="Follow-up date" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <FileText className="w-4 h-4" />
              Save & Send Prescription
            </Button>
            <Button type="button" variant="outline" onClick={() => toast.success("Preview opened!")}>
              Preview
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
