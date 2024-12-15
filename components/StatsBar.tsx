"use client"

import { useEffect, useState } from "react"

interface Stats {
  trucks: {
    total: number;
    assigned: number;
    available: number;
  };
  technicians: {
    total: number;
    assigned: number;
    available: number;
  };
  hoursWorked: number;
}

/**
 * Stats bar component that displays current statistics
 * @param props.trigger - Optional value that triggers a stats refresh when changed
 */
export function StatsBar({ trigger }: { trigger?: number }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
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
  }, [trigger]) // Add trigger to dependencies

  const statsConfig = [
    { 
      id: 'trucks', 
      title: 'ASSIGNED TRUCKS', 
      value: stats ? `${stats.trucks.assigned}/${stats.trucks.total}` : '0/0'
    },
    { 
      id: 'technicians', 
      title: 'ASSIGNED TECHNICIANS', 
      value: stats ? `${stats.technicians.assigned}/${stats.technicians.total}` : '0/0'
    },
    { 
      id: 'hours', 
      title: 'HOURS WORKED TODAY', 
      value: stats ? stats.hoursWorked.toString() : '0'
    }
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