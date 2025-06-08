import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Trash2 } from "lucide-react"
import { deleteRoom } from "@/lib/rooms"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

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
  onDelete?: () => void
  showDeleteButton?: boolean
}

export function RoomCard({ room, onDelete, showDeleteButton = true }: RoomCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const handleDelete = async () => {
      setIsDeleting(true)
      try {
        await deleteRoom(room.id)
        toast({
          title: "Room deleted",
          description: "The room has been successfully deleted.",
        })

        if (onDelete) {
          onDelete()
        } else {
          router.refresh()
        }
      } catch (error: any) {
        toast({
          title: "Error deleting room",
          description: error.message || "There was a problem deleting the room. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  const formattedDate = new Date(room.createdAt).toLocaleDateString()

  return (

<Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{room.name}</CardTitle>
          {room.isActive ? (
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              Активна
            </Badge>
          ) : (
            <Badge variant="outline">Неактивна</Badge>
          )}
        </div>
        <CardDescription>{room.description || "Без описания"}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-1 h-4 w-4" />
          <span>{room.participantCount} участников</span>
          {room.createdAt && (
            <>
              <span className="mx-2">•</span>
              <span>Создана {new Date(room.createdAt).toLocaleDateString()}</span>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button asChild className="w-full">
          <Link href={`/rooms/${room.id}`}>
            Присоединиться к комнате
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        {showDeleteButton && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Удалить
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Вы уверены, что хотите удалить эту комнату?</AlertDialogTitle>
                <AlertDialogDescription>
                  Это действие нельзя отменить.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отменить</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Удаляем..." : "Удалить"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardFooter>
    </Card>
  )
}
