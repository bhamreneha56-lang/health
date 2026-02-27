"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { patients } from "@/lib/mockData";
import { QRCodeSVG } from "qrcode.react";
import { QrCode, Camera, User, AlertTriangle, Droplets, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function QRScannerPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [manualId, setManualId] = useState("");
  const [scannedPatient, setScannedPatient] = useState<typeof patients[0] | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanAnim, setScanAnim] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const simulateScan = (patientId?: string) => {
    setScanning(true);
    setScanAnim(true);
    setTimeout(() => {
      const id = patientId || patients[Math.floor(Math.random() * patients.length)].id;
      const found = patients.find(p => p.id === id);
      if (found) {
        setScannedPatient(found);
        toast.success(`Patient identified: ${found.name}`);
      } else {
        toast.error("Patient not found in AAROGYAM system");
      }
      setScanning(false);
      setScanAnim(false);
    }, 2000);
  };

  const searchById = () => {
    if (!manualId.trim()) return;
    const found = patients.find(p => p.id.toLowerCase() === manualId.toLowerCase().trim());
    if (found) {
      setScannedPatient(found);
      toast.success(`Patient found: ${found.name}`);
    } else {
      toast.error("No patient found with this ID");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">QR Scanner</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Scan patient health cards for instant identification</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scanner */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-foreground mb-4">Scan Health Card</h2>

            {/* Camera view simulation */}
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: "4/3" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                {scanning ? (
                  <div className="text-center">
                    <div className="w-48 h-48 border-2 border-emerald-400 rounded-xl relative">
                      {/* Scan line */}
                      <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 animate-bounce top-1/2" />
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br" />
                    </div>
                    <div className="text-white text-sm mt-3 animate-pulse">Scanning...</div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-white/30 mx-auto mb-2" />
                    <div className="text-white/50 text-sm">Camera view (demo mode)</div>
                    <div className="text-white/30 text-xs mt-1">Click "Start Scan" to simulate</div>
                  </div>
                )}
              </div>

              {/* Demo QR codes at bottom */}
              {!scanning && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-4">
                  {patients.slice(0, 3).map(p => (
                    <div
                      key={p.id}
                      className="bg-white rounded p-1 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => simulateScan(p.id)}
                      title={`Scan ${p.name}'s card`}
                    >
                      <QRCodeSVG value={p.id} size={40} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white mb-4"
              onClick={() => simulateScan()}
              disabled={scanning}
            >
              <QrCode className="w-4 h-4" />
              {scanning ? "Scanning..." : "Start Scan"}
            </Button>

            {/* Manual search */}
            <div className="border-t border-border pt-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">Or search by ID manually:</div>
              <div className="flex gap-2">
                <Input
                  value={manualId}
                  onChange={e => setManualId(e.target.value)}
                  placeholder="e.g., AAR-001"
                  onKeyDown={e => e.key === "Enter" && searchById()}
                  aria-label="Patient ID search"
                />
                <Button onClick={searchById} variant="outline">Search</Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Try: AAR-001, AAR-002, AAR-003, AAR-004, AAR-005</div>
            </div>
          </div>

          {/* Patient Info */}
          <div>
            {scannedPatient ? (
              <div className="space-y-4">
                {/* Success banner */}
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm">Patient Identified</div>
                    <div className="text-xs text-emerald-600">AAROGYAM verified identity</div>
                  </div>
                </div>

                {/* Patient card */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold">
                      {scannedPatient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">{scannedPatient.name}</div>
                      <div className="text-sm text-muted-foreground">{scannedPatient.id} &bull; {scannedPatient.age}y &bull; {scannedPatient.gender}</div>
                    </div>
                    <div className="ml-auto text-center">
                      <div className="text-3xl font-extrabold text-red-600">{scannedPatient.bloodType}</div>
                      <div className="text-xs text-muted-foreground">Blood Type</div>
                    </div>
                  </div>

                  {/* Critical info */}
                  {scannedPatient.allergies.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-3">
                      <div className="flex items-center gap-1.5 text-amber-600 font-semibold text-sm mb-1.5">
                        <AlertTriangle className="w-4 h-4" />
                        Drug Allergies
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {scannedPatient.allergies.map(a => (
                          <span key={a} className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 text-xs px-2 py-1 rounded-lg font-medium">{a}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {scannedPatient.chronicConditions.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-3 mb-3">
                      <div className="flex items-center gap-1.5 text-blue-600 font-semibold text-sm mb-1.5">
                        <Droplets className="w-4 h-4" />
                        Chronic Conditions
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {scannedPatient.chronicConditions.map(c => (
                          <span key={c} className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 text-xs px-2 py-1 rounded-lg">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emergency contact */}
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-red-600 font-semibold text-sm mb-1.5">
                      <Phone className="w-4 h-4" />
                      Emergency Contact
                    </div>
                    <div className="text-sm text-foreground font-medium">{scannedPatient.emergencyContact.name}</div>
                    <div className="text-xs text-muted-foreground">{scannedPatient.emergencyContact.relation} &bull; {scannedPatient.emergencyContact.phone}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <User className="w-4 h-4" />
                    View Full Record
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-2">
                    Write Prescription
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-80 text-center bg-card border border-border rounded-2xl">
                <QrCode className="w-16 h-16 text-muted-foreground/30 mb-3" />
                <div className="font-semibold text-foreground">No Patient Scanned</div>
                <div className="text-sm text-muted-foreground mt-1">Scan a health card QR code or enter patient ID</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
