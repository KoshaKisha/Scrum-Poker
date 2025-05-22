import { Metadata } from "next"
import { UsersTable } from "@/components/admin/users-table"

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage users in the admin panel",
}

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      <UsersTable />
    </div>
  )
}
