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
    assignedToId: string
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
    assignedToId: string;
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
    assignedToId: workOrder.assignedToId || '',
    supervisorId: workOrder.supervisorId || '',
    createdById: workOrder.createdById || ''
  } : null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [techResponse, supervisorResponse] = await Promise.all([
          fetch('/api/users?role=TECHNICIAN'),
          fetch('/api/users?role=SUPERVISOR')
        ]);
        
        if (!techResponse.ok) throw new Error('Failed to fetch technicians');
        if (!supervisorResponse.ok) throw new Error('Failed to fetch supervisors');
        
        const techData = await techResponse.json();
        const supervisorData = await supervisorResponse.json();
        
        setTechnicians(techData);
        setSupervisors(supervisorData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/workorders/${workOrder?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) throw new Error('Failed to update work order')
      
      const updatedWorkOrder = await response.json()
      onSave(updatedWorkOrder)
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating work order:', error)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Work Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
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

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fameNumber" className="text-right">
                Fame Number
              </Label>
              <Input
                id="fameNumber"
                value={formData?.fameNumber || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, fameNumber: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName" className="text-right">
                Client Name
              </Label>
              <Input
                id="clientName"
                value={formData?.clientName || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, clientName: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientPhone" className="text-right">
                Client Phone
              </Label>
              <Input
                id="clientPhone"
                value={formData?.clientPhone || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, clientPhone: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientEmail" className="text-right">
                Client Email
              </Label>
              <Input
                id="clientEmail"
                value={formData?.clientEmail || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, clientEmail: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                type="datetime-local"
                id="startDate"
                value={formData?.startDate || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                type="datetime-local"
                id="endDate"
                value={formData?.endDate || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, endDate: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pickupLocationId" className="text-right">
                Pickup Location
              </Label>
              <Input
                id="pickupLocationId"
                value={formData?.pickupLocationId || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, pickupLocationId: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deliveryLocationId" className="text-right">
                Delivery Location
              </Label>
              <Input
                id="deliveryLocationId"
                value={formData?.deliveryLocationId || ''}
                onChange={(e) => setFormData(prev => prev ? { ...prev, deliveryLocationId: e.target.value } : null)}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignedToId" className="text-right">
                Assigned To
              </Label>
              <Select
                value={formData?.assignedToId || ''}
                onValueChange={(value) => setFormData(prev => prev ? { 
                  ...prev, 
                  assignedToId: value
                } : null)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supervisorId" className="text-right">
                Supervisor
              </Label>
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
          </div>
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button type="submit">Save changes</Button>
              {onDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
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