'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  onSave,
}: SupervisorEditDialogProps) {
  const [truckNumber, setTruckNumber] = useState(workOrder?.extendedProps?.truckNumber || '')
  const [technician, setTechnician] = useState(workOrder?.extendedProps?.technician || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setTruckNumber(workOrder?.extendedProps?.truckNumber || '')
      setTechnician(workOrder?.extendedProps?.technician || '')
    }
  }, [open, workOrder])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isSubmitting) return

    try {
      setIsSubmitting(true)
      await onSave({
        truckNumber,
        technician,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const truckNumbers = ['94', '107']
  const technicians = ['Andres Parra']

  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onClick={handleDialogClick}>
        <DialogHeader>
          <DialogTitle>Assign Resources</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} onClick={handleDialogClick}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="truckNumber" className="text-right">
                Truck Number
              </Label>
              <div className="col-span-3" onClick={handleDialogClick}>
                <Select
                  value={truckNumber}
                  onValueChange={setTruckNumber}
                >
                  <SelectTrigger onClick={handleDialogClick}>
                    <SelectValue placeholder="Select truck number" />
                  </SelectTrigger>
                  <SelectContent onClick={handleDialogClick}>
                    {truckNumbers.map((number) => (
                      <SelectItem 
                        key={number} 
                        value={number}
                        onClick={handleDialogClick}
                      >
                        {number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="technician" className="text-right">
                Technician
              </Label>
              <div className="col-span-3" onClick={handleDialogClick}>
                <Select
                  value={technician}
                  onValueChange={setTechnician}
                >
                  <SelectTrigger onClick={handleDialogClick}>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent onClick={handleDialogClick}>
                    {technicians.map((tech) => (
                      <SelectItem 
                        key={tech} 
                        value={tech}
                        onClick={handleDialogClick}
                      >
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={handleDialogClick}
              disabled={isSubmitting || !truckNumber || !technician}
            >
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
