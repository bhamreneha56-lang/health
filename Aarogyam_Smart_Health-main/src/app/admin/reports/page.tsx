"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import { diseaseData, diseaseTrends, ageGroupData } from "@/lib/mockData";
import { FileText, Download, Filter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminReportsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [reportType, setReportType] = useState("outbreak");
  const [dateRange, setDateRange] = useState("last30");

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const reports = [
    { id: "RPT-001", name: "National Disease Surveillance Report - January 2024", type: "Outbreak", date: "2024-01-15", status: "ready" },
    { id: "RPT-002", name: "Dengue Outbreak Analysis - Mumbai Region Q4 2023", type: "Outbreak", date: "2024-01-10", status: "ready" },
    { id: "RPT-003", name: "Hospital Capacity Utilization Report - Q4 2023", type: "Hospital", date: "2024-01-08", status: "ready" },
    { id: "RPT-004", name: "Encephalitis Alert Report - UP & Bihar", type: "Alert", date: "2024-01-15", status: "ready" },
    { id: "RPT-005", name: "Vaccination Coverage Analysis 2023", type: "Vaccination", date: "2024-01-05", status: "ready" },
    { id: "RPT-006", name: "Vector-Borne Disease Trend Analysis 2023", type: "Trend", date: "2024-01-01", status: "ready" },
    { id: "RPT-007", name: "Epidemiological Weekly Bulletin - Week 2 2024", type: "Bulletin", date: "2024-01-12", status: "ready" },
  ];

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Generate and export public health surveillance reports</p>
          </div>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" size="sm" onClick={() => toast.success("Generating new report...")}>
            <FileText className="w-4 h-4" />
            Generate Report
          </Button>
        </div>

        {/* Report Builder */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-6">
          <h2 className="font-semibold text-foreground mb-4">Quick Report Generator</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Report Type</label>
              <select
                value={reportType}
                onChange={e => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Report type"
              >
                <option value="outbreak">Disease Outbreak Summary</option>
                <option value="trend">Disease Trend Analysis</option>
                <option value="hospital">Hospital Capacity Report</option>
                <option value="alert">Alert Summary</option>
                <option value="vaccination">Vaccination Coverage</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Date Range</label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Date range"
              >
                <option value="last7">Last 7 days</option>
                <option value="last30">Last 30 days</option>
                <option value="last90">Last 3 months</option>
                <option value="ytd">Year to date</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Format</label>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-1.5" onClick={() => toast.success("PDF report generated!")}>
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1.5" onClick={() => toast.success("Excel report downloaded!")}>
                  <Download className="w-3.5 h-3.5" />
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Report list */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Available Reports</h2>
            <Badge variant="outline" className="text-xs">{reports.length} reports</Badge>
          </div>
          <div className="divide-y divide-border">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground text-sm">{report.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="text-xs bg-muted text-muted-foreground">{report.type}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.date}
                    </span>
                    <span className="text-xs text-muted-foreground">{report.id}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">{report.status}</Badge>
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => toast.success(`Downloading ${report.name}...`)}>
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
