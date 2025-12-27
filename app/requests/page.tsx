import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { KanbanBoard } from "@/components/kanban-board"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function RequestsPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activePage="requests" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader activePage="requests" />
        <main className="flex-1 overflow-y-auto">
          <KanbanBoard />
        </main>
      </div>
    </div>
  )
}
