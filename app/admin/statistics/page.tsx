import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatisticsOverview } from "@/components/admin/statistics-overview"
import { UserActivityChart } from "@/components/admin/user-activity-chart"
import { RoomStatistics } from "@/components/admin/room-statistics"

export const metadata: Metadata = {
  title: "Statistics | Admin Dashboard",
  description: "System statistics and analytics",
}

export default function StatisticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Статистика</h1>
      <p className="text-muted-foreground">Просматривайте статистику и аналитические данные.</p>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="rooms">Комнаты</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <StatisticsOverview />
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Активность пользователей</CardTitle>
              <CardDescription>Регистрация пользователей и активность по времени</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <UserActivityChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rooms" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Статистика по комнатам</CardTitle>
              <CardDescription>Статистика использования и создания комнат</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <RoomStatistics />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
