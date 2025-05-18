"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ArrowRight } from "lucide-react"
import { getUserRooms, createRoom } from "@/lib/rooms"
import { RoomCard } from "@/components/room-card"
import { toast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import type { Room, Participant, User } from "@/lib/generated/prisma"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [rooms, setRooms] = useState<(Room & { participants: Participant[] })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newRoomName, setNewRoomName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    if (!authLoading && user) {
      loadRooms()
    }
  }, [authLoading, user])

  const loadRooms = async () => {
    try {
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
  console.log("📦 Dashboard: user =", user, "authLoading =", authLoading)
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">You need to be logged in</h1>
        <Button asChild>
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <p className="text-muted-foreground">Manage your Scrum Poker sessions</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Create New Room</CardTitle>
            <CardDescription>Start a new planning poker session</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateRoom}>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-name">Room Name</Label>
                  <Input
                    id="room-name"
                    placeholder="Sprint Planning"
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
                {isCreating ? "Creating..." : "Create Room"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Rooms</CardTitle>
            <CardDescription>Join or manage your existing rooms</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground">Loading your rooms...</p>
            ) : rooms.length === 0 ? (
              <p className="text-center text-muted-foreground">You haven't created any rooms yet.</p>
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
                  />
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/rooms">
                View All Rooms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
