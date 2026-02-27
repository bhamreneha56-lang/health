"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { diseaseTrends, ageGroupData, diseaseData } from "@/lib/mockData";
import { BarChart3, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

// State-level aggregation
const stateData = diseaseData.reduce((acc: Record<string, number>, d) => {
  acc[d.state] = (acc[d.state] || 0) + d.cases;
  return acc;
}, {});
const stateChartData = Object.entries(stateData)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([state, cases]) => ({ state: state.replace("West Bengal", "W. Bengal").replace("Tamil Nadu", "Tamil Nadu").replace("Uttar Pradesh", "UP").replace("Madhya Pradesh", "MP"), cases }));

const mortalityData = [
  { disease: "Encephalitis", cfr: 10.8 },
  { disease: "Cholera", cfr: 2.9 },
  { disease: "Kala Azar", cfr: 1.8 },
  { disease: "Dengue", cfr: 0.8 },
  { disease: "Malaria", cfr: 0.7 },
  { disease: "Typhoid", cfr: 0.4 },
  { disease: "H1N1", cfr: 1.5 },
];

export default function AdminAnalyticsPage() {
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
          <p className="text-muted-foreground text-sm mt-0.5">Comprehensive disease surveillance analytics and epidemiology reports</p>
        </div>

        {/* Multi-disease trend */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Multi-Disease Trend Analysis</h2>
            <Badge variant="outline" className="text-xs">Last 6 months</Badge>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={diseaseTrends}>
              <defs>
                <linearGradient id="dengGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="malGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "12px" }} />
              <Legend />
              <Area type="monotone" dataKey="dengue" stroke="#ef4444" fill="url(#dengGrad)" strokeWidth={2.5} name="Dengue" />
              <Area type="monotone" dataKey="malaria" stroke="#f97316" fill="url(#malGrad)" strokeWidth={2} name="Malaria" />
              <Line type="monotone" dataKey="typhoid" stroke="#f59e0b" strokeWidth={2} dot={false} name="Typhoid" />
              <Line type="monotone" dataKey="chikungunya" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Chikungunya" />
              <Line type="monotone" dataKey="cholera" stroke="#06b6d4" strokeWidth={2} dot={false} name="Cholera" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* State-wise and Age Group */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Cases by State</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stateChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip contentStyle={{ borderRadius: "12px" }} />
                <Bar dataKey="cases" fill="#2563eb" radius={[0, 4, 4, 0]} name="Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-semibold text-foreground mb-4">Age Group Distribution</h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ageGroupData}>
                <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
                <XAxis dataKey="group" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px" }} />
                <Legend />
                <Bar dataKey="dengue" stackId="a" fill="#ef4444" name="Dengue" />
                <Bar dataKey="malaria" stackId="a" fill="#f97316" name="Malaria" />
                <Bar dataKey="typhoid" stackId="a" fill="#f59e0b" name="Typhoid" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Case Fatality Rate */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Case Fatality Rate (CFR) by Disease</h2>
            <Badge className="bg-red-100 text-red-700 text-xs">Critical metric</Badge>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mortalityData}>
              <CartesianGrid strokeDasharray="3 3" className="text-border opacity-50" />
              <XAxis dataKey="disease" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, "CFR"]} contentStyle={{ borderRadius: "12px" }} />
              <Bar dataKey="cfr" fill="#ef4444" radius={[4, 4, 0, 0]} name="CFR %">
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Epidemic Forecast */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Epidemic Forecasting (AI Model)
            </h2>
            <Badge className="bg-violet-100 text-violet-700 text-xs">ML Prediction</Badge>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            {[
              { disease: "Dengue", current: 389, predicted: 420, change: "+8%", risk: "high", peak: "March 2024" },
              { disease: "Malaria", current: 178, predicted: 145, change: "-18%", risk: "moderate", peak: "Post-monsoon" },
              { disease: "Encephalitis", current: 123, predicted: 98, change: "-20%", risk: "high", peak: "Declining" },
            ].map(forecast => (
              <div key={forecast.disease} className="p-4 bg-muted/40 rounded-xl">
                <div className="font-semibold text-foreground mb-2">{forecast.disease}</div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Current:</span>
                  <span className="font-semibold text-foreground">{forecast.current} cases</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Predicted:</span>
                  <span className="font-semibold text-foreground">{forecast.predicted} cases</span>
                </div>
                <div className={`text-sm font-bold mb-1 ${forecast.change.startsWith("+") ? "text-red-600" : "text-emerald-600"}`}>
                  {forecast.change} forecast
                </div>
                <div className="text-xs text-muted-foreground">Peak: {forecast.peak}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            Predictions based on historical patterns, climate data, and vector density modeling. Accuracy: ~82%
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
