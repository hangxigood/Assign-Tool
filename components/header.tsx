"use client"

import { Button, ButtonProps } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function Header() {
  return (
    <header className="border-b bg-white dark:bg-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Today
          </Button>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-xl font-semibold">November 2024</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            <Button variant="secondary" size="sm">
              Day
            </Button>
            <Button variant="ghost" size="sm">
              Week
            </Button>
            <Button variant="ghost" size="sm">
              Month
            </Button>
            <Button variant="ghost" size="sm">
              Year
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8"
              placeholder="Search..."
              type="search"
            />
          </div>
          <Button variant="default">Add new task</Button>
        </div>
      </div>
    </header>
  )
}

