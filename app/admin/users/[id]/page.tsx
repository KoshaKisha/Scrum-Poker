import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { UserForm } from "@/components/admin/user-form"

interface UserPageProps {
  params: {
    id: string
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const userId = parseInt(params.id)
  
  if (isNaN(userId)) {
    notFound()
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  
  if (!user) {
    notFound()
  }
  
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
      <UserForm user={user} />
    </div>
  )
}
