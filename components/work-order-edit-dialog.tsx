import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/permissions";

interface User {
  id: string;
  name: string;
}

interface WorkOrderEditDialogProps {
  workOrder: {
    id: string
    type: WorkOrderType
    status: WorkOrderStatus
    fameNumber: string
    clientName: string
    clientPhone: string
    clientEmail: string
    startDate: Date
    endDate: Date
    pickupLocationId: string
    deliveryLocationId: string
    supervisorId: string
    createdById: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (workOrder: any) => void
  onDelete?: () => void
}

export function WorkOrderEditDialog({
  workOrder,
  open,
  onOpenChange,
  onSave,
  onDelete
}: WorkOrderEditDialogProps) {
  const { data: session } = useSession();
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [formData, setFormData] = useState<{
    id: string;
    type: WorkOrderType;
    status: WorkOrderStatus;
    fameNumber: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    startDate: string;
    endDate: string;
    pickupLocationId: string;
    deliveryLocationId: string;
    supervisorId: string;
    createdById: string;
  } | null>(workOrder ? {
    id: workOrder.id || '',
    type: workOrder.type || WorkOrderType.PICKUP,
    status: workOrder.status || WorkOrderStatus.PENDING,
    fameNumber: workOrder.fameNumber || '',
    clientName: workOrder.clientName || '',
    clientPhone: workOrder.clientPhone || '',
    clientEmail: workOrder.clientEmail || '',
    startDate: workOrder.startDate?.toISOString().slice(0, 16) || new Date().toISOString().slice(0, 16),
    endDate: workOrder.endDate?.toISOString().slice(0, 16) || '',
    pickupLocationId: workOrder.pickupLocationId || '',
    deliveryLocationId: workOrder.deliveryLocationId || '',
    supervisorId: workOrder.supervisorId || '',
    createdById: workOrder.createdById || ''
  } : null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [supervisorResponse] = await Promise.all([
          fetch('/api/users?role=SUPERVISOR')
        ]);
        
        if (!supervisorResponse.ok) throw new Error('Failed to fetch supervisors');
        
        const supervisorData = await supervisorResponse.json();
        
        setSupervisors(supervisorData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData || !workOrder?.id) {
      throw new Error('No work order data to update');
    }

    try {
      const response = await fetch(`/api/workorders/${workOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Enviamos los IDs como están, el servidor los manejará con connect
          pickupLocationId: formData.pickupLocationId,
          deliveryLocationId: formData.deliveryLocationId,
          supervisorId: formData.supervisorId,
        }),
      });
      
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', responseText);
        throw new Error('Invalid response from server');
      }
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to update work order');
      }
      
      // La respuesta ahora incluye los objetos completos de las relaciones
      onSave(data.data);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating work order:', error);
      throw error instanceof Error ? error : new Error('Failed to update work order');
    }
  }

  const handleDelete = async () => {
    if (!workOrder?.id || !onDelete) return;
    
    try {
      const response = await fetch(`/api/workorders/${workOrder.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete work order');
      
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting work order:', error);
    }
  };

  const canEdit = hasPermission(session?.user?.role, 'edit-work-orders');
  const canAssignTechnicians = hasPermission(session?.user?.role, 'assign-technicians');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="subheading-responsive">
            {workOrder ? 'Edit Work Order' : 'Create Work Order'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="content-spacing">
          <div className="form-grid">
            <div className="input-group">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData?.type || WorkOrderType.PICKUP}
                onValueChange={(value) => setFormData(prev => prev ? { 
                  ...prev, 
                  type: value as WorkOrderType 
                } : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(WorkOrderType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="input-group">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData?.status || WorkOrderStatus.PENDING}
                onValueChange={(value) => setFormData(prev => prev ? { 
                  ...prev, 
                  status: value as WorkOrderStatus 
                } : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(WorkOrderStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="input-group">
              <Label htmlFor="fameNumber">Fame Number</Label>
              <Input
                id="fameNumber"
                value={formData?.fameNumber || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, fameNumber: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData?.clientName || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, clientName: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                value={formData?.clientPhone || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, clientPhone: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                value={formData?.clientEmail || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, clientEmail: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="datetime-local"
                id="startDate"
                value={formData?.startDate || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="datetime-local"
                id="endDate"
                value={formData?.endDate || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="pickupLocationId">Pickup Location</Label>
              <Input
                id="pickupLocationId"
                value={formData?.pickupLocationId || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, pickupLocationId: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="deliveryLocationId">Delivery Location</Label>
              <Input
                id="deliveryLocationId"
                value={formData?.deliveryLocationId || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, deliveryLocationId: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="supervisorId">Supervisor</Label>
              <Select
                value={formData?.supervisorId || ''}
                onValueChange={(value) => setFormData(prev => prev ? { 
                  ...prev, 
                  supervisorId: value
                } : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {supervisors.map((supervisor) => (
                    <SelectItem key={supervisor.id} value={supervisor.id}>
                      {supervisor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {canAssignTechnicians && (
              <div className="input-group">
                <Label htmlFor="technicians">Assign Technicians</Label>
                {/* Technician assignment fields */}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <div className="button-group">
              {canEdit ? (
                <Button type="submit" className="w-full sm:w-auto">Save changes</Button>
              ) : (
                <p className="text-sm text-red-500">You don't have permission to edit work orders</p>
              )}
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the work order.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}