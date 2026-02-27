"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { patients } from "@/lib/mockData";
import { QRCodeSVG } from "qrcode.react";
import { Download, Share2, Phone, Droplets, AlertTriangle, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function HealthCardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const patient = patients[0];

  const qrData = JSON.stringify({
    id: patient.id,
    name: patient.name,
    bloodType: patient.bloodType,
    allergies: patient.allergies,
    emergency: patient.emergencyContact,
    conditions: patient.chronicConditions,
    system: "AAROGYAM",
  });

  const handleDownload = () => {
    toast.success("Health Card downloaded! (demo)");
  };

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">AAROGYAM Health Card</h1>
          <p className="text-muted-foreground text-sm mt-1">Your digital health identity card with QR code for instant identification</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Front Card */}
          <div ref={cardRef}>
            <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Front</p>
            <div className="health-card-bg rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
              {/* Background decorations */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6 relative">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm tracking-widest">AAROGYAM</div>
                    <div className="text-white/60 text-xs">Health Intelligence</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/60">SMART HEALTH CARD</div>
                  <div className="text-xs font-mono text-white/80">{patient.id}</div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="mb-6 relative">
                <div className="text-xl font-bold tracking-wide mb-0.5">{patient.name}</div>
                <div className="text-white/70 text-sm">{patient.address.split(",").slice(-2).join(",").trim()}</div>
                <div className="flex flex-wrap gap-3 mt-3">
                  <div>
                    <div className="text-white/50 text-xs">Date of Birth</div>
                    <div className="text-sm font-semibold">{patient.dob}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs">Gender</div>
                    <div className="text-sm font-semibold">{patient.gender}</div>
                  </div>
                  <div>
                    <div className="text-white/50 text-xs">Age</div>
                    <div className="text-sm font-semibold">{patient.age} yrs</div>
                  </div>
                </div>
              </div>

              {/* Blood Type & QR */}
              <div className="flex items-end justify-between relative">
                <div>
                  <div className="text-white/50 text-xs mb-1">Blood Type</div>
                  <div className="text-4xl font-extrabold text-red-300">{patient.bloodType}</div>
                  <div className="mt-2">
                    <div className="text-white/50 text-xs mb-0.5">Insurance</div>
                    <div className="text-xs text-white/80">{patient.insurance}</div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-1.5">
                  <QRCodeSVG
                    value={qrData}
                    size={80}
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                    level="M"
                  />
                </div>
              </div>

              {/* Watermark */}
              <div className="absolute bottom-3 right-4 text-white/10 text-5xl font-black select-none pointer-events-none">
                AAROGYAM
              </div>
            </div>
          </div>

          {/* Back Card */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Back</p>
            <div className="bg-slate-800 rounded-3xl p-6 text-white shadow-2xl space-y-4">
              {/* Allergies */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-amber-400">Known Allergies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.length > 0 ? patient.allergies.map(a => (
                    <span key={a} className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2 py-1 rounded-lg font-medium">{a}</span>
                  )) : (
                    <span className="text-white/50 text-sm">No known allergies</span>
                  )}
                </div>
              </div>

              {/* Chronic Conditions */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-semibold text-blue-400">Chronic Conditions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {patient.chronicConditions.length > 0 ? patient.chronicConditions.map(c => (
                    <span key={c} className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs px-2 py-1 rounded-lg">{c}</span>
                  )) : (
                    <span className="text-white/50 text-sm">None</span>
                  )}
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-semibold text-red-400">Emergency Contact</span>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="font-semibold">{patient.emergencyContact.name}</div>
                  <div className="text-white/60 text-sm">{patient.emergencyContact.relation}</div>
                  <div className="text-white/80 text-sm font-mono mt-0.5">{patient.emergencyContact.phone}</div>
                </div>
              </div>

              {/* Security Footer */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-white/50">Secured by AAROGYAM</span>
                </div>
                <span className="text-xs text-white/30 font-mono">{patient.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button onClick={handleDownload} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="w-4 h-4" />
            Download Card
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Share link copied!")}>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* QR Code Info */}
        <div className="mt-6 p-4 bg-card border border-border rounded-2xl">
          <h3 className="font-semibold text-foreground mb-2">About Your QR Code</h3>
          <p className="text-sm text-muted-foreground">
            The QR code on your health card contains your critical emergency information including blood type,
            allergies, emergency contacts, and chronic conditions. Healthcare providers can scan this
            to instantly access your vital health information in emergencies.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="bg-emerald-100 text-emerald-700 text-xs">Scan at any AAROGYAM hospital</Badge>
            <Badge className="bg-blue-100 text-blue-700 text-xs">Emergency access 24/7</Badge>
            <Badge className="bg-violet-100 text-violet-700 text-xs">Encrypted & secure</Badge>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
