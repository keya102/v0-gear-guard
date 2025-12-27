import {
  TrendingUp,
  TrendingDown,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Users,
} from "lucide-react"
import { Card } from "@/components/ui/card"

const kpiData = [
  {
    title: "Total Requests",
    value: "324",
    trend: "+12%",
    trendUp: true,
    subtitle: "All time",
    icon: ClipboardList,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Active Requests",
    value: "42",
    trend: "+8%",
    trendUp: true,
    subtitle: "In progress",
    icon: Clock,
    iconBg: "bg-info/10",
    iconColor: "text-info",
  },
  {
    title: "Completed",
    value: "267",
    trend: "+24%",
    trendUp: true,
    subtitle: "This month",
    icon: CheckCircle2,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    title: "Overdue",
    value: "15",
    trend: "-2%",
    trendUp: false,
    subtitle: "Requires attention",
    icon: AlertTriangle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
]

const secondaryKpis = [
  {
    title: "Total Equipment",
    value: "248",
    icon: Wrench,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Maintenance Teams",
    value: "8",
    icon: Users,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
]

export function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-base">Monitor your equipment and maintenance operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon
          const TrendIcon = kpi.trendUp ? TrendingUp : TrendingDown

          return (
            <Card
              key={kpi.title}
              className="p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-border/50"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{kpi.title}</p>
                  {/* Very large & bold numbers */}
                  <p className="text-5xl font-extrabold text-foreground">{kpi.value}</p>
                  <div className="flex items-center gap-1">
                    <TrendIcon className={`w-4 h-4 ${kpi.trendUp ? "text-success" : "text-destructive"}`} />
                    <span className={`text-sm font-semibold ${kpi.trendUp ? "text-success" : "text-destructive"}`}>
                      {kpi.trend}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs last week</span>
                  </div>
                  {kpi.subtitle && <p className="text-xs text-muted-foreground">{kpi.subtitle}</p>}
                </div>
                {/* Icon in rounded colored badge */}
                <div className={`w-14 h-14 rounded-2xl ${kpi.iconBg} flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-7 h-7 ${kpi.iconColor}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondaryKpis.map((kpi) => {
          const Icon = kpi.icon

          return (
            <Card
              key={kpi.title}
              className="p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 border-border/50"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{kpi.title}</p>
                  <p className="text-5xl font-extrabold text-foreground">{kpi.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl ${kpi.iconBg} flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-7 h-7 ${kpi.iconColor}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border/50">
          <h3 className="text-xl font-bold text-foreground mb-6">Requests by Team</h3>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <p className="text-sm">No data available</p>
          </div>
        </Card>

        <Card className="p-6 border-border/50">
          <h3 className="text-xl font-bold text-foreground mb-6">Request Types</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/10">
              <span className="font-medium text-foreground">Corrective</span>
              <span className="text-2xl font-bold text-primary">156</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-success/5 border border-success/10">
              <span className="font-medium text-foreground">Preventive</span>
              <span className="text-2xl font-bold text-success">168</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
