"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, BarChart2 } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { settings } = useSettingsStore();

  const navLinks = [
    { href: "/", label: "Estimator", icon: Home },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/reporting", label: "Leads", icon: BarChart2 },
  ];

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          {settings.branding.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.branding.logo}
              alt="Logo"
              className="h-8 w-8 object-contain rounded"
            />
          )}
          <span>{settings.branding.companyName}</span>
        </Link>

        <div className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors",
                pathname === href
                  ? "bg-white/20 font-medium"
                  : "hover:bg-white/10 text-white/80"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
