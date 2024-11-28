'use client';

import { useState, useEffect } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from 'next/navigation';
import { WorkOrderStatus, WorkOrderType } from '@prisma/client';

type WorkOrder = {
  id: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  fameNumber: string;
  clientName: string;
  clientContactName?: string | null;
  clientPhone?: string | null;
  startDate: string;
  startHour: string;
  endHour?: string | null;
  location: string;
  noteText?: string | null;
  createdBy: {
    firstName: string;
    lastName: string;
  };
  equipment: Array<{
    id: string;
    name: string;
    type: string;
  }>;
};

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const fetchWorkOrders = async () => {
    try {
      const response = await fetch('/api/workorders');
      if (!response.ok) throw new Error('Failed to fetch work orders');
      const data = await response.json();
      console.log('Work orders data:', data);
      setWorkOrders(data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    }
  };

  const handleCreateNew = () => {
    router.push('/workorders/new');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Work Orders</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fame Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map((order) => {
              console.log('Order data:', order);
              return (
                <TableRow 
                  key={order.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/workorders/${order.id}`)}
                >
                  <TableCell>{order.fameNumber}</TableCell>
                  <TableCell>{order.type}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>{formatDate(order.startDate)}</TableCell>
                  <TableCell>{`${order.startHour} - ${order.endHour || 'TBD'}`}</TableCell>
                  <TableCell>{order.location}</TableCell>
                  <TableCell>{`${order.createdBy?.firstName || 'N/A'} ${order.createdBy?.lastName || ''}`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
