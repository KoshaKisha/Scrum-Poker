"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { Users, RefreshCw, MoreHorizontal, Edit, Trash, Eye } from "lucide-react"
import { getRecentUsers } from "@/lib/admin/dashboard"
import { deleteUser } from "@/lib/admin/users"

interface User {
  id: number
  email: string
  name: string | null
  created_at: string
  role: string
  is_verified: boolean
  is_deleted: boolean
}

export function RecentUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
  try {
    setIsLoading(true)
    const data = await getRecentUsers(5)
    const normalized = data.map((user) => ({
      ...user,
      created_at: user.created_at.toString(),
    }))
    setUsers(normalized)
  } catch (error) {
    console.error("Failed to load recent users:", error)
    toast({
      title: "Error loading users",
      description: "Failed to load recent users. Please try again.",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}

const refreshUsers = async () => {
  try {
    setIsRefreshing(true)
    const data = await getRecentUsers(5)
    const normalized = data.map((user) => ({
      ...user,
      created_at: user.created_at.toString(),
    }))
    setUsers(normalized)
    toast({
      title: "Refreshed",
      description: "User list has been refreshed",
    })
  } catch (error) {
    toast({
      title: "Error refreshing",
      description: "Failed to refresh users. Please try again.",
      variant: "destructive",
    })
  } finally {
    setIsRefreshing(false)
  }
}

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId)
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, is_deleted: true } : user)))
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error deleting user",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Recent Users</h3>
          <Button variant="ghost" size="sm" disabled>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-4 space-y-1">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent Users</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshUsers}
          disabled={isRefreshing}
          className="h-8 w-8 p-0"
          aria-label="Refresh users"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <Users className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No users yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">When users register, they will appear here.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/admin/users/new">Add your first user</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="divide-y rounded-md border">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : user.email.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">{user.name || "Unnamed User"}</p>
                      {user.role === "admin" && (
                        <Badge variant="default" className="ml-2">
                          Admin
                        </Badge>
                      )}
                      {user.is_deleted && (
                        <Badge variant="destructive" className="ml-2">
                          Deleted
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <p>{user.email}</p>
                      <span className="mx-1">•</span>
                      <p>{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/users">View all users</Link>
          </Button>
        </>
      )}
    </div>
  )
}
