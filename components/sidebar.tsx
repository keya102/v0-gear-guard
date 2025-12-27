"use client"

import Link from "next/link"
import { LayoutDashboard, Wrench, Users, ClipboardList, Calendar, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activePage: "dashboard" | "equipment" | "teams" | "requests" | "calendar" | "reports" | "settings"
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { id: "equipment", label: "Equipment", icon: Wrench, href: "/equipment" },
  { id: "teams", label: "Teams", icon: Users, href: "/teams" },
  { id: "requests", label: "Requests", icon: ClipboardList, href: "/requests" },
  { id: "calendar", label: "Calendar", icon: Calendar, href: "/calendar" },
  { id: "reports", label: "Reports", icon: FileText, href: "/reports" },
  { id: "settings", label: "Settings", icon: Settings, href: "/settings" },
]

export function Sidebar({ activePage }: SidebarProps) {
  return (
    <aside className="w-[260px] bg-sidebar border-r border-sidebar-border flex flex-col bg-gradient-to-b from-sidebar to-sidebar/95">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-lg font-bold text-white">GG</span>
          </div>
          <h1 className="text-xl font-bold text-sidebar-foreground">GearGuard</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                "hover:bg-sidebar-accent",
                isActive && "bg-sidebar-accent shadow-sm",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground",
                )}
              />
              <span
                className={cn(
                  "font-medium text-sm",
                  isActive ? "text-sidebar-foreground" : "text-muted-foreground group-hover:text-sidebar-foreground",
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
