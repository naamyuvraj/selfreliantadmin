export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500">Overview of your store performance and insights</p>
      </div>
      <div className="flex items-center gap-2">
        <select
          className="w-full sm:w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm"
          defaultValue="30days"
        >
          <option value="7days">Last 7 days</option>
          <option value="30days">Last 30 days</option>
          <option value="90days">Last 90 days</option>
          <option value="year">Last year</option>
        </select>
      </div>
    </div>
  )
}
