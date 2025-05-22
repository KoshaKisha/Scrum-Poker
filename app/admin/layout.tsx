import { redirect } from "next/navigation"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Check if user is admin
  try {
    const user = await getUserOrThrow()
    
    if (user.role !== "admin") {
      redirect("/")
    }
    
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">{children}</div>
      </div>
    )
  } catch (error) {
    redirect("/login?redirect=/admin")
  }
}