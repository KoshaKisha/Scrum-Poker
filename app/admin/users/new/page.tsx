import type { Metadata } from "next"
import { NewUserForm } from "@/components/admin/new-user-form"

export const metadata: Metadata = {
  title: "Add New User",
  description: "Add a new user to the system",
}

export default function NewUserPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Добавить нового пользователя</h1>
      <NewUserForm />
    </div>
  )
}
