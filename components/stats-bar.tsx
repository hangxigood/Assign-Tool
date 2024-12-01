"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface Stats {
  totalTrucks: number
  assignedTrucks: number
  totalTechnicians: number
  activeWorkOrders: number
  todayHours: number
  monthHours: number
}

export function StatsBar() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const isTechnician = session?.user?.role === 'TECHNICIAN'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (isTechnician) {
    return null
  }

  const statsConfig = [
    { 
      id: 'trucks', 
      title: 'ASSIGNED TRUCKS', 
      value: stats ? `${stats.assignedTrucks}/${stats.totalTrucks}` : '0/0' 
    },
    { 
      id: 'technicians', 
      title: 'ACTIVE WORK ORDERS', 
      value: stats?.activeWorkOrders?.toString() ?? '0' 
    },
    { 
      id: 'today', 
      title: 'HOURS WORKED TODAY', 
      value: stats?.todayHours?.toString() ?? '0' 
    },
    { 
      id: 'month', 
      title: 'HOURS WORKED THIS MONTH', 
      value: stats?.monthHours?.toString() ?? '0' 
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 border-t bg-gray-800 p-4 text-white">
      {statsConfig.map((stat) => (
        <div key={stat.id} className="flex items-center justify-between rounded-lg bg-gray-700 p-4">
          <div>
            <h3 className="text-responsive font-medium">{stat.title}</h3>
            <p className="text-xl sm:text-2xl font-bold">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                stat.value
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}