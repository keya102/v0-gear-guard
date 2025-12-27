"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertCircle, Wrench, Plus, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Search, Badge } from "lucide-react"

const columns = [
  { id: "new", title: "New", color: "primary" },
  { id: "in-progress", title: "In Progress", color: "warning" },
  { id: "repaired", title: "Repaired", color: "success" },
  { id: "scrap", title: "Scrap", color: "destructive" },
]

interface MaintenanceRequest {
  id: string
  equipment_id: string
  title: string
  description: string | null
  request_type: string
  status: string
  scheduled_date: string | null
  due_date: string | null
  assigned_to: string | null
}

interface Equipment {
  id: string
  name: string
}

interface Profile {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

const initialTasks = [
  {
    id: "1",
    title: "Replace hydraulic fluid",
    equipmentId: "EQ-001",
    equipmentName: "CNC Machine Pro",
    status: "new",
    type: "Preventive",
    assignedTo: { name: "John Smith", avatar: "/technician-female.jpg" },
    dueDate: "2024-12-15",
    isOverdue: false,
  },
  {
    id: "2",
    title: "Calibration required",
    equipmentId: "EQ-001",
    equipmentName: "CNC Machine Pro",
    status: "in-progress",
    type: "Preventive",
    assignedTo: { name: "Sarah Johnson", avatar: "/engineer-male.jpg" },
    dueDate: "2024-12-18",
    isOverdue: false,
  },
  {
    id: "3",
    title: "Pressure valve inspection",
    equipmentId: "EQ-002",
    equipmentName: "Hydraulic Press",
    status: "new",
    type: "Corrective",
    assignedTo: { name: "Mike Davis", avatar: "/technician-woman.jpg" },
    dueDate: "2024-12-10",
    isOverdue: true,
  },
  {
    id: "4",
    title: "Belt replacement needed",
    equipmentId: "EQ-004",
    equipmentName: "Conveyor System",
    status: "in-progress",
    type: "Corrective",
    assignedTo: { name: "Emily Chen", avatar: "/hardworking-construction-worker.png" },
    dueDate: "2024-12-20",
    isOverdue: false,
  },
  {
    id: "5",
    title: "Battery replacement",
    equipmentId: "EQ-003",
    equipmentName: "Forklift Model X",
    status: "repaired",
    type: "Preventive",
    assignedTo: { name: "John Smith", avatar: "/technician-female.jpg" },
    dueDate: "2024-12-12",
    isOverdue: false,
  },
  {
    id: "6",
    title: "Motor bearing check",
    equipmentId: "EQ-004",
    equipmentName: "Conveyor System",
    status: "new",
    type: "Preventive",
    assignedTo: { name: "Sarah Johnson", avatar: "/engineer-male.jpg" },
    dueDate: "2024-12-22",
    isOverdue: false,
  },
  {
    id: "7",
    title: "Lubrication service",
    equipmentId: "EQ-005",
    equipmentName: "Pallet Jack",
    status: "new",
    type: "Preventive",
    assignedTo: { name: "Mike Davis", avatar: "/technician-woman.jpg" },
    dueDate: "2025-01-05",
    isOverdue: false,
  },
  {
    id: "8",
    title: "Safety inspection",
    equipmentId: "EQ-002",
    equipmentName: "Hydraulic Press",
    status: "in-progress",
    type: "Preventive",
    assignedTo: { name: "Emily Chen", avatar: "/hardworking-construction-worker.png" },
    dueDate: "2025-01-08",
    isOverdue: false,
  },
  {
    id: "9",
    title: "Electrical wiring check",
    equipmentId: "EQ-001",
    equipmentName: "CNC Machine Pro",
    status: "new",
    type: "Preventive",
    assignedTo: { name: "John Smith", avatar: "/technician-female.jpg" },
    dueDate: "2025-01-10",
    isOverdue: false,
  },
  {
    id: "10",
    title: "Oil leak repair",
    equipmentId: "EQ-002",
    equipmentName: "Hydraulic Press",
    status: "in-progress",
    type: "Corrective",
    assignedTo: { name: "Sarah Johnson", avatar: "/engineer-male.jpg" },
    dueDate: "2024-12-08",
    isOverdue: true,
  },
  {
    id: "11",
    title: "Tire replacement",
    equipmentId: "EQ-003",
    equipmentName: "Forklift Model X",
    status: "new",
    type: "Corrective",
    assignedTo: { name: "Mike Davis", avatar: "/technician-woman.jpg" },
    dueDate: "2025-01-15",
    isOverdue: false,
  },
  {
    id: "12",
    title: "Chain tension adjustment",
    equipmentId: "EQ-004",
    equipmentName: "Conveyor System",
    status: "repaired",
    type: "Preventive",
    assignedTo: { name: "Emily Chen", avatar: "/hardworking-construction-worker.png" },
    dueDate: "2024-12-14",
    isOverdue: false,
  },
  {
    id: "13",
    title: "Wheel alignment",
    equipmentId: "EQ-005",
    equipmentName: "Pallet Jack",
    status: "in-progress",
    type: "Corrective",
    assignedTo: { name: "John Smith", avatar: "/technician-female.jpg" },
    dueDate: "2025-01-12",
    isOverdue: false,
  },
  {
    id: "14",
    title: "Cooling system flush",
    equipmentId: "EQ-006",
    equipmentName: "Industrial Compressor",
    status: "new",
    type: "Preventive",
    assignedTo: { name: "Sarah Johnson", avatar: "/engineer-male.jpg" },
    dueDate: "2025-01-20",
    isOverdue: false,
  },
  {
    id: "15",
    title: "Control panel replacement",
    equipmentId: "EQ-001",
    equipmentName: "CNC Machine Pro",
    status: "scrap",
    type: "Corrective",
    assignedTo: { name: "Mike Davis", avatar: "/technician-woman.jpg" },
    dueDate: "2024-12-05",
    isOverdue: true,
  },
  {
    id: "16",
    title: "Sensor calibration",
    equipmentId: "EQ-006",
    equipmentName: "Industrial Compressor",
    status: "repaired",
    type: "Preventive",
    assignedTo: { name: "Emily Chen", avatar: "/hardworking-construction-worker.png" },
    dueDate: "2024-12-16",
    isOverdue: false,
  },
  {
    id: "17",
    title: "Filter replacement",
    equipmentId: "EQ-002",
    equipmentName: "Hydraulic Press",
    status: "new",
    type: "Preventive",
    assignedTo: { name: "John Smith", avatar: "/technician-female.jpg" },
    dueDate: "2025-01-25",
    isOverdue: false,
  },
  {
    id: "18",
    title: "Brake system inspection",
    equipmentId: "EQ-003",
    equipmentName: "Forklift Model X",
    status: "in-progress",
    type: "Corrective",
    assignedTo: { name: "Sarah Johnson", avatar: "/engineer-male.jpg" },
    dueDate: "2024-12-07",
    isOverdue: true,
  },
  {
    id: "19",
    title: "Roller bearing replacement",
    equipmentId: "EQ-004",
    equipmentName: "Conveyor System",
    status: "repaired",
    type: "Corrective",
    assignedTo: { name: "Mike Davis", avatar: "/technician-woman.jpg" },
    dueDate: "2024-12-11",
    isOverdue: false,
  },
  {
    id: "20",
    title: "Hydraulic hose inspection",
    equipmentId: "EQ-005",
    equipmentName: "Pallet Jack",
    status: "scrap",
    type: "Corrective",
    assignedTo: { name: "Emily Chen", avatar: "/hardworking-construction-worker.png" },
    dueDate: "2024-12-03",
    isOverdue: true,
  },
]

export function KanbanBoard() {
  const [tasks, setTasks] = useState(initialTasks)
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)
  const [scrapNotification, setScrapNotification] = useState<string | null>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    equipment_id: "",
    title: "",
    description: "",
    request_type: "Preventive",
    scheduled_date: "",
    due_date: "",
    assigned_to: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    const [requestsRes, equipmentRes, profilesRes] = await Promise.all([
      supabase.from("maintenance_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("equipments").select("id, name"),
      supabase.from("profiles").select("id, full_name, email, avatar_url"),
    ])

    if (requestsRes.error) console.error("[v0] Error fetching requests:", requestsRes.error)
    else setTasks(requestsRes.data || [])

    if (equipmentRes.error) console.error("[v0] Error fetching equipment:", equipmentRes.error)
    else setEquipment(equipmentRes.data || [])

    if (profilesRes.error) console.error("[v0] Error fetching profiles:", profilesRes.error)
    else setProfiles(profilesRes.data || [])

    setLoading(false)
  }

