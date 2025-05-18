"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VotingCardsProps {
  votingSystem: string
  selectedCard: string | null
  onSelect: (value: string) => void
  disabled?: boolean
}

export function VotingCards({ votingSystem, selectedCard, onSelect, disabled = false }: VotingCardsProps) {
  const getCards = () => {
    switch (votingSystem) {
      case "fibonacci":
        return ["0", "1", "2", "3", "5", "8", "13", "21", "34", "?"]
      case "tshirt":
        return ["XS", "S", "M", "L", "XL", "XXL", "?"]
      case "standard":
      default:
        return ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "?"]
    }
  }

  const cards = getCards()

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {cards.map((card) => (
        <Button
          key={card}
          variant="outline"
          className={cn(
            "h-24 text-2xl font-bold",
            selectedCard === card && "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200",
          )}
          onClick={() => onSelect(card)}
          disabled={disabled}
        >
          {card}
        </Button>
      ))}
    </div>
  )
}
