import { ArrowUpRight, ArrowDownRight, IndianRupee, Users, ShoppingBag, Package } from "lucide-react"

export function DashboardCards() {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-xs sm:text-sm font-medium">Total Revenue</h3>
          <IndianRupee className="h-4 w-4 text-[#C87355] flex-shrink-0" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold">₹4,52,318</div>
          <p className="text-xs text-gray-500">
            <span className="text-[#608C44] flex items-center">
              +20.1% <ArrowUpRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </span>
            from last month
          </p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-xs sm:text-sm font-medium">New Customers</h3>
          <Users className="h-4 w-4 text-[#C87355] flex-shrink-0" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold">+2,350</div>
          <p className="text-xs text-gray-500">
            <span className="text-[#608C44] flex items-center">
              +18.2% <ArrowUpRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </span>
            from last month
          </p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-xs sm:text-sm font-medium">Total Orders</h3>
          <ShoppingBag className="h-4 w-4 text-[#608C44] flex-shrink-0" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold">+12,234</div>
          <p className="text-xs text-gray-500">
            <span className="text-[#608C44] flex items-center">
              +12.2% <ArrowUpRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </span>
            from last month
          </p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-xs sm:text-sm font-medium">Inventory Status</h3>
          <Package className="h-4 w-4 text-[#C87355] flex-shrink-0" />
        </div>
        <div>
          <div className="text-xl sm:text-2xl font-bold">82 items</div>
          <p className="text-xs text-gray-500">
            <span className="text-red-500 flex items-center">
              -4.5% <ArrowDownRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
            </span>
            low stock items
          </p>
        </div>
      </div>
    </div>
  )
}
