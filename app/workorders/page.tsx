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
import { WorkOrder } from '@/types/workorder';

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
    <div className="container section-padding">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="heading-responsive">Work Orders</h1>
        <Button 
          onClick={handleCreateNew}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>

      <div className="content-spacing">
        <div className="table-container">
          <Table className="responsive-table">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">Fame Number</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="hidden lg:table-cell">Start Date</TableHead>
                <TableHead className="hidden md:table-cell">Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="whitespace-nowrap">{order.fameNumber}</TableCell>
                  <TableCell className="hidden sm:table-cell">{order.type}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.status}</TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {new Date(order.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {`${order.assignedTo.firstName} ${order.assignedTo.lastName}`}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
