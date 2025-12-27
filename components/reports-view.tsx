"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download } from "lucide-react"

export function ReportsView() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground mt-2 text-base">Generate and export maintenance analytics</p>
      </div>

      <Card className="p-8 border-border/50">
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Select Report</label>
            <Select defaultValue="maintenance-summary">
              <SelectTrigger className="w-full rounded-xl border-border/50">
                <SelectValue placeholder="Choose report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maintenance-summary">Maintenance Summary</SelectItem>
                <SelectItem value="equipment-usage">Equipment Usage</SelectItem>
                <SelectItem value="team-performance">Team Performance</SelectItem>
                <SelectItem value="cost-analysis">Cost Analysis</SelectItem>
                <SelectItem value="downtime-report">Downtime Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="p-12 bg-muted/30 border-border/50">
            <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Ready to Generate</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Select a report type above and click the button below to generate your report
                </p>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25">
                  <FileText className="w-4 h-4" />
                  Generate Report
                </Button>
                <Button variant="outline" className="gap-2 rounded-xl border-border/50 bg-transparent">
                  <Download className="w-4 h-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </Card>

          <div className="pt-4">
            <h4 className="text-sm font-semibold text-foreground mb-3">Recent Reports</h4>
            <div className="space-y-2">
              {[
                { name: "Maintenance Summary - Q4 2024", date: "Dec 15, 2024", size: "2.4 MB" },
                { name: "Equipment Usage Report", date: "Dec 10, 2024", size: "1.8 MB" },
                { name: "Team Performance Analysis", date: "Dec 5, 2024", size: "3.1 MB" },
              ].map((report, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-muted/50 transition-colors border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{report.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.date} • {report.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
