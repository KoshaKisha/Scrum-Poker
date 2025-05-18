"use client"

import Link from "next/link"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { getRoom, joinRoom, submitVote, revealVotes, resetVotes } from "@/lib/rooms"
import { QRCodeShare } from "@/components/qr-code-share"
import { VotingCards } from "@/components/voting-cards"
import { ParticipantsList } from "@/components/participants-list"
import { VotingResults } from "@/components/voting-results"
import { useAuth } from "@/hooks/use-auth"
import { Eye, RefreshCw, Users } from "lucide-react"
import type { Room, Participant, Vote, User } from "@/lib/generated/prisma"

export default function RoomPage() {
  const { id } = useParams()
  const { user, isLoading: authLoading } = useAuth()
  const [room, setRoom] = useState<(Room & {
  participants: (Participant & { user: User })[]
  votes: Vote[]
}) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [isRevealed, setIsRevealed] = useState(false)
  const [participants, setParticipants] = useState([])
  const [votes, setVotes] = useState({})

  useEffect(() => {
    if (!authLoading && user && id) {
      loadRoom()
      joinRoomSession()

      // Set up polling for updates
      const interval = setInterval(loadRoom, 3000)
      return () => clearInterval(interval)
    }
  }, [authLoading, user, id])

  const loadRoom = async () => {
  try {
    const roomData = await getRoom(id as string)

    const safeParticipants = roomData.participants.map((p: any, index: number) => ({
      ...p,
      name: typeof p.name === "string" && p.name.trim() !== "" ? p.name : `Guest ${index + 1}`,
    }))

    setRoom(roomData)
    setParticipants(safeParticipants)
    setVotes(roomData.votes)
    setIsRevealed(roomData.isRevealed)
  } catch (error) {
    toast({
      title: "Error loading room",
      description: "There was a problem loading the room data.",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}

  const joinRoomSession = async () => {
    try {
      await joinRoom(id as string)
    } catch (error) {
      toast({
        title: "Error joining room",
        description: "There was a problem joining the room.",
        variant: "destructive",
      })
    }
  }

  const handleVote = async (value: string) => {
    setSelectedCard(value)
    setIsVoting(true)

    try {
      await submitVote(id as string, value)
      toast({
        title: "Vote submitted",
        description: "Your vote has been recorded.",
      })
    } catch (error) {
      toast({
        title: "Error submitting vote",
        description: "There was a problem submitting your vote.",
        variant: "destructive",
      })
    } finally {
      setIsVoting(false)
    }
  }

  const handleReveal = async () => {
    try {
      await revealVotes(id as string)
      setIsRevealed(true)
    } catch (error) {
      toast({
        title: "Error revealing votes",
        description: "There was a problem revealing the votes.",
        variant: "destructive",
      })
    }
  }

  const handleReset = async () => {
    try {
      await resetVotes(id as string)
      setIsRevealed(false)
      setSelectedCard(null)
    } catch (error) {
      toast({
        title: "Error resetting votes",
        description: "There was a problem resetting the votes.",
        variant: "destructive",
      })
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">You need to be logged in to join this room</h1>
        <Button asChild>
          <Link href={`/login?redirect=/rooms/${id}`}>Go to Login</Link>
        </Button>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Room not found</h1>
        <p>The room you're looking for doesn't exist or you don't have access to it.</p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{room.name}</h1>
          {room.description && <p className="text-muted-foreground">{room.description}</p>}
        </div>
        <QRCodeShare roomId={id as string} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Voting</CardTitle>
            <CardDescription>Select a card to cast your vote</CardDescription>
          </CardHeader>
          <CardContent>
            <VotingCards
              votingSystem={room.votingSystem}
              selectedCard={selectedCard}
              onSelect={handleVote}
              disabled={isVoting || isRevealed}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleReveal} disabled={isRevealed}>
              <Eye className="mr-2 h-4 w-4" />
              Reveal Votes
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Participants</CardTitle>
              <CardDescription>
                <Users className="mr-2 inline-block h-4 w-4" />
                {participants.length} joined
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParticipantsList participants={participants} votes={votes} isRevealed={isRevealed} />
            </CardContent>
          </Card>

          {isRevealed && (
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
                <CardDescription>Voting summary</CardDescription>
              </CardHeader>
              <CardContent>
                <VotingResults votes={votes} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
