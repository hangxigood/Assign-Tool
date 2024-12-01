'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface SupervisorEditDialogProps {
  workOrder: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedData: { truckNumber: string; technician: string }) => void
}

export function SupervisorEditDialog({
  workOrder,
  open,
  onOpenChange,
  onSave
}: SupervisorEditDialogProps) {
  const [formData, setFormData] = useState({
    truckNumber: workOrder?.extendedProps?.truckNumber || '',
    technician: workOrder?.extendedProps?.technician || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Resources</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="truckNumber" className="text-right">
                Truck Number
              </Label>
              <Input
                id="truckNumber"
                value={formData.truckNumber}
                onChange={(e) => setFormData({ ...formData, truckNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="technician" className="text-right">
                Technician
              </Label>
              <Input
                id="technician"
                value={formData.technician}
                onChange={(e) => setFormData({ ...formData, technician: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
