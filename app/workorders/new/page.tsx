'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkOrderType, WorkOrderStatus, User } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewWorkOrder() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/api/auth/signin');
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    type: '',
    fameNumber: '',
    clientName: '',
    clientContactName: '',
    clientPhone: '',
    startDate: '',
    startHour: '',
    endHour: '',
    location: '',
    noteText: '',
    documentUrl: '',
    assignedToId: '',
    supervisorId: '',
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/api/auth/signin');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar que los campos requeridos estén presentes
      if (!formData.type || !formData.fameNumber || !formData.clientName || 
          !formData.clientContactName || !formData.clientPhone || !formData.startDate || 
          !formData.startHour || !formData.location || !formData.assignedToId || 
          !formData.supervisorId) {
        throw new Error('Please fill in all required fields');
      }

      // Formatear la fecha
      const startDate = new Date(formData.startDate);
      if (isNaN(startDate.getTime())) {
        throw new Error('Invalid date format');
      }

      // Validar el formato de las horas (HH:mm)
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.startHour)) {
        throw new Error('Invalid start hour format');
      }
      if (formData.endHour && !timeRegex.test(formData.endHour)) {
        throw new Error('Invalid end hour format');
      }

      const workOrderData = {
        type: formData.type,
        fameNumber: formData.fameNumber,
        clientName: formData.clientName,
        clientContactName: formData.clientContactName,
        clientPhone: formData.clientPhone,
        startDate: startDate.toISOString(),
        startHour: formData.startHour,
        endHour: formData.endHour || null,
        location: formData.location,
        noteText: formData.noteText || null,
        documentUrl: formData.documentUrl || null,
        assignedToId: formData.assignedToId,
        supervisorId: formData.supervisorId,
      };

      const response = await fetch('/api/workorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workOrderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create work order');
      }

      router.push('/workorders');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleSelectChange(value, 'type')}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PICKUP">Pickup</SelectItem>
              <SelectItem value="DELIVERY">Delivery</SelectItem>
              <SelectItem value="TEARDOWN">Teardown</SelectItem>
              <SelectItem value="SETUP">Setup</SelectItem>
              <SelectItem value="ACTIVATION">Activation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fameNumber">FAME Number</Label>
          <Input
            id="fameNumber"
            name="fameNumber"
            value={formData.fameNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="clientName">Client</Label>
          <Input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="clientContactName">Client Contact Name</Label>
          <Input
            id="clientContactName"
            name="clientContactName"
            value={formData.clientContactName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="clientPhone">Client Contact Phone</Label>
          <Input
            id="clientPhone"
            name="clientPhone"
            value={formData.clientPhone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="startDate">Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleInputChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startHour">Start Hour</Label>
            <Input
              id="startHour"
              name="startHour"
              type="time"
              value={formData.startHour}
              onChange={handleInputChange}
              required
              pattern="[0-9]{2}:[0-9]{2}"
            />
          </div>

          <div>
            <Label htmlFor="endHour">End Hour</Label>
            <Input
              id="endHour"
              name="endHour"
              type="time"
              value={formData.endHour}
              onChange={handleInputChange}
              pattern="[0-9]{2}:[0-9]{2}"
              min={formData.startHour}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="assignedToId">Assigned To</Label>
          <Select
            value={formData.assignedToId}
            onValueChange={(value) => handleSelectChange(value, 'assignedToId')}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="supervisorId">Supervisor</Label>
          <Select
            value={formData.supervisorId}
            onValueChange={(value) => handleSelectChange(value, 'supervisorId')}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select supervisor" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="documentUrl">Documents</Label>
          <Input
            id="documentUrl"
            name="documentUrl"
            type="url"
            value={formData.documentUrl}
            onChange={handleInputChange}
            placeholder="Enter document URL"
          />
        </div>

        <div>
          <Label htmlFor="noteText">Notes</Label>
          <Textarea
            id="noteText"
            name="noteText"
            value={formData.noteText}
            onChange={handleInputChange}
            className="h-32"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Work Order'}
      </Button>
    </form>
  );
}
