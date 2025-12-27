"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Plus, Wrench } from "lucide-react"

const sampleMaintenanceRequests = [
  { id: "1", equipmentId: "EQ-001", equipmentName: "CNC Machine Pro", date: "2025-01-15", type: "Preventive" },
  { id: "2", equipmentId: "EQ-002", equipmentName: "Hydraulic Press", date: "2025-01-15", type: "Preventive" },
  { id: "3", equipmentId: "EQ-003", equipmentName: "Forklift Model X", date: "2025-01-18", type: "Preventive" },
  { id: "4", equipmentId: "EQ-004", equipmentName: "Conveyor System", date: "2025-01-22", type: "Preventive" },
  { id: "5", equipmentId: "EQ-001", equipmentName: "CNC Machine Pro", date: "2025-01-25", type: "Preventive" },
  { id: "6", equipmentId: "EQ-005", equipmentName: "Pallet Jack", date: "2025-01-28", type: "Preventive" },
  { id: "7", equipmentId: "EQ-002", equipmentName: "Hydraulic Press", date: "2025-01-08", type: "Corrective" },
  { id: "8", equipmentId: "EQ-004", equipmentName: "Conveyor System", date: "2025-01-10", type: "Preventive" },
  { id: "9", equipmentId: "EQ-003", equipmentName: "Forklift Model X", date: "2025-01-12", type: "Emergency" },
  { id: "10", equipmentId: "EQ-001", equipmentName: "CNC Machine Pro", date: "2025-01-05", type: "Preventive" },
  { id: "11", equipmentId: "EQ-005", equipmentName: "Pallet Jack", date: "2025-01-20", type: "Preventive" },
  { id: "12", equipmentId: "EQ-002", equipmentName: "Hydraulic Press", date: "2025-01-30", type: "Preventive" },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const [formData, setFormData] = useState({
    equipmentId: "EQ-001",
    type: "Preventive",
    description: "",
  })

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(clickedDate)
    setIsDialogOpen(true)
  }

  const getRequestsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`
    return sampleMaintenanceRequests.filter((req) => req.date === dateStr)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsDialogOpen(false)
    setFormData({ equipmentId: "EQ-001", type: "Preventive", description: "" })
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-2 text-base">Schedule and track preventive maintenance activities</p>
        </div>
      </div>

      <Card className="p-6 border-border/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button onClick={previousMonth} variant="outline" size="icon" className="rounded-xl bg-transparent">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button onClick={nextMonth} variant="outline" size="icon" className="rounded-xl bg-transparent">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold text-muted-foreground text-sm py-2">
              {day}
            </div>
          ))}

          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const requests = getRequestsForDate(day)
            const hasRequests = requests.length > 0

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className="aspect-square p-2 rounded-2xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 flex flex-col items-start justify-start relative group"
              >
                <span className="text-sm font-semibold text-foreground">{day}</span>
                {hasRequests && (
                  <div className="mt-1 space-y-1 w-full">
                    {requests.slice(0, 2).map((req) => (
                      <div
                        key={req.id}
                        className="text-xs px-2 py-1 rounded-lg bg-primary/10 text-primary truncate flex items-center gap-1"
                      >
                        <Wrench className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{req.equipmentName}</span>
                      </div>
                    ))}
                    {requests.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">+{requests.length - 2} more</div>
                    )}
                  </div>
                )}
                <Plus className="w-4 h-4 absolute bottom-2 right-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )
          })}
        </div>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card border-border/50 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Schedule Maintenance
              {selectedDate && (
                <span className="block text-sm font-normal text-muted-foreground mt-1">
                  {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentId">Equipment ID</Label>
              <Select
                value={formData.equipmentId}
                onValueChange={(value) => setFormData({ ...formData, equipmentId: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EQ-001">CNC Machine Pro (EQ-001)</SelectItem>
                  <SelectItem value="EQ-002">Hydraulic Press (EQ-002)</SelectItem>
                  <SelectItem value="EQ-003">Forklift Model X (EQ-003)</SelectItem>
                  <SelectItem value="EQ-004">Conveyor System (EQ-004)</SelectItem>
                  <SelectItem value="EQ-005">Pallet Jack (EQ-005)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Maintenance Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="rounded-xl">
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add any additional notes..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-primary to-primary/80">
                Schedule Maintenance
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
