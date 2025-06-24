import { ProductsTable } from "@/components/products-table"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-l-4 border-[#608C44] pl-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Inventory</h1>
        <p className="text-xs sm:text-sm text-gray-500">Manage your product inventory</p>
      </div>
      <ProductsTable />
    </div>
  )
}
