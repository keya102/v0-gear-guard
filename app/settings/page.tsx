import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { Settings } from "@/components/settings"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function SettingsPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activePage="settings" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader activePage="settings" />
        <main className="flex-1 overflow-y-auto">
          <Settings />
        </main>
      </div>
    </div>
  )
}
