import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users } from "lucide-react"

interface Room {
  id: string
  name: string
  description?: string
  participantCount: number
  createdAt: string
  isActive: boolean
}

interface RoomCardProps {
  room: Room
}

export function RoomCard({ room }: RoomCardProps) {
  const formattedDate = new Date(room.createdAt).toLocaleDateString()

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{room.name}</CardTitle>
          {room.isActive ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              Active
            </Badge>
          ) : (
            <Badge variant="outline">Inactive</Badge>
          )}
        </div>
        <CardDescription>{room.description || "No description"}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          <span>{room.participantCount} participants</span>
          <span className="mx-2">•</span>
          <span>Created {formattedDate}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/rooms/${room.id}`}>
            Join Room
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
