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
  clientPhone: string;
  startDate: Date;
  endDate: Date | null;
  assignedTo: { firstName: string; lastName: string };
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
      setWorkOrders(data);
    } catch (error) {
      console.error('Error fetching work orders:', error);
    }
  };

  const handleCreateNew = () => {
    router.push('/workorders/new');
  };

  const handleEdit = (id: string) => {
    router.push(`/workorders/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work order?')) return;
    
    try {
      const response = await fetch(`/api/workorders/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete work order');
      fetchWorkOrders();
    } catch (error) {
      console.error('Error deleting work order:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Work Orders</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fame Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.fameNumber}</TableCell>
              <TableCell>{order.type}</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.clientName}</TableCell>
              <TableCell>{new Date(order.startDate).toLocaleDateString()}</TableCell>
              <TableCell>{`${order.assignedTo.firstName} ${order.assignedTo.lastName}`}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleEdit(order.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(order.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
