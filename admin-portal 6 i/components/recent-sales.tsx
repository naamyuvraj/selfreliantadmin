export function RecentSales({ className }: { className?: string }) {
  return (
    <div className={`${className} bg-white p-4 rounded-lg border border-gray-200 shadow-sm`}>
      <div className="pb-2 sm:pb-4">
        <h3 className="text-base sm:text-lg font-medium">Recent Sales</h3>
        <p className="text-xs sm:text-sm text-gray-500">You made 265 sales this month</p>
      </div>
      <div>
        <div className="space-y-4 sm:space-y-8">
          <div className="flex items-center">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs">PM</span>
            </div>
            <div className="ml-3 sm:ml-4 space-y-1 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium leading-none truncate">Priya Mehta</p>
              <p className="text-xs text-gray-500 truncate">priya.mehta@gmail.com</p>
            </div>
            <div className="ml-auto font-medium text-xs sm:text-sm">+₹1,999</div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-200 flex items-center justify-center border">
              <span className="text-xs">AS</span>
            </div>
            <div className="ml-3 sm:ml-4 space-y-1 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium leading-none truncate">Arjun Singh</p>
              <p className="text-xs text-gray-500 truncate">arjun.singh@yahoo.com</p>
            </div>
            <div className="ml-auto font-medium text-xs sm:text-sm">+₹3,499</div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs">SK</span>
            </div>
            <div className="ml-3 sm:ml-4 space-y-1 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium leading-none truncate">Sneha Kapoor</p>
              <p className="text-xs text-gray-500 truncate">sneha.kapoor@hotmail.com</p>
            </div>
            <div className="ml-auto font-medium text-xs sm:text-sm">+₹2,299</div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs">RG</span>
            </div>
            <div className="ml-3 sm:ml-4 space-y-1 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium leading-none truncate">Rajesh Gupta</p>
              <p className="text-xs text-gray-500 truncate">rajesh.gupta@gmail.com</p>
            </div>
            <div className="ml-auto font-medium text-xs sm:text-sm">+₹899</div>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs">AD</span>
            </div>
            <div className="ml-3 sm:ml-4 space-y-1 flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium leading-none truncate">Anita Desai</p>
              <p className="text-xs text-gray-500 truncate">anita.desai@rediffmail.com</p>
            </div>
            <div className="ml-auto font-medium text-xs sm:text-sm">+₹1,599</div>
          </div>
        </div>
      </div>
    </div>
  )
}
