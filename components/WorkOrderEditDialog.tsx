'use client'

/**
 * @fileoverview Dialog component for editing work order details
 * @module WorkOrderEditDialog
 */
import { usePermission } from "@/hooks/usePermission";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect, FormEvent } from "react"
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"
import { WorkOrderEvent, WorkOrderFormData, toWorkOrderFormData } from "@/types/workorder"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"

/**
 * Props for the User interface
 */
interface User {
  /** Unique identifier for the user */
  id: string;
  /** Full name of the user */
  name: string;
}

/**
 * Props for the WorkOrderEditDialog component
 */
interface WorkOrderEditDialogProps {
  /** The work order to edit */
  workOrder: WorkOrderEvent | null
  /** Whether the dialog is open */
  open: boolean
  /** Callback function when dialog open state changes */
  onOpenChange: (open: boolean) => void
  /** Callback function when work order is saved */
  onSave: () => void
  /** Optional callback function when work order is deleted */
  onDelete?: () => void
}

interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

/**
 * Dialog component for editing work order details
 * @component
 * @param {WorkOrderEditDialogProps} props - Component props
 */
export function WorkOrderEditDialog({
  workOrder,
  open,
  onOpenChange,
  onSave,
  onDelete
}: WorkOrderEditDialogProps) {
  const canEdit = usePermission("edit-work-orders");
  const canCreate = usePermission("create-work-orders");

  const [technicians, setTechnicians] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState<WorkOrderFormData>(getDefaultFormData());

  // Update form data when workOrder changes
  useEffect(() => {
    if (workOrder) {
      const newFormData = toWorkOrderFormData(workOrder);
      setFormData(newFormData);
    } else {
      setFormData(getDefaultFormData());
    }
  }, [workOrder]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [techResponse, supervisorResponse, locationsResponse] = await Promise.all([
          fetch('/api/users/?role=technicians'),
          fetch('/api/users/?role=supervisors'),
          fetch('/api/locations')
        ]);

        if (!techResponse.ok || !supervisorResponse.ok || !locationsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [techData, supervisorData, locationsData] = await Promise.all([
          techResponse.json(),
          supervisorResponse.json(),
          locationsResponse.json()
        ]);

        setTechnicians(techData);
        setSupervisors(supervisorData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      const url = workOrder?.id ? `/api/workorders/${workOrder.id}` : '/api/workorders'
      const method = workOrder?.id ? 'PUT' : 'POST'
      const action = workOrder?.id ? 'updated' : 'created'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error(`Failed to ${action} work order`)
      
      await response.json()
      toast({
        title: "Success",
        description: `Work order ${action} successfully`,
      })
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error(`Error ${workOrder?.id ? 'updating' : 'creating'} work order:`, error)
      toast({
        title: "Error",
        description: `Failed to ${workOrder?.id ? 'update' : 'create'} work order`,
        variant: "destructive",
      })
    }
  }

  const handleDelete = async () => {
    if (!workOrder?.id || !onDelete) return;
    
    try {
      const response = await fetch(`/api/workorders/${workOrder.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete work order');
      
      toast({
        title: "Success",
        description: "Work order deleted successfully",
      })
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting work order:', error);
      toast({
        title: "Error",
        description: "Failed to delete work order",
        variant: "destructive",
      })
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="subheading-responsive">
            {workOrder ? (canEdit ? 'Edit Work Order' : 'View Work Order') : (canCreate ? 'Create Work Order' : 'Unauthorized')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="content-spacing">
          <div className="form-grid">
            <div className="input-group">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as WorkOrderType }))}
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
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as WorkOrderStatus }))}
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
                value={formData.fameNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, fameNumber: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                value={formData.clientEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="datetime-local"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="datetime-local"
                id="endDate"
                value={formData.endDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="pickupLocation">Pickup Location</Label>
              <Select
                value={formData.pickupLocationId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, pickupLocationId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select pickup location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name} - {location.address}, {location.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="input-group">
              <Label htmlFor="deliveryLocation">Delivery Location</Label>
              <Select
                value={formData.deliveryLocationId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryLocationId: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select delivery location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name} - {location.address}, {location.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="input-group">
              <Label htmlFor="assignedToId">Assigned To</Label>
              <Select
                value={formData.assignedToId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, assignedToId: value }))}
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

            <div className="input-group">
              <Label htmlFor="supervisorId">Supervisor</Label>
              <Select
                value={formData.supervisorId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, supervisorId: value }))}
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
          
          <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
            <div className="button-group">
              {(workOrder ? canEdit : canCreate) && (
                <Button type="submit" className="w-full sm:w-auto">Save changes</Button>
              )}
              {onDelete && canEdit && (
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

/**
 * Returns the default form data for a new work order
 * @returns {WorkOrderFormData} Default form data
 */
function getDefaultFormData(): WorkOrderFormData {
  return {
    id: '',
    title: '',
    fameNumber: '',
    type: WorkOrderType.PICKUP,
    status: WorkOrderStatus.PENDING,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: null,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    pickupLocationId: '',
    deliveryLocationId: '',
    assignedToId: '',
    supervisorId: ''
  }
}