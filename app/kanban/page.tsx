import { Sidebar } from "@/components/sidebar"
import { KanbanBoard } from "@/components/kanban-board"

export default function KanbanPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activePage="kanban" />
      <main className="flex-1 overflow-y-auto">
        <KanbanBoard />
      </main>
    </div>
  )
}
