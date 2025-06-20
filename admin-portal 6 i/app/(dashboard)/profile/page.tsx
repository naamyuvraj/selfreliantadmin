import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 border-l-4 border-[#608C44] pl-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">Profile</h1>
        <p className="text-xs sm:text-sm text-gray-500">Manage your account settings</p>
      </div>
      <ProfileForm />
    </div>
  )
}
