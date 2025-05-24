"use client"

import { useEffect, useState } from "react"
import { RoomCard } from "@/components/room-card"
import { toast } from "@/components/ui/use-toast"
import type { Room, Participant } from "@/lib/generated/prisma"

type RoomWithParticipants = Room & { participants: Participant[] }

export default function ParticipatedRoomsPage() {
  const [rooms, setRooms] = useState<RoomWithParticipants[]>([])

  useEffect(() => {
    fetch("/api/rooms/participated")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRooms(data)
        } else {
          throw new Error(data.error)
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      })
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Rooms You've Participated In</h1>
      {rooms.length === 0 ? (
        <p className="text-muted-foreground">You haven't participated in any rooms yet.</p>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={{
                id: room.id,
                name: room.name,
                description: room.description ?? "",
                participantCount: room.participants.length,
                createdAt: room.createdAt.toString(),
                isActive: room.isActive,
              }}
              showDeleteButton={false}
            />
          ))}
        </div>
      )}
    </div>
  )
}
