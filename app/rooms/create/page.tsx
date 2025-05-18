"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { createRoom } from "@/lib/rooms"
import { useAuth } from "@/hooks/use-auth"

export default function CreateRoomPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    votingSystem: "fibonacci",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, votingSystem: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const room = await createRoom(formData)
      toast({
        title: "Room created",
        description: "Your planning poker room has been created successfully.",
      })
      router.push(`/rooms/${room.id}`)
    } catch (error) {
      toast({
        title: "Error creating room",
        description: "There was a problem creating your room. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Room</CardTitle>
            <CardDescription>Set up your planning poker session</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Room Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Sprint Planning"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Describe the purpose of this session"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="votingSystem">Voting System</Label>
                <Select value={formData.votingSystem} onValueChange={handleSelectChange}>
                  <SelectTrigger id="votingSystem">
                    <SelectValue placeholder="Select a voting system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fibonacci">Fibonacci (1, 2, 3, 5, 8, 13, 21)</SelectItem>
                    <SelectItem value="tshirt">T-Shirt Sizes (XS, S, M, L, XL)</SelectItem>
                    <SelectItem value="standard">Standard (0-10)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Room"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
