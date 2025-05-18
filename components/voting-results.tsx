"use client"
import { Progress } from "@/components/ui/progress"

interface VotingResultsProps {
  votes: Record<string, string>
}

export function VotingResults({ votes }: VotingResultsProps) {
  const voteValues = Object.values(votes)

  if (voteValues.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">No votes yet</p>
  }

  // Count occurrences of each vote
  const voteCounts = voteValues.reduce(
    (acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Sort by vote value (try to sort numerically if possible)
  const sortedVotes = Object.entries(voteCounts).sort((a, b) => {
    const aNum = Number.parseFloat(a[0])
    const bNum = Number.parseFloat(b[0])

    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum
    }

    return a[0].localeCompare(b[0])
  })

  const totalVotes = voteValues.length

  return (
    <div className="space-y-4">
      {sortedVotes.map(([vote, count]) => {
        const percentage = Math.round((count / totalVotes) * 100)

        return (
          <div key={vote} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium">{vote}</span>
              <span className="text-sm text-muted-foreground">
                {count} vote{count !== 1 ? "s" : ""} ({percentage}%)
              </span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
        )
      })}
    </div>
  )
}
