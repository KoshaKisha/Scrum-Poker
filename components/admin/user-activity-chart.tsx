"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Calendar, ChevronDown } from 'lucide-react'

const mockDailyData = [
  { date: "2023-05-01", active: 120, new: 15 },
  { date: "2023-05-02", active: 132, new: 12 },
  { date: "2023-05-03", active: 125, new: 8 },
  { date: "2023-05-04", active: 130, new: 10 },
  { date: "2023-05-05", active: 145, new: 18 },
  { date: "2023-05-06", active: 150, new: 14 },
  { date: "2023-05-07", active: 160, new: 20 },
  { date: "2023-05-08", active: 165, new: 15 },
  { date: "2023-05-09", active: 170, new: 10 },
  { date: "2023-05-10", active: 175, new: 12 },
  { date: "2023-05-11", active: 180, new: 15 },
  { date: "2023-05-12", active: 185, new: 8 },
  { date: "2023-05-13", active: 190, new: 10 },
  { date: "2023-05-14", active: 195, new: 12 },
]

const mockHourlyData = [
  { hour: "00:00", active: 20, new: 2 },
  { hour: "02:00", active: 15, new: 1 },
  { hour: "04:00", active: 10, new: 0 },
  { hour: "06:00", active: 15, new: 2 },
  { hour: "08:00", active: 45, new: 5 },
  { hour: "10:00", active: 80, new: 8 },
  { hour: "12:00", active: 90, new: 6 },
  { hour: "14:00", active: 85, new: 4 },
  { hour: "16:00", active: 70, new: 3 },
  { hour: "18:00", active: 65, new: 5 },
  { hour: "20:00", active: 50, new: 7 },
  { hour: "22:00", active: 30, new: 3 },
]

export function UserActivityChart() {
  const [chartType, setChartType] = useState("area")
  const [timeRange, setTimeRange] = useState("daily")

  const data = timeRange === "daily" ? mockDailyData : mockHourlyData
  const dataKey = timeRange === "daily" ? "date" : "hour"

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Calendar className="h-4 w-4" />
            Last 14 days
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select chart" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="area">Area Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={data}>
              <XAxis dataKey={dataKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="active" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Area type="monotone" dataKey="new" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <XAxis dataKey={dataKey} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="active" fill="#8884d8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="new" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">Active Users</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold">195</span>
            <span className="text-sm text-green-500">+12%</span>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="text-sm font-medium text-muted-foreground">New Users</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-semibold">12</span>
            <span className="text-sm text-green-500">+5%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
