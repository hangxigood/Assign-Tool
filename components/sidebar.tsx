"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, LogOut, Truck, PenTool, Box } from 'lucide-react'
import { useSession, signOut } from "next-auth/react"
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"

interface WorkOrder {
  id: string
  title: string
  fameNumber: string
  type: WorkOrderType
  status: WorkOrderStatus
  startDate: string
  endDate: string
  clientName: string
  assignedTo: {
    firstName: string
    lastName: string
  }
  supervisor: {
    firstName: string
    lastName: string
  }
}

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

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

function WorkOrderItem({ workOrder, onSelect }: { 
  workOrder: WorkOrder, 
  onSelect: (event: any) => void 
}) {
  const handleClick = () => {
    const event = {
      id: workOrder.id,
      title: `${workOrder.fameNumber} - ${workOrder.clientName}`,
      start: new Date(workOrder.startDate),
      end: new Date(workOrder.endDate),
      type: workOrder.type,
      status: workOrder.status,
      clientName: workOrder.clientName,
      extendedProps: {
        type: workOrder.type,
        status: workOrder.status,
        clientName: workOrder.clientName,
        assignedTo: `${workOrder.assignedTo.firstName} ${workOrder.assignedTo.lastName}`,
        supervisor: workOrder.supervisor ? `${workOrder.supervisor.firstName} ${workOrder.supervisor.lastName}` : ''
      }
    };
    onSelect(event);
  };

  return (
    <div 
      className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        {getWorkOrderIcon(workOrder.type)}
        <span className="text-sm">
          {formatDateTime(workOrder.startDate)}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium">{workOrder.title}</p>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-xs text-gray-400">{workOrder.clientName}</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          workOrder.status === "COMPLETED" ? "bg-green-500/20 text-green-300" :
          workOrder.status === "IN_PROGRESS" ? "bg-blue-500/20 text-blue-300" :
          workOrder.status === "CANCELLED" ? "bg-red-500/20 text-red-300" :
          "bg-gray-500/20 text-gray-300"
        }`}>
          {workOrder.status}
        </span>
      </div>
    </div>
  );
}

export function Sidebar({ onEventSelect }: { onEventSelect: (event: any) => void }) {
  const { data: session } = useSession()
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const response = await fetch('/api/workorders')
        const data = await response.json()
        
        // Filter work orders if user is a technician
        const filteredOrders = session?.user?.role === "TECHNICIAN"
          ? data.filter((order: WorkOrder) => 
              order.assignedTo?.firstName === session.user.firstName && 
              order.assignedTo?.lastName === session.user.lastName)
          : data

        // Sort by start date
        const sortedOrders = filteredOrders.sort((a: WorkOrder, b: WorkOrder) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        )

        setWorkOrders(sortedOrders)
      } catch (error) {
        console.error('Error fetching work orders:', error)
      }
    }

    fetchWorkOrders()
  }, [session])

  return (
    <div className="w-64 border-r bg-gray-800 text-white">
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
          <h3 className="text-sm font-semibold text-gray-400">ACTIVITY FEED</h3>
          <ScrollArea className="h-[calc(100vh-150px)] mt-2">
            <div className="space-y-4">
              {workOrders.map((workOrder) => (
                <WorkOrderItem key={workOrder.id} workOrder={workOrder} onSelect={onEventSelect} />
              ))}
              {workOrders.length === 0 && (
                <div className="text-sm text-gray-400 text-center py-4">
                  No work orders found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
