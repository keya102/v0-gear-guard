"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function Settings() {
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    taskReminders: true,
    overdueNotifications: true,
    weeklyReports: false,
  })

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2 text-base">Manage your account and preferences</p>
      </div>

      <Card className="p-6 border-border/50">
        <h3 className="text-xl font-bold text-foreground mb-6">Profile Information</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" className="rounded-xl border-border/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Smith" className="rounded-xl border-border/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              defaultValue="john.smith@gearguard.com"
              className="rounded-xl border-border/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              defaultValue="Administrator"
              disabled
              className="bg-muted cursor-not-allowed rounded-xl border-border/50"
            />
            <p className="text-xs text-muted-foreground">Role is managed by system administrators</p>
          </div>
          <Button className="mt-4 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
            Save Changes
          </Button>
        </div>
      </Card>

      <Card className="p-6 border-border/50">
        <h3 className="text-xl font-bold text-foreground mb-6">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Email Alerts</p>
              <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
            </div>
            <Switch
              checked={notifications.emailAlerts}
              onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Task Reminders</p>
              <p className="text-sm text-muted-foreground">Get reminders for upcoming maintenance tasks</p>
            </div>
            <Switch
              checked={notifications.taskReminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, taskReminders: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium text-foreground">Overdue Notifications</p>
              <p className="text-sm text-muted-foreground">Alert when tasks become overdue</p>
            </div>
            <Switch
              checked={notifications.overdueNotifications}
              onCheckedChange={(checked) => setNotifications({ ...notifications, overdueNotifications: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-foreground">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly summary of maintenance activities</p>
            </div>
            <Switch
              checked={notifications.weeklyReports}
              onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