  const handleAddRequest = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in to create requests")
      return
    }

    const { error } = await supabase.from("maintenance_requests").insert({
      equipment_id: formData.equipment_id,
      title: formData.title,
      description: formData.description || null,
      request_type: formData.request_type,
      status: "new",
      scheduled_date: formData.scheduled_date || null,
      due_date: formData.due_date || null,
      assigned_to: formData.assigned_to || null,
      created_by: user.id,
      priority: "medium",
    })

    if (error) {
      console.error("[v0] Error adding request:", error)
      alert("Failed to create request: " + error.message)
    } else {
      setShowRequestDialog(false)
      resetForm()
      fetchData()
    }
  }

  const resetForm = () => {
    setFormData({
      equipment_id: "",
      title: "",
      description: "",
      request_type: "Preventive",
      scheduled_date: "",
      due_date: "",
      assigned_to: "",
    })
  }

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (columnId: string) => {
    if (draggedTask === null) return

    const task = tasks.find((t) => t.id === draggedTask)
    if (!task) return

    // Update status in database
    const { error } = await supabase.from("maintenance_requests").update({ status: columnId }).eq("id", draggedTask)

    if (error) {
      console.error("[v0] Error updating task status:", error)
      alert("Failed to update task status")
      return
    }

    // If moving to scrap, update equipment as scrapped
    if (columnId === "scrap") {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const timestamp = new Date().toLocaleString()
      const message = `Equipment ${task.equipment_id} marked as SCRAPPED - ${timestamp}`

      await supabase
        .from("equipments")
        .update({
          is_scrapped: true,
          scrapped_at: new Date().toISOString(),
          scrapped_by: user?.id || null,
          notes: message,
        })
        .eq("id", task.equipment_id)

      setScrapNotification(message)
      setTimeout(() => setScrapNotification(null), 5000)
    }

    setDraggedTask(null)
    fetchData()
  }

  const getProfile = (userId: string | null) => {
    if (!userId) return null
    return profiles.find((p) => p.id === userId)
  }

  const getEquipmentName = (equipmentId: string) => {
    const eq = equipment.find((e) => e.id === equipmentId)
    return eq?.name || equipmentId
  }

  const isOverdue = (task: MaintenanceRequest) => {
    if (!task.due_date) return false
    const today = new Date()
    const dueDate = new Date(task.due_date)
    return dueDate < today && task.status !== "repaired" && task.status !== "scrap"
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-8 space-y-6 h-full">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Maintenance Requests</h1>
          <p className="text-muted-foreground mt-2 text-base">Track maintenance tasks through workflow stages</p>
        </div>
        <Button
          onClick={() => setShowRequestDialog(true)}
          className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
        >
          <Plus className="w-4 h-4" />
          New Request
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or equipment name..."
          className="w-full"
        />
        <Button className="gap-2">
          <Search className="w-4 h-4" />
          Search
        </Button>
      </div>

      {scrapNotification && (
        <Card className="p-4 bg-destructive/10 border-destructive/50 animate-in slide-in-from-top">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-destructive">Equipment Marked as Scrap</p>
              <p className="text-sm text-muted-foreground mt-1">{scrapNotification}</p>
            </div>
            <button
              onClick={() => setScrapNotification(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </Card>
      )}

      {loading ? (
        <Card className="p-8 text-center border-border/50">
          <p className="text-muted-foreground">Loading maintenance requests...</p>
        </Card>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter((task) => task.status === column.id)

            return (
              <div key={column.id} className="flex-shrink-0 w-80 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-bold text-foreground text-lg">{column.title}</h3>
                  <span className="px-3 py-1 rounded-full bg-muted text-sm font-bold text-foreground">
                    {columnTasks.length}
                  </span>
                </div>

                <div
                  className="space-y-3 min-h-[600px] bg-card/30 rounded-2xl p-4 border border-border/50"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(column.id)}
                >
                  {columnTasks.map((task) => {
                    const profile = getProfile(task.assigned_to)
                    const overdue = isOverdue(task)

                    return (
                      <Card
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task.id)}
                        className={`p-4 hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 cursor-grab active:cursor-grabbing border-border/50 ${
                          overdue ? "border-l-4 border-l-destructive" : ""
                        }`}
                      >
                        <div className="space-y-3">
                          {overdue && (
                            <div className="flex items-center gap-2 px-2 py-1 -mx-2 -mt-2 mb-2 bg-destructive/10 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-destructive" />
                              <span className="text-xs font-semibold text-destructive">OVERDUE</span>
                            </div>
                          )}

                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-foreground leading-snug text-base">{task.title}</h4>
                            {overdue && <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Wrench className="w-4 h-4" />
                            <span>{task.equipmentName}</span>
                          </div>

                          <div className="text-xs text-muted-foreground font-mono">{task.equipmentId}</div>

                          <div className="flex items-center justify-between">
                            <Badge
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                task.type === "Preventive" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                              }`}
                            >
                              {task.type}
                            </Badge>

                            {profile && (
                              <div className="flex items-center gap-2">
                                <Avatar className="w-7 h-7 border-2 border-primary/20 ring-2 ring-background">
                                  <AvatarImage src={profile.avatar_url || undefined} />
                                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                                    {(profile.full_name || profile.email || "U")
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Maintenance Request</DialogTitle>
            <DialogDescription>Schedule a new maintenance task for equipment</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="equipment">Equipment *</Label>
              <Select
                value={formData.equipment_id}
                onValueChange={(val) => setFormData({ ...formData, equipment_id: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment..." />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>
                      {eq.name} ({eq.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Replace hydraulic fluid"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Request Type *</Label>
              <Select
                value={formData.request_type}
                onValueChange={(val) => setFormData({ ...formData, request_type: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                  <SelectItem value="Corrective">Corrective</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Select
                value={formData.assigned_to}
                onValueChange={(val) => setFormData({ ...formData, assigned_to: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician..." />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.full_name || profile.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled">Scheduled Date</Label>
                <Input
                  id="scheduled"
                  type="date"
                  value={formData.scheduled_date}
                  onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="due">Due Date</Label>
                <Input
                  id="due"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details about the maintenance task..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRequest} className="bg-gradient-to-r from-primary to-primary/80">
              <Save className="w-4 h-4 mr-2" />
              Create Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
