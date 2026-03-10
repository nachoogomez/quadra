"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  BookOpen,
  Moon,
  Sun,
  LogOut,
  CalendarClock,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUserStore } from "@/lib/stores/user-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Calendar, label: "Calendar", href: "/calendar/month" },
  { icon: CalendarClock, label: "Routine", href: "/routine" },
  { icon: CheckCircle2, label: "Tasks", href: "/tasks" },
  { icon: BookOpen, label: "Notebooks", href: "/notebooks" },
];

function isActive(href: string, pathname: string) {
  if (href === "/calendar/month") return pathname.startsWith("/calendar");
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const user = useUserStore((s) => s.user);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-sidebar px-4 md:hidden">
        <span className="text-sm font-bold text-sidebar-foreground">Quadra</span>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="relative h-9 w-9 rounded-md text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors touch-manipulation"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        >
          <Menu
            size={20}
            className={`absolute inset-0 m-auto transition-all duration-300 motion-reduce:transition-none ${
              mobileOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
            }`}
          />
          <X
            size={20}
            className={`absolute inset-0 m-auto transition-all duration-300 motion-reduce:transition-none ${
              mobileOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
            }`}
          />
        </button>
      </div>

      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-[translate] duration-300 ease-in-out motion-reduce:transition-none md:relative md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Close button (mobile only) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-3 rounded-md p-1.5 text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors md:hidden touch-manipulation"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 px-4 py-5">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage
              src={user?.avatarUrl ?? undefined}
              alt={user?.fullName}
            />
            <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-semibold">
              {user?.initials ?? "??"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold leading-tight truncate">
              {user?.fullName ?? "Loading..."}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email ?? ""}
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ icon: Icon, label, href }) => {
            const active = isActive(href, pathname);
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom actions */}
        <div className="flex flex-col gap-1 px-3 pb-5">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={mounted ? (theme === "dark" ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
          >
            {mounted &&
              (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
            {mounted && (theme === "dark" ? "Light Mode" : "Dark Mode")}
          </button>
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive("/settings", pathname)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60"
            }`}
          >
            <Settings size={18} />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
