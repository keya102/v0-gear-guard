"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, Users, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Team {
  id: string
  name: string
  department: string
  description: string | null
  is_active: boolean
  lead_id: string | null
  created_at: string
}

interface Profile {
  id: string
  full_name: string | null
  email: string | null
}

const sampleTeams = [
  {
    id: "TEAM-001",
    name: "Team Alpha",
    department: "Manufacturing",
    description: "Primary manufacturing maintenance crew",
    memberCount: 5,
    lead: "John Smith",
  },
  {
    id: "TEAM-002",
    name: "Team Beta",
    department: "Warehouse",
    description: "Warehouse equipment specialists",
    memberCount: 4,
    lead: "Sarah Johnson",
  },
  {
    id: "TEAM-003",
    name: "Team Gamma",
    department: "Logistics",
    description: "Distribution and logistics maintenance",
    memberCount: 3,
    lead: "Mike Davis",
  },
  {
    id: "TEAM-004",
    name: "Team Delta",
    department: "Manufacturing",
    description: "Advanced machinery specialists",
    memberCount: 6,
    lead: "Emily Chen",
  },
]

export function TeamsView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [teams, setTeams] = useState(sampleTeams)
  const [showTeamDialog, setShowTeamDialog] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [profiles, setProfiles] = useState([])

  const [formData, setFormData] = useState({
    name: "",
    department: "Manufacturing",
    description: "",
    lead_id: "",
  })

  const supabase = createClient()

  const handleAddTeam = () => {
    const newTeam = {
      id: `TEAM-${Math.floor(Math.random() * 1000)}`,
      name: formData.name,
      department: formData.department,
      description: formData.description || null,
      memberCount: 0,
      lead: "Unassigned",
    }
    setTeams([...teams, newTeam])
    setShowTeamDialog(false)
    resetForm()
  }

  const handleUpdateTeam = () => {
    if (!selectedTeam) return

    const updatedTeams = teams.map((team) =>
      team.id === selectedTeam.id
        ? {
            ...team,
            name: formData.name,
            department: formData.department,
            description: formData.description || null,
            lead_id: formData.lead_id || null,
            lead: "Unassigned", // Placeholder for actual lead name
          }
        : team,
    )
    setTeams(updatedTeams)
    setShowTeamDialog(false)
    resetForm()
    setSelectedTeam(null)
  }

  const handleDeleteTeam = (id) => {
    if (!confirm("Are you sure you want to delete this team?")) return

    const updatedTeams = teams.filter((team) => team.id !== id)
    setTeams(updatedTeams)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      department: "Manufacturing",
      description: "",
      lead_id: "",
    })
    setIsEditMode(false)
    setSelectedTeam(null)
  }

  const openAddDialog = () => {
    resetForm()
    setShowTeamDialog(true)
  }

  const openEditDialog = (team) => {
    setFormData({
      name: team.name,
      department: team.department,
      description: team.description || "",
      lead_id: team.lead_id || "",
    })
    setSelectedTeam(team)
    setIsEditMode(true)
    setShowTeamDialog(true)
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Teams</h1>
          <p className="text-muted-foreground mt-2 text-base">Manage maintenance teams and departments</p>
        </div>
        <Button
          onClick={openAddDialog}
          className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
        >
          <Plus className="w-4 h-4" />
          New Team
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          className="pl-10 rounded-xl border-border/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card
            key={team.id}
            className="p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-border/50"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <span className="px-3 py-1 rounded-full bg-muted text-xs font-semibold">
                  {team.memberCount} members
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">{team.name}</h3>
                <p className="text-sm text-muted-foreground">{team.department}</p>
              </div>

              <p className="text-sm text-muted-foreground">{team.description}</p>

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">Team Lead</p>
                <p className="text-sm font-semibold text-foreground">{team.lead}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Team" : "Create New Team"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update team information" : "Enter details for new maintenance team"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name *</Label>
              <Input
                id="teamName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Team Alpha"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamDept">Department *</Label>
              <Select
                value={formData.department}
                onValueChange={(val) => setFormData({ ...formData, department: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Facilities">Facilities</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamLead">Team Lead</Label>
              <Select value={formData.lead_id} onValueChange={(val) => setFormData({ ...formData, lead_id: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select team lead..." />
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

            <div className="space-y-2">
              <Label htmlFor="teamDesc">Description</Label>
              <Textarea
                id="teamDesc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Team responsibilities and focus areas..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowTeamDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={isEditMode ? handleUpdateTeam : handleAddTeam}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditMode ? "Update" : "Create"} Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
