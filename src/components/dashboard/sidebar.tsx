"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Profile } from "@/types";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  CreditCard,
  Settings,
  Zap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const navItems = [
  { href: "/dashboard", label: "Espacios", icon: LayoutDashboard },
  { href: "/dashboard/testimonials", label: "Testimonios", icon: MessageSquare },
  { href: "/dashboard/billing", label: "Facturación", icon: CreditCard },
  { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
];

export default function Sidebar({
  profile,
  pendingCount = 0,
}: {
  profile: Profile | null;
  pendingCount?: number;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = profile?.full_name
    ? profile.full_name.slice(0, 2).toUpperCase()
    : profile?.email?.slice(0, 2).toUpperCase() ?? "TF";

  const NavContent = () => (
    <>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
              {item.href === "/dashboard/testimonials" && pendingCount > 0 && (
                <span className="ml-auto bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingCount > 9 ? "9+" : pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        {profile?.plan === "free" && (
          <Link
            href="/dashboard/billing"
            onClick={() => setMobileOpen(false)}
            className="block mb-3 p-3 bg-indigo-50 rounded-lg text-xs text-indigo-700 font-medium hover:bg-indigo-100 transition-colors"
          >
            ✨ Upgrade a Pro — $19/mes
          </Link>
        )}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {profile?.full_name ?? profile?.email}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              Plan {profile?.plan ?? "free"}
            </p>
          </div>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex-col z-30">
        <div className="p-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">TestiFlow</span>
          </Link>
        </div>
        <NavContent />
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-30">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900">TestiFlow</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative"
        >
          <Menu className="w-5 h-5" />
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed left-0 top-0 h-full w-72 bg-white z-50 flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">TestiFlow</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}
