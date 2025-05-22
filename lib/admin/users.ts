"use server"

import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"
import { revalidatePath } from "next/cache"

export async function getUsers() {
  // Ensure the current user is an admin
  const currentUser = await getUserOrThrow()
  if (currentUser.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const users = await prisma.user.findMany({
    orderBy: {
      created_at: "desc",
    },
  })

  return users
}

export async function deleteUser(userId: number) {
  // Ensure the current user is an admin
  const currentUser = await getUserOrThrow()
  if (currentUser.role !== "admin") {
    throw new Error("Unauthorized")
  }

  // Don't allow admins to delete themselves
  if (currentUser.id === userId) {
    throw new Error("You cannot delete your own account")
  }

  // Soft delete the user by setting is_deleted to true
  await prisma.user.update({
    where: { id: userId },
    data: { is_deleted: true },
  })

  revalidatePath("/admin/users")
}

export async function updateUser(
  userId: number,
  data: {
    name?: string
    email: string
    role: string
    is_verified: boolean
    is_deleted: boolean
  },
) {
  // Ensure the current user is an admin
  const currentUser = await getUserOrThrow()
  if (currentUser.role !== "admin") {
    throw new Error("Unauthorized")
  }

  // Don't allow admins to remove their own admin role
  if (currentUser.id === userId && data.role !== "admin") {
    throw new Error("You cannot remove your own admin role")
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      is_verified: data.is_verified,
      is_deleted: data.is_deleted,
    },
  })

  revalidatePath("/admin/users")
}

export async function createUser(data: {
  name?: string
  email: string
  password: string
  role: string
  is_verified: boolean
}) {
  // Ensure the current user is an admin
  const currentUser = await getUserOrThrow()
  if (currentUser.role !== "admin") {
    throw new Error("Unauthorized")
  }

  // Hash the password (you should use a proper password hashing function)
  const password_hash = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password_hash,
      role: data.role,
      is_verified: data.is_verified,
    },
  })

  revalidatePath("/admin/users")
  return user
}

// This is a placeholder - use your actual password hashing function
async function hashPassword(password: string): Promise<string> {
  // In a real app, use bcrypt or similar
  return password // Replace with actual hashing
}
