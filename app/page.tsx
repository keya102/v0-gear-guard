import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { Dashboard } from "@/components/dashboard"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function Page() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activePage="dashboard" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader activePage="dashboard" />
        <main className="flex-1 overflow-y-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}
