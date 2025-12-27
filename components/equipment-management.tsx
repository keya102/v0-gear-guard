"use client"

import { useState } from "react"
import { Search, Plus, Wrench, X, FileText, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const sampleEquipment = [
  {
    id: "EQ-001",
    name: "CNC Machine Pro",
    department: "Manufacturing",
    location: "Building A - Floor 2",
    manufacturer: "ACME Corp",
    model: "X-2000",
    status: "Active",
    is_scrapped: false,
    openRequests: 3,
  },
  {
    id: "EQ-002",
    name: "Hydraulic Press",
    department: "Manufacturing",
    location: "Building A - Floor 1",
    manufacturer: "PowerTech",
    model: "HP-500",
    status: "Active",
    is_scrapped: false,
    openRequests: 1,
  },
  {
    id: "EQ-003",
    name: "Forklift Model X",
    department: "Warehouse",
    location: "Warehouse B - Zone 3",
    manufacturer: "LiftCo",
    model: "FL-450",
    status: "Active",
    is_scrapped: false,
    openRequests: 2,
  },
  {
    id: "EQ-004",
    name: "Conveyor System",
    department: "Logistics",
    location: "Distribution Center",
    manufacturer: "ConveyTech",
    model: "CS-1000",
    status: "Maintenance",
    is_scrapped: false,
    openRequests: 5,
  },
  {
    id: "EQ-005",
    name: "Pallet Jack",
    department: "Warehouse",
    location: "Warehouse B - Zone 1",
    manufacturer: "LiftCo",
    model: "PJ-200",
    status: "Active",
    is_scrapped: false,
    openRequests: 0,
  },
]

const sampleMaintenanceRequests = [
  { id: "REQ-001", equipmentId: "EQ-001", title: "Replace hydraulic fluid", type: "Preventive", status: "new" },
  { id: "REQ-002", equipmentId: "EQ-001", title: "Calibration required", type: "Preventive", status: "in-progress" },
  { id: "REQ-003", equipmentId: "EQ-001", title: "Clean cooling system", type: "Preventive", status: "new" },
  { id: "REQ-004", equipmentId: "EQ-002", title: "Pressure valve inspection", type: "Corrective", status: "new" },
  { id: "REQ-005", equipmentId: "EQ-003", title: "Battery replacement", type: "Preventive", status: "in-progress" },
  { id: "REQ-006", equipmentId: "EQ-003", title: "Tire inspection", type: "Preventive", status: "new" },
  {
    id: "REQ-007",
    equipmentId: "EQ-004",
    title: "Belt replacement needed",
    type: "Corrective",
    status: "in-progress",
  },
  { id: "REQ-008", equipmentId: "EQ-004", title: "Motor bearing check", type: "Preventive", status: "new" },
  { id: "REQ-009", equipmentId: "EQ-004", title: "Sensor calibration", type: "Preventive", status: "new" },
  { id: "REQ-010", equipmentId: "EQ-004", title: "Lubrication service", type: "Preventive", status: "new" },
  { id: "REQ-011", equipmentId: "EQ-004", title: "Emergency stop test", type: "Preventive", status: "new" },
]

export function EquipmentManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("All")
  const [selectedEquipment, setSelectedEquipment] = useState<(typeof sampleEquipment)[0] | null>(null)
  const [showMaintenanceList, setShowMaintenanceList] = useState(false)

  const departments = ["All", "Manufacturing", "Warehouse", "Logistics"]

  const filteredEquipment = sampleEquipment.filter((eq) => {
    const matchesDepartment = selectedDepartment === "All" || eq.department === selectedDepartment
    const matchesSearch =
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesDepartment && matchesSearch
  })

  const equipmentRequests = selectedEquipment
    ? sampleMaintenanceRequests.filter((req) => req.equipmentId === selectedEquipment.id)
    : []

  const openRequestsCount = equipmentRequests.filter(
    (req) => req.status === "new" || req.status === "in-progress",
  ).length

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Equipment Management</h1>
        <p className="text-muted-foreground mt-2 text-base">Manage and track all your equipment assets</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {departments.map((dept) => (
          <Button
            key={dept}
            variant={selectedDepartment === dept ? "default" : "outline"}
            onClick={() => setSelectedDepartment(dept)}
            className={
              selectedDepartment === dept
                ? "bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25"
                : "border-border/50 hover:bg-muted/50"
            }
          >
            {dept}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl border-border/50"
          />
        </div>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4" />
          Add Equipment
        </Button>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Equipment Name
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Department
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Location
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Manufacturer
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEquipment.map((eq) => (
                <tr
                  key={eq.id}
                  className="hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedEquipment(eq)
                    setShowMaintenanceList(false)
                  }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${eq.is_scrapped ? "bg-destructive/10" : "bg-primary/10"} flex items-center justify-center`}
                      >
                        <Wrench className={`w-5 h-5 ${eq.is_scrapped ? "text-destructive" : "text-primary"}`} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{eq.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{eq.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-foreground">{eq.department}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-foreground">{eq.location}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-foreground">{eq.manufacturer}</span>
                  </td>
                  <td className="py-4 px-6">
                    {eq.is_scrapped ? (
                      <span className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-1 w-fit">
                        <AlertTriangle className="w-3 h-3" />
                        Scrapped
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">
                        {eq.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedEquipment && (
        <div className="fixed inset-y-0 right-0 w-[500px] bg-background border-l border-border shadow-2xl z-50 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Wrench className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedEquipment.name}</h2>
                  <p className="text-muted-foreground font-mono">{selectedEquipment.id}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedEquipment(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Department</p>
                <p className="text-lg font-semibold text-foreground mt-1">{selectedEquipment.department}</p>
              </Card>

              <Card className="p-4 border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Location</p>
                <p className="text-lg font-semibold text-foreground mt-1">{selectedEquipment.location}</p>
              </Card>

              <Card className="p-4 border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Manufacturer</p>
                <p className="text-lg font-semibold text-foreground mt-1">{selectedEquipment.manufacturer}</p>
              </Card>

              <Card className="p-4 border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Model</p>
                <p className="text-lg font-semibold text-foreground mt-1">{selectedEquipment.model}</p>
              </Card>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => setShowMaintenanceList(!showMaintenanceList)}
                className="w-full justify-between bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 h-14"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span className="font-semibold">Maintenance Requests</span>
                </div>
                <span className="px-3 py-1 bg-background/20 rounded-full text-sm font-bold">{openRequestsCount}</span>
              </Button>

              {showMaintenanceList && (
                <Card className="p-4 space-y-3 border-border/50">
                  <p className="text-sm font-semibold text-muted-foreground uppercase">Related Requests</p>
                  {equipmentRequests.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No maintenance requests found</p>
                  ) : (
                    <div className="space-y-2">
                      {equipmentRequests.map((req) => (
                        <div key={req.id} className="p-3 rounded-xl bg-muted/50 space-y-1">
                          <p className="font-medium text-foreground text-sm">{req.title}</p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                req.type === "Preventive"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }`}
                            >
                              {req.type}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                req.status === "new"
                                  ? "bg-blue-500/10 text-blue-500"
                                  : req.status === "in-progress"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-green-500/10 text-green-500"
                              }`}
                            >
                              {req.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </div>

            {selectedEquipment.is_scrapped && (
              <Card className="p-4 bg-destructive/10 border-destructive/50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-destructive">Equipment Scrapped</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This equipment has been marked as scrapped and is no longer in service.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
