import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { CalendarView } from "@/components/calendar-view"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function CalendarPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activePage="calendar" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader activePage="calendar" />
        <main className="flex-1 overflow-y-auto">
          <CalendarView />
        </main>
      </div>
    </div>
  )
}
