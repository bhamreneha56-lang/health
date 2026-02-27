"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { appointments } from "@/lib/mockData";
import { Calendar, Clock, MapPin, Video, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function DoctorAppointmentsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Appointment Schedule</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Manage your patient appointments</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-blue-600">{appointments.length}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-emerald-600">{appointments.filter(a => a.status === "confirmed").length}</div>
            <div className="text-xs text-muted-foreground">Confirmed</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl font-bold text-amber-600">{appointments.filter(a => a.status === "pending").length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>

        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-foreground">{apt.patientName}</div>
                  <div className="text-sm text-muted-foreground">{apt.type}</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{apt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{apt.time}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{apt.hospital}</span>
                  </div>
                  <div className="mt-1.5 text-xs text-muted-foreground">{apt.notes}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={cn(
                    "text-xs",
                    apt.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                    apt.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {apt.status}
                  </Badge>
                  <div className="flex gap-1.5">
                    {apt.status !== "completed" && (
                      <>
                        <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => toast.success("Joining call...")}>
                          <Video className="w-3 h-3" />
                          Video
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs h-7 gap-1 text-emerald-600" onClick={() => toast.success("Appointment confirmed!")}>
                          <CheckCircle className="w-3 h-3" />
                          Confirm
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
