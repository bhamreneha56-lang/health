"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { appointments, doctors } from "@/lib/mockData";
import { Calendar, Clock, MapPin, User, Plus, Video, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusConfig = {
  confirmed: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200", label: "Confirmed" },
  pending: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20 border-amber-200", label: "Pending" },
  completed: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20 border-blue-200", label: "Completed" },
  cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/20 border-red-200", label: "Cancelled" },
};

export default function AppointmentsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<"upcoming" | "completed" | "book">("upcoming");
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const upcoming = appointments.filter(a => a.status !== "completed");
  const completed = appointments.filter(a => a.status === "completed");

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

  const handleBook = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Please select all booking details");
      return;
    }
    toast.success("Appointment booked successfully! Confirmation sent to your email.");
    setTab("upcoming");
    setBookingStep(1);
  };

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Manage and book doctor appointments</p>
          </div>
          <Button onClick={() => setTab("book")} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            <Plus className="w-4 h-4" />
            Book Appointment
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
          {[
            { key: "upcoming", label: `Upcoming (${upcoming.length})` },
            { key: "completed", label: `Completed (${completed.length})` },
            { key: "book", label: "Book New" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as typeof tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                tab === t.key ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Upcoming / Completed */}
        {(tab === "upcoming" || tab === "completed") && (
          <div className="space-y-3">
            {(tab === "upcoming" ? upcoming : completed).map((apt) => {
              const cfg = statusConfig[apt.status as keyof typeof statusConfig];
              const Icon = cfg.icon;
              return (
                <div key={apt.id} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-foreground">{apt.doctorName}</div>
                      <div className="text-sm text-muted-foreground">{apt.specialization}</div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {apt.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {apt.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {apt.hospital}
                        </span>
                      </div>
                      <div className="mt-2 text-xs bg-muted/50 rounded-lg px-2 py-1.5 text-muted-foreground">
                        {apt.notes}
                      </div>
                      <div className="mt-2 text-xs font-semibold text-emerald-600">Fee: ₹{apt.fee.toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={cn("text-xs border", cfg.bg, cfg.color)}>
                        <Icon className="w-3 h-3 mr-1" />
                        {cfg.label}
                      </Badge>
                      {apt.status !== "completed" && (
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => toast.success("Joining telemedicine call...")}>
                            <Video className="w-3 h-3" />
                            Join Call
                          </Button>
                          <Button size="sm" variant="outline" className="text-xs h-7 text-red-600 hover:text-red-600 hover:bg-red-50" onClick={() => toast.error("Appointment cancelled")}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Book Appointment */}
        {tab === "book" && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-6">Book a New Appointment</h2>

            {/* Step 1: Select Doctor */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center", bookingStep >= 1 ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground")}>1</div>
                <span className="font-medium text-foreground">Select Doctor</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => { setSelectedDoctor(doc.id); setBookingStep(2); }}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      selectedDoctor === doc.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-border hover:border-blue-300 hover:bg-muted/50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{doc.name}</div>
                        <div className="text-xs text-muted-foreground">{doc.specialization}</div>
                        <div className="text-xs text-muted-foreground">{doc.hospital}, {doc.city}</div>
                        <div className="text-xs font-semibold text-emerald-600 mt-0.5">₹{doc.consultationFee} consultation</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Date */}
            {bookingStep >= 2 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className={cn("w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center", bookingStep >= 2 ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground")}>2</div>
                  <span className="font-medium text-foreground">Select Date</span>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => { setSelectedDate(e.target.value); setBookingStep(3); }}
                  min={new Date().toISOString().split("T")[0]}
                  className="block w-full sm:w-72 px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Select appointment date"
                />
              </div>
            )}

            {/* Step 3: Select Time */}
            {bookingStep >= 3 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">3</div>
                  <span className="font-medium text-foreground">Select Time Slot</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "px-2 py-2 rounded-xl border text-xs font-medium transition-all",
                        selectedTime === time
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-background text-foreground border-border hover:border-blue-300"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Book Button */}
            {selectedDoctor && selectedDate && selectedTime && (
              <div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800 mb-4 text-sm">
                  <div className="font-semibold text-foreground mb-1">Booking Summary</div>
                  <div className="text-muted-foreground">
                    {doctors.find(d => d.id === selectedDoctor)?.name} &bull; {selectedDate} at {selectedTime}
                  </div>
                </div>
                <Button onClick={handleBook} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                  <Calendar className="w-4 h-4" />
                  Confirm Appointment
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
