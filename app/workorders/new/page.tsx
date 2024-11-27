'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkOrderType, User } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewWorkOrder() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    type: '',
    fameNumber: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    startDate: '',
    endDate: '',
    assignedToId: '',
    supervisorId: '',
    createdById: '', 
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user?.id) {
      alert('You must be logged in to create a work order');
      setLoading(false);
      return;
    }

    const workOrderData = {
      ...formData,
      createdById: session.user.id,
      status: 'PENDING' as const,
    };

    try {
      const response = await fetch('/api/workorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workOrderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create work order');
      }

      router.push('/workorders');
      router.refresh();
    } catch (error) {
      console.error('Error creating work order:', error);
      alert('Failed to create work order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container section-padding">
      <div className="form-container">
        <h1 className="heading-responsive mb-6">Create New Work Order</h1>
        
        <form onSubmit={handleSubmit} className="content-spacing">
          <div className="form-grid">
            <div className="input-group">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(value) => handleChange('type', value)}
                required
              >
                <SelectTrigger>
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
              <Label htmlFor="fameNumber">Fame Number</Label>
              <Input
                id="fameNumber"
                value={formData.fameNumber}
                onChange={(e) => handleChange('fameNumber', e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleChange('clientName', e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => handleChange('clientPhone', e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleChange('clientEmail', e.target.value)}
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                required
              />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                type="datetime-local"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                min={formData.startDate}
              />
            </div>

            <div className="input-group">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select
                onValueChange={(value) => handleChange('assignedToId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter(user => user.role === 'TECHNICIAN')
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {`${user.firstName} ${user.lastName}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="input-group">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Select
                onValueChange={(value) => handleChange('supervisorId', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter(user => user.role === 'SUPERVISOR')
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {`${user.firstName} ${user.lastName}`}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="button-group">
            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full sm:w-auto"
            >
              {loading ? 'Creating...' : 'Create Work Order'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
