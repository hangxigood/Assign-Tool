/**
 * @fileoverview Hook for fetching and managing dashboard statistics
 * Handles loading states, error handling, and data fetching
 */

import { useState, useEffect } from 'react'
import { Stats } from '@/types/stats'

/**
 * Hook to fetch and manage dashboard statistics
 * 
 * @returns An object containing:
 * - stats: Current statistics data or null if not loaded
 * - isLoading: Boolean indicating if fetch is in progress
 * - error: Error object if fetch failed, null otherwise
 * - refetch: Function to manually trigger a refresh of statistics
 * 
 * @example
 * ```tsx
 * const { stats, isLoading, error, refetch } = useStats();
 * 
 * if (isLoading) return <Loading />;
 * if (error) return <Error message={error.message} />;
 * 
 * return <StatsDisplay data={stats} />;
 * ```
 */
export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      setError(error instanceof Error ? error : new Error('Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return { stats, isLoading, error, refetch: fetchStats }
}
