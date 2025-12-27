"use client"

import Link from "next/link"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

interface TopHeaderProps {
  activePage: "dashboard" | "equipment" | "teams" | "requests" | "calendar" | "reports" | "settings"
}

const navItems = [
  { id: "dashboard", label: "Dashboard", href: "/" },
  { id: "equipment", label: "Equipment", href: "/equipment" },
  { id: "requests", label: "Requests", href: "/requests" },
  { id: "teams", label: "Teams", href: "/teams" },
  { id: "calendar", label: "Calendar", href: "/calendar" },
  { id: "reports", label: "Reports", href: "/reports" },
]

export function TopHeader({ activePage }: TopHeaderProps) {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createBrowserClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
      }
    }
    getUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <header className="h-14 border-b border-border/50 bg-[color:var(--color-header)] backdrop-blur-sm sticky top-0 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Horizontal Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activePage === item.id

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {userEmail && (
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 border border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {userEmail.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{userEmail}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
