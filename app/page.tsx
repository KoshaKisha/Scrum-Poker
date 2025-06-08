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
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">Scrum Покер</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Упростите Ваш процесс оценки задач с помощью нашего приложения
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Создавайте сессии</CardTitle>
              <CardDescription>Начните новую сессию оценки за секунду</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-center justify-center">
                <CheckCircle className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Создавайте удобные комнаты
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Делитесь с помощью QR кода</CardTitle>
              <CardDescription>Приглашайте участников за пару кликов </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-center justify-center">
                <CheckCircle className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Подключиться к сессии - легко!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Голосование в реальном времени</CardTitle>
              <CardDescription>Прозрачный процесс голосования</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-20 items-center justify-center">
                <CheckCircle className="h-12 w-12 text-blue-500" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Вы можете наблюдать за оценками в реальном времени
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">
              Вход
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Регистрация</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
