"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useEffect } from "react";
import {
  Activity, Shield, Map, QrCode, BarChart3, Heart,
  ChevronRight, Star, Users, Globe, Zap, Lock,
  FileText, Stethoscope, Bell, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: QrCode,
    title: "Smart Health Card",
    desc: "Unique QR-coded health cards with instant patient identification and emergency medical information access.",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Map,
    title: "Disease Surveillance Map",
    desc: "Real-time interactive heatmap showing disease outbreaks across Indian cities with trend analytics.",
    color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    icon: BarChart3,
    title: "AI-Powered Analytics",
    desc: "Predictive disease modeling, epidemic forecasting, and intelligent health risk assessment tools.",
    color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
  },
  {
    icon: FileText,
    title: "Digital Health Records",
    desc: "Complete medical history timeline, digital prescriptions, lab reports, and vaccination tracking.",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  },
  {
    icon: Stethoscope,
    title: "Doctor Portal",
    desc: "Clinical decision support, drug interaction warnings, telemedicine interface, and patient management.",
    color: "text-pink-600 bg-pink-50 dark:bg-pink-900/20",
  },
  {
    icon: Bell,
    title: "Early Warning System",
    desc: "Threshold-based automated alerts for disease outbreaks, epidemic forecasting, and public health notifications.",
    color: "text-red-600 bg-red-50 dark:bg-red-900/20",
  },
];

const stats = [
  { value: "50K+", label: "Patients Registered" },
  { value: "25+", label: "Cities Monitored" },
  { value: "98%", label: "Uptime" },
  { value: "< 2s", label: "Alert Response" },
];

const roles = [
  {
    role: "Patient",
    icon: Heart,
    desc: "Access your health records, book appointments, track medications, and manage your family's health.",
    color: "from-blue-500 to-blue-700",
    href: "/login?role=patient",
    credentials: "patient@aarogyam.com / password123",
  },
  {
    role: "Doctor",
    icon: Stethoscope,
    desc: "Manage patients, write digital prescriptions, access clinical tools and telemedicine features.",
    color: "from-emerald-500 to-emerald-700",
    href: "/login?role=doctor",
    credentials: "doctor@aarogyam.com / password123",
  },
  {
    role: "Administrator",
    icon: Globe,
    desc: "Monitor disease outbreaks, analyze public health trends, manage hospital resources and alerts.",
    color: "from-violet-500 to-violet-700",
    href: "/login?role=admin",
    credentials: "admin@aarogyam.com / password123",
  },
];

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "patient") router.replace("/dashboard");
      else if (user?.role === "doctor") router.replace("/doctor");
      else router.replace("/admin");
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                AAROGYAM
              </span>
              <div className="text-xs text-muted-foreground -mt-1 hidden sm:block">Empowering Health Through Intelligence</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" size="sm">Login</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 aarogyam-gradient-subtle" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.12),transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-3 py-1">
              <Zap className="w-3.5 h-3.5 mr-1.5" />
              Smart Healthcare Intelligence Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight">
              India's{" "}
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
                Smarter
              </span>{" "}
              Healthcare System
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              AAROGYAM unifies patient health records, disease surveillance, and AI-powered analytics
              to empower patients, clinicians, and public health officials across India.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 shadow-lg shadow-blue-500/25">
                  Explore the Platform
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/admin/surveillance">
                <Button size="lg" variant="outline" className="px-6">
                  <Map className="w-4 h-4 mr-2" />
                  View Disease Map
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-white/70 dark:bg-card/70 rounded-2xl border border-border backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              Everything Healthcare Needs
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools for patients, doctors, and public health administrators in one unified platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group p-6 bg-card border border-border rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Role-based access */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
              Choose Your Role
            </h2>
            <p className="text-muted-foreground text-lg">
              Tailored dashboards for every healthcare stakeholder.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <Link key={r.role} href={r.href} className="group">
                  <div className="p-6 bg-card border border-border rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{r.role}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{r.desc}</p>
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground font-mono bg-muted/60 px-3 py-2 rounded-lg">
                        Demo: {r.credentials}
                      </div>
                    </div>
                    <div className="flex items-center text-blue-600 text-sm font-semibold mt-4 group-hover:gap-2 transition-all gap-1">
                      Login as {r.role}
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlight: Disease Surveillance */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200">
                Star Feature
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-5">
                Real-time Disease{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                  Surveillance
                </span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Monitor active disease outbreaks across India with interactive heatmaps, time-series analytics,
                and AI-powered early warning alerts. Track dengue, malaria, cholera, and more in real-time.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Interactive outbreak heatmap with city-level granularity",
                  "Disease trend analysis with predictive modeling",
                  "Automated alerts for epidemic thresholds",
                  "Hospital resource availability tracking",
                  "Contact tracing visualization",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/login?role=admin">
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white">
                  <Map className="w-4 h-4 mr-2" />
                  Open Surveillance Dashboard
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500 live-indicator" />
                <span className="text-white/80 text-sm font-medium">LIVE Disease Surveillance</span>
                <span className="ml-auto text-white/50 text-xs">Auto-refreshing</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { city: "Mumbai", disease: "Dengue", cases: 245, trend: "+12%", color: "text-red-400" },
                  { city: "Delhi", disease: "Dengue", cases: 312, trend: "+8%", color: "text-red-400" },
                  { city: "Lucknow", disease: "Encephalitis", cases: 78, trend: "+24%", color: "text-red-400" },
                  { city: "Chennai", disease: "Cholera", cases: 34, trend: "-5%", color: "text-yellow-400" },
                  { city: "Bangalore", disease: "H1N1", cases: 67, trend: "+3%", color: "text-yellow-400" },
                  { city: "Kolkata", disease: "Malaria", cases: 156, trend: "-8%", color: "text-green-400" },
                ].map((item) => (
                  <div key={item.city} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
                    <div>
                      <span className="text-white text-sm font-medium">{item.city}</span>
                      <span className="text-white/50 text-xs ml-2">{item.disease}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/80 text-sm font-semibold">{item.cases} cases</span>
                      <span className={`text-xs font-semibold ${item.color}`}>{item.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {["🔴 Critical", "🟡 Warning", "🟢 Stable"].map((s) => (
                  <div key={s} className="bg-white/5 rounded-lg px-2 py-1.5 text-center text-xs text-white/60">{s}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground">AAROGYAM</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Powered by AAROGYAM &mdash; Empowering Health Through Intelligence
            </p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              HIPAA-compliant &bull; Secure
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
