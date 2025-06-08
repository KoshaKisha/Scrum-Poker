"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserRooms, createRoom } from "@/lib/rooms"
import { RoomCard } from "@/components/room-card"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import type { Room, Participant} from "@/lib/generated/prisma"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, ArrowRight, ShieldCheck, Settings, LogOut, User } from "lucide-react"
import { logout } from "@/lib/auth"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [rooms, setRooms] = useState<(Room & { participants: Participant[] })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [newRoomName, setNewRoomName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const { refreshUser } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      loadRooms()
    }
  }, [authLoading, user])

  const loadRooms = async () => {
    try {
      setIsLoading(true)
      const userRooms = await getUserRooms()
      setRooms(userRooms)
    } catch (error) {
      toast({
        title: "Error loading rooms",
        description: "There was a problem loading your rooms.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
      loadRooms()
    }, [])

  const handleRoomDeleted = () => {
    // Reload the rooms list after deletion
    loadRooms()
  }

    const handleLogout = async () => {
    try {
      await logout()
      await refreshUser()
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "There was a problem logging out.",
        variant: "destructive",
      })
    }
  }

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoomName.trim()) return

    setIsCreating(true)
    try {
      const newRoom = await createRoom({ name: newRoomName })
      setRooms((prev) => [...prev, newRoom])
      setNewRoomName("")
      toast({
        title: "Room created",
        description: "Your new planning poker room has been created.",
      })
    } catch (error) {
      toast({
        title: "Error creating room",
        description: "There was a problem creating your room.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }
  // console.log("📦 Dashboard: user =", user, "authLoading =", authLoading)
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Загрузка...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Вы должны быть авторизованы :)</h1>
        <Button asChild>
          <Link href="/login">На страницу авторизации</Link>
        </Button>
      </div>
    )
  }

  return (
        <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Добро пожаловать, {user.name}</h1>
            <p className="text-muted-foreground">Управляйте своими сессиями</p>
          </div>
          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Button asChild variant="outline" className="gap-2">
                <Link href="/admin">
                  <ShieldCheck className="h-4 w-4" />
                  Панель администратора
                </Link>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Настройки
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Выйти
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Создать новую комнату</CardTitle>
            <CardDescription>Начните новую сессию</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateRoom}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-name">Название комнаты</Label>
                  <Input
                    id="room-name"
                    placeholder="Введите название..."
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isCreating}>
                <Plus className="mr-2 h-4 w-4" />
                {isCreating ? "Создаем..." : "Создать комнату"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ваши комнаты</CardTitle>
            <CardDescription>Подключитесь или управляйте существующими комнатами</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Загружаем ваши комнаты...</p>
            ) : rooms.length === 0 ? (
              <p className="text-center text-muted-foreground">У вас пока нет комнат.</p>
            ) : (
              <div className="space-y-4">
                {rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={{
                      id: room.id,
                      name: room.name,
                      description: room.description ?? "",
                      participantCount: room.participants?.length ?? 0,
                      createdAt: room.createdAt.toString(),
                      isActive: room.isActive,
                    }}
                    onDelete={handleRoomDeleted}
                  />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/rooms">
                Просмотреть все комнаты
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


