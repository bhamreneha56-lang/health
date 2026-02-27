"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { diseaseData, diseaseTrends, healthAlerts, hospitalResources } from "@/lib/mockData";
import {
  Map, AlertTriangle, Users, Hospital, TrendingUp, Activity,
  Bell, Shield, BarChart3, Globe, RefreshCw, ArrowUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from "recharts";
import { cn } from "@/lib/utils";

const SEVERITY_COLORS = {
  critical: "#dc2626",
  high: "#f97316",
  moderate: "#f59e0b",
  low: "#10b981",
};

const diseaseColors = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const topCities = diseaseData.reduce((acc: Record<string, number>, d) => {
  acc[d.city] = (acc[d.city] || 0) + d.cases;
  return acc;
}, {});
const cityData = Object.entries(topCities)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([city, cases]) => ({ city, cases }));

const diseaseDistribution = diseaseData.reduce((acc: Record<string, number>, d) => {
  acc[d.disease] = (acc[d.disease] || 0) + d.cases;
  return acc;
}, {});
const pieData = Object.entries(diseaseDistribution).map(([name, value]) => ({ name, value }));

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [liveCount, setLiveCount] = useState(diseaseData.reduce((a, d) => a + d.cases, 0));

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
    else if (user?.role !== "admin") {
      if (user?.role === "patient") router.replace("/dashboard");
      else router.replace("/doctor");
    }
  }, [isAuthenticated, user, router]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 5));
      setLastRefresh(new Date());
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const activeAlerts = healthAlerts.filter(a => a.status === "active");
  const criticalCount = diseaseData.filter(d => d.severity === "critical").length;
  const totalHospitals = hospitalResources.length;
  const avgOccupancy = Math.round(
    hospitalResources.reduce((acc, h) => acc + (h.occupied / h.totalBeds) * 100, 0) / hospitalResources.length
  );

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Globe className="w-6 h-6 text-blue-600" />
              Public Health Surveillance
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Real-time disease monitoring across India
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-emerald-500 live-indicator" />
              Live &bull; Updated {lastRefresh.toLocaleTimeString()}
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setLastRefresh(new Date())}>
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </Button>
            <Link href="/admin/surveillance">
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                <Map className="w-3.5 h-3.5" />
                View Map
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Alert Banner */}
        {activeAlerts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-red-600" />
              <span className="font-semibold text-red-700 dark:text-red-400 text-sm">{activeAlerts.length} Active Alerts Require Attention</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeAlerts.slice(0, 3).map(alert => (
                <div key={alert.id} className={cn("px-3 py-1.5 rounded-xl border text-xs font-medium",
                  alert.severity === "critical" ? "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400" :
                  "bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400"
                )}>
                  🚨 {alert.title}
                </div>
              ))}
              <Link href="/admin/alerts">
                <button className="text-xs text-blue-600 hover:underline self-center">View all →</button>
              </Link>
            </div>
          </div>
        )}

        {/* KPI Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Active Cases", value: liveCount.toLocaleString(), icon: Activity, color: "text-red-600 bg-red-50 dark:bg-red-900/20", change: "+127 today", up: true },
            { label: "Cities Monitored", value: "25", icon: Globe, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20", change: "5 states", up: false },
            { label: "Critical Outbreaks", value: criticalCount.toString(), icon: AlertTriangle, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20", change: `${activeAlerts.length} active alerts`, up: true },
            { label: "Hospital Occupancy", value: `${avgOccupancy}%`, icon: Hospital, color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20", change: "5 hospitals tracked", up: false },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-4">
                <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                <div className={`flex items-center gap-0.5 mt-1 text-xs ${stat.up ? "text-red-500" : "text-muted-foreground"}`}>
                  {stat.up && <ArrowUp className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Disease Trend */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Disease Trends (Aug–Jan)</h2>
              <Badge variant="outline" className="text-xs">Multi-disease</Badge>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={diseaseTrends}>
                <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid var(--border)" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="dengue" stroke="#ef4444" strokeWidth={2} dot={false} name="Dengue" />
                <Line type="monotone" dataKey="malaria" stroke="#f97316" strokeWidth={2} dot={false} name="Malaria" />
                <Line type="monotone" dataKey="typhoid" stroke="#f59e0b" strokeWidth={2} dot={false} name="Typhoid" />
                <Line type="monotone" dataKey="chikungunya" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Chikungunya" />
                <Line type="monotone" dataKey="cholera" stroke="#06b6d4" strokeWidth={2} dot={false} name="Cholera" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Disease Distribution Pie */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Disease Distribution</h2>
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={diseaseColors[idx % diseaseColors.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [v, "cases"]} contentStyle={{ borderRadius: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {pieData.slice(0, 5).map((d, idx) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: diseaseColors[idx] }} />
                    <span className="text-foreground">{d.name}</span>
                  </div>
                  <span className="text-muted-foreground font-medium">{d.value} cases</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* City-wise Cases & Hospital Resources */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* City Bar Chart */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Cases by City</h2>
              <Link href="/admin/surveillance">
                <Button variant="outline" size="sm" className="text-xs gap-1">
                  <Map className="w-3.5 h-3.5" />
                  View Map
                </Button>
              </Link>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={cityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} width={70} />
                <Tooltip contentStyle={{ borderRadius: "12px" }} />
                <Bar dataKey="cases" fill="#ef4444" radius={[0, 4, 4, 0]} name="Total Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hospital Resources */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Hospital Capacity</h2>
              <Link href="/admin/hospitals">
                <Button variant="outline" size="sm" className="text-xs">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {hospitalResources.slice(0, 4).map((h) => {
                const occupancyPct = Math.round((h.occupied / h.totalBeds) * 100);
                const icuPct = Math.round((h.icuOccupied / h.icu) * 100);
                return (
                  <div key={h.hospital} className="p-3 bg-muted/40 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-foreground">{h.hospital}</div>
                        <div className="text-xs text-muted-foreground">{h.city}</div>
                      </div>
                      <Badge className={cn(
                        "text-xs",
                        occupancyPct > 90 ? "bg-red-100 text-red-700" :
                        occupancyPct > 75 ? "bg-amber-100 text-amber-700" :
                        "bg-emerald-100 text-emerald-700"
                      )}>
                        {occupancyPct}% full
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-20">Beds</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${occupancyPct > 90 ? "bg-red-500" : occupancyPct > 75 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${occupancyPct}%` }} />
                        </div>
                        <span className="text-muted-foreground">{h.occupied}/{h.totalBeds}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground w-20">ICU</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${icuPct > 90 ? "bg-red-500" : icuPct > 75 ? "bg-amber-500" : "bg-blue-500"}`} style={{ width: `${icuPct}%` }} />
                        </div>
                        <span className="text-muted-foreground">{h.icuOccupied}/{h.icu}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Disease Alerts Table */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Latest Disease Reports</h2>
            <Link href="/admin/surveillance">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                View Surveillance Map
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase pb-2">City</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase pb-2">Disease</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase pb-2">Cases</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase pb-2">Deaths</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase pb-2">Date</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase pb-2">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {diseaseData.slice(0, 10).map((d) => (
                  <tr key={d.id}>
                    <td className="py-2.5 font-medium text-foreground">{d.city}, {d.state}</td>
                    <td className="py-2.5 text-muted-foreground">{d.disease}</td>
                    <td className="py-2.5 font-semibold text-foreground">{d.cases}</td>
                    <td className="py-2.5 text-red-600 font-semibold">{d.deaths}</td>
                    <td className="py-2.5 text-muted-foreground">{d.date}</td>
                    <td className="py-2.5">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-semibold",
                        d.severity === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        d.severity === "high" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                        d.severity === "moderate" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      )}>
                        {d.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
