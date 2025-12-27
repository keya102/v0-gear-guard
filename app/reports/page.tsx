import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { ReportsView } from "@/components/reports-view"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function ReportsPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activePage="reports" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader activePage="reports" />
        <main className="flex-1 overflow-y-auto">
          <ReportsView />
        </main>
      </div>
    </div>
  )
}
