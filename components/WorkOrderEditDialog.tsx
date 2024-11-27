'use client'

/**
 * @fileoverview Dialog component for editing work order details
 * @module WorkOrderEditDialog
 */

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect, FormEvent } from "react"
import { WorkOrderType, WorkOrderStatus } from "@prisma/client"
import { WorkOrderEvent, WorkOrderFormData, toWorkOrderFormData } from "@/types/workorder"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

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
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [formData, setFormData] = useState<WorkOrderFormData>(getDefaultFormData());

  // Update form data when workOrder changes
  useEffect(() => {
    if (workOrder) {
      setFormData(toWorkOrderFormData(workOrder));
    } else {
      setFormData(getDefaultFormData());
    }
  }, [workOrder]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [techResponse, supervisorResponse] = await Promise.all([
          fetch('/api/users/?role=technicians'),
          fetch('/api/users/?role=supervisors')
        ]);

        if (!techResponse.ok || !supervisorResponse.ok) {
          throw new Error('Failed to fetch users');
        }

        const [techData, supervisorData] = await Promise.all([
          techResponse.json(),
          supervisorResponse.json()
        ]);

        setTechnicians(techData);
        setSupervisors(supervisorData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/workorders/${workOrder?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) throw new Error('Failed to update work order')
      
      onSave()
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
              <Label htmlFor="pickupLocationId">Pickup Location</Label>
              <Input
                id="pickupLocationId"
                value={formData.pickupLocationId}
                onChange={(e) => setFormData(prev => ({ ...prev, pickupLocationId: e.target.value }))}
                className="col-span-3"
              />
            </div>

            <div className="input-group">
              <Label htmlFor="deliveryLocationId">Delivery Location</Label>
              <Input
                id="deliveryLocationId"
                value={formData.deliveryLocationId}
                onChange={(e) => setFormData(prev => ({ ...prev, deliveryLocationId: e.target.value }))}
                className="col-span-3"
              />
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
              <Button type="submit" className="w-full sm:w-auto">Save changes</Button>
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