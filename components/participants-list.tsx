// "use client"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Check, HelpCircle } from "lucide-react"

// interface Participant {
//   id: string
//   name: string
//   avatar?: string
// }

// interface ParticipantsListProps {
//   participants: Participant[]
//   votes: Record<string, string>
//   isRevealed: boolean
// }

// export function ParticipantsList({ participants, votes, isRevealed }: ParticipantsListProps) {
//   return (
//     <div className="space-y-4">
//       {participants.length === 0 ? (
//         <p className="text-center text-sm text-muted-foreground">No participants yet</p>
//       ) : (
//         <ul className="space-y-3">
//           {participants.map((participant) => {
//             const hasVoted = votes[participant.id] !== undefined
//             const vote = votes[participant.id]

//             return (
//               <li key={participant.id} className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
//                     <AvatarFallback>
//                       {participant.name
//                         .split(" ")
//                         .map((n) => n[0])
//                         .join("")
//                         .toUpperCase()}
//                     </AvatarFallback>
//                   </Avatar>
//                   <span className="text-sm">{participant.name}</span>
//                 </div>
//                 {hasVoted ? (
//                   isRevealed ? (
//                     <Badge variant="outline">{vote}</Badge>
//                   ) : (
//                     <Badge variant="secondary">
//                       <Check className="mr-1 h-3 w-3" /> Voted
//                     </Badge>
//                   )
//                 ) : (
//                   <Badge variant="outline" className="text-muted-foreground">
//                     <HelpCircle className="mr-1 h-3 w-3" /> Waiting
//                   </Badge>
//                 )}
//               </li>
//             )
//           })}
//         </ul>
//       )}
//     </div>
//   )
// }
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Check, HelpCircle } from "lucide-react"

interface Participant {
  id: string
  userId: string // Add userId to match the structure from the room page
  name: string
  avatar?: string
  user?: {
    id: string
    name: string
  }
}

interface ParticipantsListProps {
  participants: Participant[]
  votes: Record<string, string>
  isRevealed: boolean
}

export function ParticipantsList({ participants, votes, isRevealed }: ParticipantsListProps) {
  return (
    <div className="space-y-4">
      {participants.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">No participants yet</p>
      ) : (
        <ul className="space-y-3">
          {participants.map((participant) => {
            // Check if the participant has voted using their userId
            const userId = participant.userId || participant.user?.id || participant.id
            const hasVoted = votes[userId] !== undefined
            const vote = votes[userId]

            return (
              <li key={participant.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                    <AvatarFallback>
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{participant.name}</span>
                </div>
                {hasVoted ? (
                  isRevealed ? (
                    <Badge variant="outline">{vote}</Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Check className="mr-1 h-3 w-3" /> Voted
                    </Badge>
                  )
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <HelpCircle className="mr-1 h-3 w-3" /> Waiting
                  </Badge>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
