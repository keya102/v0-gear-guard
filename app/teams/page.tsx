import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { TeamsView } from "@/components/teams-view"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function TeamsPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activePage="teams" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader activePage="teams" />
        <main className="flex-1 overflow-y-auto">
          <TeamsView />
        </main>
      </div>
    </div>
  )
}
