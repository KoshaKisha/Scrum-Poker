"use server"

import { prisma } from "@/lib/prisma"
import { getUserOrThrow } from "@/lib/server/auth/auth-server"

export async function getDashboardStats() {
  // Ensure the current user is an admin
  const currentUser = await getUserOrThrow()
  if (currentUser.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const totalUsers = await prisma.user.count()
  const verifiedUsers = await prisma.user.count({
    where: { is_verified: true },
  })
  const deletedUsers = await prisma.user.count({
    where: { is_deleted: true },
  })
  const adminUsers = await prisma.user.count({
    where: { role: "admin" },
  })

  return {
    totalUsers,
    verifiedUsers,
    deletedUsers,
    adminUsers,
  }
}

export async function getUserRegistrationData() {
  // Ensure the current user is an admin
  const currentUser = await getUserOrThrow()
  if (currentUser.role !== "admin") {
    throw new Error("Unauthorized")
  }

  // Get the date 30 days ago
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Get all users created in the last 30 days
  const users = await prisma.user.findMany({
    where: {
      created_at: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      created_at: true,
    },
    orderBy: {
      created_at: "asc",
    },
  })

  // Group users by date
  const usersByDate = users.reduce(
    (acc, user) => {
      const date = user.created_at.toISOString().split("T")[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Create an array of the last 30 days
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  }).reverse()

  // Map the data to the format expected by the chart
  return last30Days.map((date) => ({
    date,
    count: usersByDate[date] || 0,
  }))
}

export async function getRecentUsers(limit = 5) {
  // Ensure the current user is an admin
  const currentUser = await getUserOrThrow()
  if (currentUser.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const users = await prisma.user.findMany({
    take: limit,
    orderBy: {
      created_at: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      created_at: true,
      role: true,
      is_verified: true,
      is_deleted: true,
    },
  })

  return users
}
