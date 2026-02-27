"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { patients, medicalHistory, appointments, vaccinations, vitalsHistory, healthExpenses } from "@/lib/mockData";
import {
  Heart, Activity, Thermometer, Droplets, TrendingUp, TrendingDown,
  Calendar, FileText, Syringe, AlertTriangle, CheckCircle, Clock,
  ChevronRight, Pill, FlaskConical, CreditCard, Phone
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from "recharts";

export default function PatientDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
    else if (user?.role !== "patient") {
      if (user?.role === "doctor") router.replace("/doctor");
      else router.replace("/admin");
    }
  }, [isAuthenticated, user, router]);

  const patient = patients[0];
  const recentHistory = medicalHistory.slice(0, 3);
  const upcomingAppts = appointments.filter(a => a.status !== "completed").slice(0, 2);
  const dueVaccines = vaccinations.filter(v => v.status === "due" || v.status === "upcoming");
  const latestVitals = vitalsHistory[vitalsHistory.length - 1];

  const severityColor: Record<string, string> = {
    high: "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400",
    moderate: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
    mild: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
    low: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
  };

  if (!isAuthenticated || user?.role !== "patient") return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Good morning, {patient.name.split(" ")[0]} 👋
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">Health ID: {patient.id} &bull; Last visit: {patient.lastVisit}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/health-card">
              <Button variant="outline" size="sm" className="gap-1.5">
                <CreditCard className="w-4 h-4" />
                Health Card
              </Button>
            </Link>
            <Link href="/appointments">
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                <Calendar className="w-4 h-4" />
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>

        {/* Health Score Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-extrabold">{patient.healthScore}</div>
              <div className="text-xs text-white/70">/ 100</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-white/80 font-medium mb-1">Overall Health Score</div>
            <div className="text-2xl font-bold mb-2">
              {patient.healthScore >= 80 ? "Excellent" : patient.healthScore >= 60 ? "Good" : "Needs Attention"}
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.chronicConditions.map(c => (
                <span key={c} className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{c}</span>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/70">
              <span>Blood: {patient.bloodType}</span>
              <span>•</span>
              <span>Allergies: {patient.allergies.join(", ") || "None"}</span>
            </div>
          </div>
        </div>

        {/* Vitals Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Blood Pressure", value: `${latestVitals.systolic}/${latestVitals.diastolic}`, unit: "mmHg", icon: Heart, color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20", trend: -2 },
            { label: "Heart Rate", value: String(latestVitals.heartRate), unit: "bpm", icon: Activity, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20", trend: -1 },
            { label: "Blood Glucose", value: String(latestVitals.glucose), unit: "mg/dL", icon: Droplets, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20", trend: -3 },
            { label: "Weight", value: String(latestVitals.weight), unit: "kg", icon: Thermometer, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20", trend: -0.2 },
          ].map((vital) => {
            const Icon = vital.icon;
            return (
              <div key={vital.label} className="bg-card border border-border rounded-2xl p-4">
                <div className={`w-9 h-9 rounded-xl ${vital.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${vital.color}`} />
                </div>
                <div className="text-xl font-bold text-foreground">{vital.value}</div>
                <div className="text-xs text-muted-foreground">{vital.unit}</div>
                <div className="text-xs text-foreground/60 mt-0.5">{vital.label}</div>
                <div className={`flex items-center gap-0.5 mt-1 text-xs ${vital.trend < 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {vital.trend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  {Math.abs(vital.trend)} from last week
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vitals Chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Blood Pressure Trend</h2>
              <Badge variant="outline" className="text-xs">Last 30 days</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={vitalsHistory}>
                <defs>
                  <linearGradient id="bpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border opacity-50" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[100, 170]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }} />
                <Area type="monotone" dataKey="systolic" stroke="#2563eb" strokeWidth={2} fill="url(#bpGrad)" name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="#10b981" strokeWidth={2} dot={false} name="Diastolic" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Upcoming Appointments</h2>
              <Link href="/appointments" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {upcomingAppts.map((apt) => (
                <div key={apt.id} className="p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{apt.doctorName}</div>
                      <div className="text-xs text-muted-foreground">{apt.specialization}</div>
                      <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {apt.date} at {apt.time}
                      </div>
                    </div>
                    <Badge className={apt.status === "confirmed" ? "bg-emerald-100 text-emerald-700 text-xs" : "bg-amber-100 text-amber-700 text-xs"}>
                      {apt.status}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground bg-background rounded-lg px-2 py-1">{apt.notes}</div>
                </div>
              ))}
              {upcomingAppts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No upcoming appointments</p>
              )}
            </div>
            <Link href="/appointments">
              <Button variant="outline" size="sm" className="w-full mt-3 text-xs">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Book New Appointment
              </Button>
            </Link>
          </div>
        </div>

        {/* Medical History & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Medical History */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Recent Medical History</h2>
              <Link href="/medical-history" className="text-xs text-blue-600 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {recentHistory.map((record) => (
                <div key={record.id} className="flex gap-3 p-3 bg-muted/40 rounded-xl">
                  <div className={`w-1.5 rounded-full self-stretch ${record.severity === "high" ? "bg-red-500" : record.severity === "moderate" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-foreground">{record.diagnosis}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${severityColor[record.severity]}`}>
                        {record.type}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{record.doctor} &bull; {record.hospital}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{record.date}</div>
                    {record.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {record.symptoms.slice(0, 3).map(s => (
                          <span key={s} className="bg-background text-xs px-1.5 py-0.5 rounded-md border border-border text-muted-foreground">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Due Vaccinations */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground text-sm">Vaccination Status</h3>
                <Link href="/vaccinations" className="text-xs text-blue-600 hover:underline">View all</Link>
              </div>
              <div className="space-y-2">
                {dueVaccines.map((v) => (
                  <div key={v.id} className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <Syringe className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{v.name}</div>
                      <div className="text-xs text-amber-600">Due: {v.nextDue}</div>
                    </div>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Card */}
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="w-4 h-4 text-red-600" />
                <h3 className="font-semibold text-red-800 dark:text-red-400 text-sm">Emergency Info</h3>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Blood Type</span>
                  <span className="font-bold text-red-600">{patient.bloodType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Allergies</span>
                  <span className="font-medium text-foreground text-right">{patient.allergies.join(", ")}</span>
                </div>
                <div className="pt-2 border-t border-red-200 dark:border-red-800">
                  <div className="text-muted-foreground mb-0.5">Emergency Contact</div>
                  <div className="font-semibold text-foreground">{patient.emergencyContact.name}</div>
                  <div className="text-muted-foreground">{patient.emergencyContact.phone}</div>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">Quick Access</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { href: "/prescriptions", label: "Prescriptions", icon: Pill, color: "text-violet-600" },
                  { href: "/lab-reports", label: "Lab Reports", icon: FlaskConical, color: "text-blue-600" },
                  { href: "/medical-history", label: "History", icon: FileText, color: "text-emerald-600" },
                  { href: "/analytics", label: "Analytics", icon: Activity, color: "text-amber-600" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div className="p-3 bg-muted/50 hover:bg-muted rounded-xl text-center transition-colors cursor-pointer">
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${item.color}`} />
                        <div className="text-xs text-muted-foreground">{item.label}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Health Expenses */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Health Expense Tracker</h2>
            <Badge variant="outline" className="text-xs">Last 6 months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={healthExpenses}>
              <defs>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border opacity-50" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, ""]} contentStyle={{ borderRadius: "12px" }} />
              <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} fill="url(#expGrad)" name="Total" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
