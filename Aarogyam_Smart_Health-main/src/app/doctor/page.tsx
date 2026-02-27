"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { patients, appointments, medicalHistory, doctors } from "@/lib/mockData";
import {
  Users, Calendar, FileText, Activity, Clock, CheckCircle,
  Search, AlertTriangle, Stethoscope, TrendingUp, ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { day: "Mon", patients: 12, consultations: 10 },
  { day: "Tue", patients: 15, consultations: 13 },
  { day: "Wed", patients: 8, consultations: 7 },
  { day: "Thu", patients: 18, consultations: 16 },
  { day: "Fri", patients: 14, consultations: 12 },
  { day: "Sat", patients: 9, consultations: 8 },
];

export default function DoctorDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
    else if (user?.role !== "doctor") {
      if (user?.role === "patient") router.replace("/dashboard");
      else router.replace("/admin");
    }
  }, [isAuthenticated, user, router]);

  const doctor = doctors[0];
  const todayAppts = appointments.slice(0, 3);
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated || user?.role !== "doctor") return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome, {doctor.name} 👨‍⚕️
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {doctor.specialization} &bull; {doctor.hospital} &bull; Reg: {doctor.registrationNo}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Patients", value: patients.length, icon: Users, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20", change: "+3 today" },
            { label: "Today's Appointments", value: todayAppts.length, icon: Calendar, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20", change: "2 confirmed" },
            { label: "Prescriptions Written", value: 28, icon: FileText, color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20", change: "this month" },
            { label: "Pending Reviews", value: 5, icon: AlertTriangle, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20", change: "lab reports" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-4">
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                <div className="text-xs text-emerald-600 mt-1">{stat.change}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Patient Search */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Patient Search</h2>
              <Link href="/doctor/patients">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search patients"
              />
            </div>
            <div className="space-y-2">
              {filteredPatients.slice(0, 5).map((patient) => (
                <div key={patient.id} className="flex items-center gap-3 p-3 bg-muted/40 hover:bg-muted/80 rounded-xl transition-colors cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {patient.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">{patient.id} &bull; {patient.age}y {patient.gender} &bull; {patient.bloodType}</div>
                    {patient.chronicConditions.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {patient.chronicConditions.slice(0, 2).map((c: string) => (
                          <span key={c} className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs px-1.5 py-0.5 rounded">{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${patient.healthScore >= 80 ? "bg-emerald-500" : patient.healthScore >= 60 ? "bg-amber-500" : "bg-red-500"}`} />
                    {patient.healthScore}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {todayAppts.map((apt) => (
                <div key={apt.id} className="p-3 bg-muted/40 rounded-xl">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm">{apt.patientName}</span>
                    <Badge className={apt.status === "confirmed" ? "bg-emerald-100 text-emerald-700 text-xs" : "bg-amber-100 text-amber-700 text-xs"}>
                      {apt.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {apt.time} &bull; {apt.type}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{apt.notes}</div>
                </div>
              ))}
            </div>
            <Link href="/doctor/appointments">
              <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                View Full Schedule
              </Button>
            </Link>
          </div>
        </div>

        {/* Weekly Chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-semibold text-foreground mb-4">Weekly Patient Statistics</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "12px" }} />
              <Bar dataKey="patients" fill="#2563eb" name="Patients Seen" radius={[4, 4, 0, 0]} />
              <Bar dataKey="consultations" fill="#10b981" name="Consultations" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { href: "/doctor/prescriptions", label: "Write Prescription", icon: FileText, color: "bg-blue-600 hover:bg-blue-700" },
            { href: "/doctor/scanner", label: "Scan QR Card", icon: Activity, color: "bg-emerald-600 hover:bg-emerald-700" },
            { href: "/doctor/patients", label: "Patient Records", icon: Users, color: "bg-violet-600 hover:bg-violet-700" },
            { href: "/doctor/appointments", label: "Manage Schedule", icon: Calendar, color: "bg-amber-600 hover:bg-amber-700" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Button className={`w-full gap-2 text-white ${action.color}`} size="sm">
                  <Icon className="w-4 h-4" />
                  {action.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
