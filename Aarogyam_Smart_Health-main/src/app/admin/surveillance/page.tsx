"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { diseaseData, healthAlerts } from "@/lib/mockData";
import { Map, Filter, RefreshCw, AlertTriangle, Info, ZoomIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES: Record<string, { dot: string; bg: string; text: string; size: number }> = {
  critical: { dot: "bg-red-600", bg: "bg-red-100 dark:bg-red-900/20 border-red-200", text: "text-red-700 dark:text-red-400", size: 28 },
  high: { dot: "bg-orange-500", bg: "bg-orange-100 dark:bg-orange-900/20 border-orange-200", text: "text-orange-700 dark:text-orange-400", size: 22 },
  moderate: { dot: "bg-amber-400", bg: "bg-amber-100 dark:bg-amber-900/20 border-amber-200", text: "text-amber-700 dark:text-amber-400", size: 16 },
  low: { dot: "bg-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200", text: "text-emerald-700 dark:text-emerald-400", size: 12 },
};

// City coordinates mapped to SVG positions (for India map approximation)
// Using a simplified bounding box approach for India
const MAP_BOUNDS = { minLat: 8.4, maxLat: 35.5, minLng: 68.7, maxLng: 97.4 };

function latLngToSVG(lat: number, lng: number, width: number, height: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * width;
  const y = height - ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * height;
  return { x, y };
}

// Aggregate cases per city/disease
const cityAggregates = diseaseData.reduce((acc: Record<string, typeof diseaseData[0][]>, d) => {
  if (!acc[d.city]) acc[d.city] = [];
  acc[d.city].push(d);
  return acc;
}, {});

const cityPoints = Object.entries(cityAggregates).map(([city, records]) => {
  const first = records[0];
  const totalCases = records.reduce((s, r) => s + r.cases, 0);
  const topRecord = records.sort((a, b) => {
    const sev = { critical: 4, high: 3, moderate: 2, low: 1 };
    return (sev[b.severity as keyof typeof sev] || 0) - (sev[a.severity as keyof typeof sev] || 0);
  })[0];
  return {
    city,
    state: first.state,
    lat: first.lat,
    lng: first.lng,
    totalCases,
    severity: topRecord.severity,
    diseases: records.map(r => r.disease),
    deaths: records.reduce((s, r) => s + r.deaths, 0),
  };
});

export default function SurveillanceMapPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<typeof cityPoints[0] | null>(null);
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterDisease, setFilterDisease] = useState("all");
  const [liveCount, setLiveCount] = useState(diseaseData.reduce((a, d) => a + d.cases, 0));
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  // Live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 8));
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const allDiseases = Array.from(new Set(diseaseData.map(d => d.disease)));

  const filteredPoints = cityPoints.filter(p => {
    if (filterSeverity !== "all" && p.severity !== filterSeverity) return false;
    if (filterDisease !== "all" && !p.diseases.includes(filterDisease)) return false;
    return true;
  });

  if (!isAuthenticated) return null;

  // SVG dimensions
  const SVG_W = 600;
  const SVG_H = 520;

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Map className="w-6 h-6 text-blue-600" />
              Disease Surveillance Map
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Real-time disease outbreak monitoring across India
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 live-indicator" />
              LIVE &bull; {liveCount.toLocaleString()} active cases &bull; {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Filters:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["all", "critical", "high", "moderate", "low"].map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize",
                    filterSeverity === sev
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                  )}
                >
                  {sev === "all" ? "All Severity" : sev}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["all", ...allDiseases].map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDisease(d)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                    filterDisease === d
                      ? "bg-emerald-600 text-white border-emerald-600"
                      : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                  )}
                >
                  {d === "all" ? "All Diseases" : d}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* SVG Map */}
          <div className="lg:col-span-2 bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 live-indicator" />
                <span className="text-white text-xs font-medium">Disease Heatmap India</span>
              </div>
              <div className="text-white/50 text-xs bg-black/50 backdrop-blur-sm rounded-xl px-3 py-1.5">
                {filteredPoints.length} outbreak zones
              </div>
            </div>

            {/* SVG India Map */}
            <div className="relative" style={{ paddingBottom: "86.7%" }}>
              <svg
                ref={svgRef}
                viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                className="absolute inset-0 w-full h-full"
                style={{ background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)" }}
              >
                {/* India outline - simplified polygon */}
                <polygon
                  points="150,40 200,30 260,25 310,40 350,55 390,70 420,100 440,130 450,160 460,200 455,240 440,270 420,300 410,330 400,360 380,380 360,400 340,415 310,425 290,440 270,455 250,465 230,460 210,450 190,440 170,425 155,405 140,385 130,365 120,345 115,320 110,295 105,270 100,245 95,220 95,195 100,170 110,145 120,120 130,95 140,70"
                  fill="#1e3a5f"
                  stroke="#2d5986"
                  strokeWidth="1.5"
                  opacity="0.8"
                />

                {/* Grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map(f => (
                  <line key={`h${f}`} x1="80" y1={SVG_H * f} x2={SVG_W - 50} y2={SVG_H * f} stroke="#2d5986" strokeWidth="0.5" opacity="0.3" />
                ))}
                {[0.2, 0.4, 0.6, 0.8].map(f => (
                  <line key={`v${f}`} x1={SVG_W * f} y1="20" x2={SVG_W * f} y2={SVG_H - 30} stroke="#2d5986" strokeWidth="0.5" opacity="0.3" />
                ))}

                {/* City outbreak markers */}
                {filteredPoints.map((point) => {
                  const pos = latLngToSVG(point.lat, point.lng, SVG_W, SVG_H);
                  const style = SEVERITY_STYLES[point.severity] || SEVERITY_STYLES.low;
                  const r = style.size / 2;
                  const isSelected = selectedCity?.city === point.city;

                  return (
                    <g key={point.city} onClick={() => setSelectedCity(point)} style={{ cursor: "pointer" }}>
                      {/* Pulsing ring for critical/high */}
                      {(point.severity === "critical" || point.severity === "high") && (
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={r + 8}
                          fill="none"
                          stroke={point.severity === "critical" ? "#dc2626" : "#f97316"}
                          strokeWidth="1.5"
                          opacity="0.4"
                          className="animate-ping"
                          style={{ animationDuration: "2s" }}
                        />
                      )}

                      {/* Main marker */}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={r}
                        fill={
                          point.severity === "critical" ? "rgba(220, 38, 38, 0.85)" :
                          point.severity === "high" ? "rgba(249, 115, 22, 0.85)" :
                          point.severity === "moderate" ? "rgba(245, 158, 11, 0.85)" :
                          "rgba(16, 185, 129, 0.85)"
                        }
                        stroke={isSelected ? "#ffffff" : "rgba(255,255,255,0.3)"}
                        strokeWidth={isSelected ? 2.5 : 1}
                      />

                      {/* City label */}
                      <text
                        x={pos.x}
                        y={pos.y + r + 10}
                        textAnchor="middle"
                        fill="rgba(255,255,255,0.8)"
                        fontSize="8"
                        fontWeight="500"
                      >
                        {point.city}
                      </text>

                      {/* Cases count */}
                      <text
                        x={pos.x}
                        y={pos.y + 3}
                        textAnchor="middle"
                        fill="white"
                        fontSize="7"
                        fontWeight="bold"
                      >
                        {point.totalCases > 999 ? `${Math.round(point.totalCases/100)/10}k` : point.totalCases}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-xl p-3">
              <div className="text-white/70 text-xs mb-2 font-medium">Severity Legend</div>
              <div className="space-y-1">
                {["critical", "high", "moderate", "low"].map(sev => {
                  const s = SEVERITY_STYLES[sev];
                  return (
                    <div key={sev} className="flex items-center gap-2">
                      <div className={`w-${Math.max(2, Math.min(4, s.size/6))} h-${Math.max(2, Math.min(4, s.size/6))} rounded-full ${s.dot}`} style={{ width: s.size/3, height: s.size/3 }} />
                      <span className="text-white/60 text-xs capitalize">{sev}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel: Selected city info + alerts */}
          <div className="space-y-4">
            {/* Selected City Info */}
            {selectedCity ? (
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{selectedCity.city}</h3>
                  <Badge className={cn("text-xs border capitalize", SEVERITY_STYLES[selectedCity.severity].bg, SEVERITY_STYLES[selectedCity.severity].text)}>
                    {selectedCity.severity}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-3">{selectedCity.state}</div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-muted/50 rounded-xl p-2.5 text-center">
                    <div className="text-xl font-bold text-foreground">{selectedCity.totalCases}</div>
                    <div className="text-xs text-muted-foreground">Active Cases</div>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-2.5 text-center">
                    <div className="text-xl font-bold text-red-600">{selectedCity.deaths}</div>
                    <div className="text-xs text-muted-foreground">Deaths</div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-xs text-muted-foreground mb-1.5">Active Diseases:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCity.diseases.map(d => (
                      <span key={d} className="bg-muted text-foreground text-xs px-2 py-0.5 rounded-lg">{d}</span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-start gap-1">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  Data aggregated from all surveillance records for this city
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-4 text-center">
                <Map className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Click on any outbreak marker on the map to see details</div>
              </div>
            )}

            {/* Active Alerts */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="font-semibold text-foreground text-sm">Active Alerts</h3>
              </div>
              <div className="space-y-2">
                {healthAlerts.filter(a => a.status === "active").map(alert => (
                  <div key={alert.id} className={cn(
                    "p-3 rounded-xl border text-sm",
                    alert.severity === "critical" ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800" :
                    "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800"
                  )}>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={cn("text-xs font-semibold", alert.severity === "critical" ? "text-red-600" : "text-amber-700 dark:text-amber-400")}>
                        {alert.severity === "critical" ? "🔴" : "🟡"} {alert.title}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{alert.location}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{alert.description.slice(0, 80)}...</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="font-semibold text-foreground text-sm mb-3">Outbreak Summary</h3>
              <div className="space-y-2">
                {["critical", "high", "moderate", "low"].map(sev => {
                  const count = cityPoints.filter(p => p.severity === sev).length;
                  const style = SEVERITY_STYLES[sev];
                  return (
                    <div key={sev} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
                        <span className="text-sm text-foreground capitalize">{sev}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{count} cities</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
