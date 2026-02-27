"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { vitalsHistory, healthExpenses, ageGroupData } from "@/lib/mockData";
import { TrendingDown, TrendingUp, Heart, Activity, Droplets } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const riskFactors = [
  { factor: "Blood Pressure", score: 65, status: "moderate" },
  { factor: "Blood Glucose", score: 55, status: "moderate" },
  { factor: "Cholesterol", score: 70, status: "elevated" },
  { factor: "BMI", score: 40, status: "elevated" },
  { factor: "Physical Activity", score: 75, status: "good" },
  { factor: "Diet Quality", score: 60, status: "moderate" },
  { factor: "Stress Level", score: 45, status: "elevated" },
  { factor: "Sleep Quality", score: 70, status: "good" },
];

const radarData = [
  { metric: "BP", value: 65, fullMark: 100 },
  { metric: "Glucose", value: 55, fullMark: 100 },
  { metric: "Cholesterol", value: 30, fullMark: 100 },
  { metric: "Fitness", value: 75, fullMark: 100 },
  { metric: "Diet", value: 60, fullMark: 100 },
  { metric: "Sleep", value: 70, fullMark: 100 },
];

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Health Analytics</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Personalized health insights and trend analysis</p>
        </div>

        {/* Risk Assessment */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-foreground">Risk Assessment Score</h2>
            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Moderate Risk</Badge>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                {riskFactors.map((r) => (
                  <div key={r.factor}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{r.factor}</span>
                      <span className={
                        r.status === "good" ? "text-emerald-600" :
                        r.status === "moderate" ? "text-amber-600" : "text-red-600"
                      }>{r.score}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          r.status === "good" ? "bg-emerald-500" :
                          r.status === "moderate" ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${r.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <Radar name="Score" dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Vitals Trend */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Vitals Trend</h2>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block" /> BP Systolic</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-emerald-500 inline-block" /> Glucose</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={vitalsHistory}>
                <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: "12px" }} />
                <Line type="monotone" dataKey="systolic" stroke="#2563eb" strokeWidth={2} dot={false} name="BP Systolic" />
                <Line type="monotone" dataKey="glucose" stroke="#10b981" strokeWidth={2} dot={false} name="Blood Glucose" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Health Expenses */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Health Expenses Breakdown</h2>
              <Badge variant="outline" className="text-xs">Last 6 months</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={healthExpenses}>
                <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, ""]} contentStyle={{ borderRadius: "12px" }} />
                <Legend />
                <Bar dataKey="consultation" stackId="a" fill="#2563eb" name="Consultation" radius={[0,0,0,0]} />
                <Bar dataKey="medicines" stackId="a" fill="#10b981" name="Medicines" />
                <Bar dataKey="labTests" stackId="a" fill="#f59e0b" name="Lab Tests" />
                <Bar dataKey="hospitalization" stackId="a" fill="#ef4444" name="Hospitalization" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weight & Heart Rate */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Weight Trend & Heart Rate</h2>
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <TrendingDown className="w-4 h-4" />
              Improving trend
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={vitalsHistory}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} domain={[80, 86]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[70, 82]} />
              <Tooltip contentStyle={{ borderRadius: "12px" }} />
              <Area yAxisId="left" type="monotone" dataKey="weight" stroke="#10b981" fill="url(#wGrad)" strokeWidth={2} name="Weight (kg)" />
              <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#ef4444" strokeWidth={2} dot={false} name="Heart Rate (bpm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Health Recommendations */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-semibold text-foreground mb-4">AI Health Recommendations</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: Heart, color: "text-red-500 bg-red-50 dark:bg-red-900/20", title: "Blood Pressure", rec: "Consider reducing sodium intake. Your BP has improved 10 mmHg over 30 days. Continue current medication.", trend: "↓ improving" },
              { icon: Droplets, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20", title: "Blood Glucose", rec: "HbA1c at 7.2% - near target. Maintain post-meal walks and carbohydrate counting for better control.", trend: "→ stable" },
              { icon: Activity, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20", title: "Physical Activity", rec: "Increase to 45 min/day of moderate activity. This can reduce your cardiovascular risk by 25%.", trend: "↑ increase" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="p-4 bg-muted/40 rounded-xl">
                  <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-foreground text-sm mb-1">{item.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.rec}</p>
                  <div className="mt-2 text-xs font-semibold text-blue-600">{item.trend}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
