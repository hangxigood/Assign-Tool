"use client"

/**
 * @fileoverview Main sidebar component for work order navigation and management
 * @module Sidebar
 */

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, LogOut, Truck, PenTool, Box, Plus } from 'lucide-react'
import { useSession, signOut } from "next-auth/react"
import { WorkOrderType } from "@prisma/client"
import { WorkOrderEvent, formatDateTime } from "@/types/workorder"
import { WorkOrderEditDialog } from "./WorkOrderEditDialog"

/**
 * Get the appropriate icon component for a work order type
 * @param {WorkOrderType} type - The type of work order
 * @returns {JSX.Element} Icon component
 */
function getWorkOrderIcon(type: WorkOrderType) {
  switch (type) {
    case "PICKUP":
    case "DELIVERY":
      return <Truck className="h-4 w-4" />
    case "SETUP":
    case "TEARDOWN":
      return <PenTool className="h-4 w-4" />
    case "ACTIVATION":
      return <Box className="h-4 w-4" />
    default:
      return <Calendar className="h-4 w-4" />
  }
}

/**
 * Individual work order item component
 * @component
 * @param {Object} props - Component props
 * @param {WorkOrderEvent} props.workOrder - The work order to display
 * @param {function} props.onSelect - Callback when the work order is selected
 * @param {boolean} props.isSelected - Whether the work order is currently selected
 */
function WorkOrderItem({ 
  workOrder, 
  onSelect,
  isSelected 
}: { 
  workOrder: WorkOrderEvent, 
  onSelect: (event: WorkOrderEvent) => void,
  isSelected: boolean
}) {
  return (
    <div
      onClick={() => onSelect(workOrder)}
      className={`
        p-3 rounded-lg cursor-pointer
        ${isSelected 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'hover:bg-gray-800'
        }
      `}
    >
      <div className="flex items-center gap-2">
        <span className="p-2 rounded-lg bg-gray-700">
          {getWorkOrderIcon(workOrder.extendedProps.type)}
        </span>
        <span className="text-xs text-gray-400">
          {formatDateTime(workOrder.start)}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium">{workOrder.title}</p>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-gray-400">{workOrder.extendedProps.clientName}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          workOrder.extendedProps.status === "COMPLETED" ? "bg-green-500/20 text-green-300" :
          workOrder.extendedProps.status === "IN_PROGRESS" ? "bg-blue-500/20 text-blue-300" :
          workOrder.extendedProps.status === "CANCELLED" ? "bg-red-500/20 text-red-300" :
          "bg-gray-500/20 text-gray-300"
        }`}>
          {workOrder.extendedProps.status}
        </span>
      </div>
    </div>
  );
}

/**
 * Props for the Sidebar component
 */
interface SidebarProps {
  /** Callback function when an event is selected */
  onEventSelect: (event: WorkOrderEvent) => void
  /** Whether the sidebar is open */
  isOpen: boolean
  /** Callback function to close the sidebar */
  onClose: () => void
  /** Currently selected work order event */
  selectedEvent: WorkOrderEvent | null
  /** Work order events to display */
  workOrders: WorkOrderEvent[]
  /** Loading state */
  isLoading?: boolean
}

/**
 * Main sidebar component for work order navigation
 * @component
 * @param {SidebarProps} props - Component props
 */
export function Sidebar({ onEventSelect, isOpen, onClose, selectedEvent, workOrders, isLoading }: SidebarProps) {
  const { data: session } = useSession()
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Filter and sort work orders
  const filteredAndSortedOrders = useMemo(() => {
    // Filter work orders if user is a technician
    const filteredOrders = session?.user?.role === "TECHNICIAN"
      ? workOrders.filter(order => 
          order.extendedProps.assignedToId === session.user.id)
      : workOrders

    // Sort by start date
    return filteredOrders.sort((a, b) => 
      a.start.getTime() - b.start.getTime()
    )
  }, [workOrders, session])

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Hello, {session?.user?.firstName || 'User'}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-700"
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-400">ACTIVITY FEED</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />

                </Button>
              </div>
              <div className="space-y-4 mt-2">
                {filteredAndSortedOrders.map((workOrder) => (
                  <WorkOrderItem 
                    key={workOrder.id} 
                    workOrder={workOrder} 
                    onSelect={onEventSelect}
                    isSelected={workOrder.id === selectedEvent?.id}
                  />
                ))}
                {filteredAndSortedOrders.length === 0 && (
                  <div className="text-sm text-gray-400 text-center py-4">
                    No work orders found
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      <WorkOrderEditDialog
        workOrder={null}
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={() => {
          setShowAddDialog(false)
          // Refresh the work orders list
          window.location.reload()
        }}
      />
    </>
  )
}
