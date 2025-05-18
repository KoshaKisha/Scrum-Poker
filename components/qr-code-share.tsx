"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { QrCode, Copy, Share2 } from "lucide-react"

interface QRCodeShareProps {
  roomId: string
}

export function QRCodeShare({ roomId }: QRCodeShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const roomUrl = typeof window !== "undefined" ? `${window.location.origin}/rooms/${roomId}` : ""

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomUrl)
    toast({
      title: "Link copied",
      description: "Room link has been copied to clipboard",
    })
  }

  const shareRoom = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Scrum Poker room",
          text: "Click the link to join my planning poker session",
          url: roomUrl,
        })
      } catch (error) {
        if (error.name !== "AbortError") {
          toast({
            title: "Error sharing",
            description: "There was a problem sharing the room link",
            variant: "destructive",
          })
        }
      }
    } else {
      copyToClipboard()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <QrCode className="mr-2 h-4 w-4" />
          Share Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Room</DialogTitle>
          <DialogDescription>
            Share this QR code or link to invite others to your planning poker session
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="rounded-lg border bg-white p-3">
            <QRCodeSVG value={roomUrl} size={200} />
          </div>
          <div className="flex w-full items-center space-x-2">
            <Input value={roomUrl} readOnly />
            <Button size="icon" variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={shareRoom}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
