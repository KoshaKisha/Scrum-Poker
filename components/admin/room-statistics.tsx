"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, ChevronDown, Download } from "lucide-react"

const roomsByType = [
  { name: "Fibonacci", value: 45 },
  { name: "T-Shirt", value: 30 },
  { name: "Standard", value: 25 },
]

const roomsByActivity = [
  { name: "Active", value: 65 },
  { name: "Inactive", value: 35 },
]

const roomsBySize = [
  { name: "Small (1-5)", value: 40 },
  { name: "Medium (6-10)", value: 35 },
  { name: "Large (11+)", value: 25 },
]

const roomCreationData = [
  { date: "Jan", count: 8 },
  { date: "Feb", count: 12 },
  { date: "Mar", count: 15 },
  { date: "Apr", count: 10 },
  { date: "May", count: 18 },
  { date: "Jun", count: 22 },
  { date: "Jul", count: 20 },
  { date: "Aug", count: 25 },
  { date: "Sep", count: 30 },
  { date: "Oct", count: 28 },
  { date: "Nov", count: 32 },
  { date: "Dec", count: 35 },
]

const sessionDurationData = [
  { duration: "0-15 min", count: 25 },
  { duration: "15-30 min", count: 40 },
  { duration: "30-45 min", count: 20 },
  { duration: "45-60 min", count: 10 },
  { duration: "60+ min", count: 5 },
]

const votingDistributionData = [
  { story: "Story 1", "1": 0, "2": 2, "3": 5, "5": 3, "8": 1, "13": 0, "21": 0, "?": 1 },
  { story: "Story 2", "1": 1, "2": 3, "3": 6, "5": 2, "8": 0, "13": 0, "21": 0, "?": 0 },
  { story: "Story 3", "1": 0, "2": 0, "3": 2, "5": 4, "8": 3, "13": 1, "21": 0, "?": 2 },
  { story: "Story 4", "1": 0, "2": 1, "3": 3, "5": 5, "8": 2, "13": 1, "21": 0, "?": 0 },
  { story: "Story 5", "1": 2, "2": 4, "3": 3, "5": 2, "8": 1, "13": 0, "21": 0, "?": 0 },
]

const weeklyActivityData = [
  { day: "Monday", sessions: 15, participants: 85 },
  { day: "Tuesday", sessions: 20, participants: 110 },
  { day: "Wednesday", sessions: 25, participants: 130 },
  { day: "Thursday", sessions: 22, participants: 120 },
  { day: "Friday", sessions: 18, participants: 95 },
  { day: "Saturday", sessions: 8, participants: 40 },
  { day: "Sunday", sessions: 5, participants: 25 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

export function RoomStatistics() {
  const [timeRange, setTimeRange] = useState("month")
  const [chartType, setChartType] = useState("bar")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-4 w-4" />
            Last 30 days
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.2</div>
            <p className="text-xs text-muted-foreground">+0.8 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Room Creation Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roomCreationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="sessions" fill="#8884d8" name="Sessions" />
                  <Bar yAxisId="right" dataKey="participants" fill="#82ca9d" name="Participants" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionDurationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="duration" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voting Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={votingDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="story" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="1" stackId="a" fill="#8884d8" />
                <Bar dataKey="2" stackId="a" fill="#82ca9d" />
                <Bar dataKey="3" stackId="a" fill="#ffc658" />
                <Bar dataKey="5" stackId="a" fill="#ff8042" />
                <Bar dataKey="8" stackId="a" fill="#0088fe" />
                <Bar dataKey="13" stackId="a" fill="#00c49f" />
                <Bar dataKey="21" stackId="a" fill="#ffbb28" />
                <Bar dataKey="?" stackId="a" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="type">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="type">Room Types</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="size">Room Size</TabsTrigger>
        </TabsList>
        <TabsContent value="type" className="pt-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {roomsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="activity" className="pt-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomsByActivity}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {roomsByActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        <TabsContent value="size" className="pt-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomsBySize}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {roomsBySize.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Room Usage Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Avg. Stories Per Room</div>
                <div className="mt-1 text-2xl font-semibold">8.3</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Avg. Votes Per Story</div>
                <div className="mt-1 text-2xl font-semibold">6.7</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Consensus Rate</div>
                <div className="mt-1 text-2xl font-semibold">72%</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm font-medium text-muted-foreground">Avg. Session Time</div>
                <div className="mt-1 text-2xl font-semibold">28 min</div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-3 text-sm font-medium">Most Active Rooms</h3>
              <div className="space-y-2">
                {[
                  { name: "Sprint Planning", sessions: 24, participants: 12 },
                  { name: "Backlog Refinement", sessions: 18, participants: 8 },
                  { name: "Feature Estimation", sessions: 15, participants: 10 },
                  { name: "Bug Prioritization", sessions: 12, participants: 6 },
                  { name: "Technical Debt", sessions: 10, participants: 7 },
                ].map((room, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border p-2">
                    <div>
                      <div className="font-medium">{room.name}</div>
                      <div className="text-xs text-muted-foreground">{room.participants} participants</div>
                    </div>
                    <div className="text-sm">{room.sessions} sessions</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
