import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardCards } from "@/components/dashboard-cards"
import { RecentSales } from "@/components/recent-sales"
import { SalesChart } from "@/components/sales-chart"

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <DashboardHeader />
      <DashboardCards />
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-7">
        <SalesChart className="lg:col-span-4" />
        <RecentSales className="lg:col-span-3" />
      </div>
    </div>
  )
}
