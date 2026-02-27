"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Activity, Heart, LayoutDashboard, FileText, Calendar,
  Syringe, QrCode, Map, BarChart3, Users, Bell, LogOut,
  Menu, X, Stethoscope, ShieldCheck, ChevronDown, Moon, Sun,
  FlaskConical, CreditCard, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const patientNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/health-card", label: "Health Card", icon: CreditCard },
  { href: "/medical-history", label: "Medical History", icon: FileText },
  { href: "/prescriptions", label: "Prescriptions", icon: Stethoscope },
  { href: "/lab-reports", label: "Lab Reports", icon: FlaskConical },
  { href: "/vaccinations", label: "Vaccinations", icon: Syringe },
  { href: "/appointments", label: "Appointments", icon: Calendar },
  { href: "/analytics", label: "Health Analytics", icon: BarChart3 },
];

const doctorNav = [
  { href: "/doctor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/patients", label: "My Patients", icon: Users },
  { href: "/doctor/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/doctor/appointments", label: "Appointments", icon: Calendar },
  { href: "/doctor/scanner", label: "QR Scanner", icon: QrCode },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const adminNav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/surveillance", label: "Disease Map", icon: Map },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/alerts", label: "Health Alerts", icon: Bell },
  { href: "/admin/hospitals", label: "Hospital Resources", icon: Heart },
  { href: "/admin/reports", label: "Reports", icon: FileText },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");

  const navItems = user?.role === "patient" ? patientNav
    : user?.role === "doctor" ? doctorNav
    : adminNav;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const roleLabel = user?.role === "patient" ? "Patient"
    : user?.role === "doctor" ? "Doctor"
    : "Administrator";

  const roleBadgeClass = user?.role === "patient" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
    : user?.role === "doctor" ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
    : "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-white tracking-wide">AAROGYAM</div>
            <div className="text-xs text-sidebar-foreground/60 -mt-0.5">Health Intelligence</div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-sidebar-foreground/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-sidebar-accent">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-sm font-semibold">
                {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.name}</div>
              <div className={cn("text-xs px-1.5 py-0.5 rounded-full inline-block mt-0.5", roleBadgeClass)}>{roleLabel}</div>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/doctor" && item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-sidebar-primary text-white shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                {item.label}
                {item.href === "/admin/alerts" && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <button
            onClick={() => setLang(l => l === "en" ? "hi" : "en")}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            <Globe className="w-4 h-4" />
            {lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-background/95 backdrop-blur flex items-center px-4 gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb title */}
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-foreground">
              {navItems.find(n => n.href === pathname)?.label || "AAROGYAM"}
            </h1>
          </div>

          {/* Top right actions */}
          <div className="flex items-center gap-2">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors">
                  <Avatar className="w-7 h-7">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-xs font-semibold">
                      {user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:block">{user?.name?.split(" ")[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{user?.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
