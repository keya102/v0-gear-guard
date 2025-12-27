import { Sidebar } from "@/components/sidebar"
import { TopHeader } from "@/components/top-header"
import { EquipmentManagement } from "@/components/equipment-management"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase"

export default async function EquipmentPage() {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activePage="equipment" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopHeader activePage="equipment" />
        <main className="flex-1 overflow-y-auto">
          <EquipmentManagement />
        </main>
      </div>
    </div>
  )
}
