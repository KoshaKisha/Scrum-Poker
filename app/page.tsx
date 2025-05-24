"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">Scrum Poker</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Simplify your agile estimation process with our collaborative planning poker app
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Create Sessions</CardTitle>
              <CardDescription>Start a new planning poker session in seconds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-center justify-center">
                <CheckCircle className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Create custom rooms for your team with just a few clicks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share via QR Code</CardTitle>
              <CardDescription>Invite team members with a simple scan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-center justify-center">
                <CheckCircle className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Generate QR codes that make joining sessions quick and easy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Real-time Voting</CardTitle>
              <CardDescription>See votes as they happen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-center justify-center">
                <CheckCircle className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Watch as team members submit their estimates in real-time
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">
              Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
