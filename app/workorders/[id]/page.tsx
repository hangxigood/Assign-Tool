'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkOrderType, WorkOrderStatus } from '@prisma/client';
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

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditWorkOrder({ params }: PageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [workOrder, setWorkOrder] = useState<any>(null);
  const [formData, setFormData] = useState({
    type: '',
    status: '',
    fameNumber: '',
    clientName: '',
    clientContactName: '',
    clientPhone: '',
    startDate: '',
    startHour: '',
    endHour: '',
    location: '',
    noteText: '',
  });

  useEffect(() => {
    const fetchWorkOrder = async () => {
      try {
        const response = await fetch(`/api/workorders/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch work order');
        const data = await response.json();
        
        setWorkOrder(data);
        setFormData({
          type: data.type || '',
          status: data.status || '',
          fameNumber: data.fameNumber || '',
          clientName: data.clientName || '',
          clientContactName: data.clientContactName || '',
          clientPhone: data.clientPhone || '',
          startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
          startHour: data.startHour || '',
          endHour: data.endHour || '',
          location: data.location || '',
          noteText: data.noteText || '',
        });
      } catch (error) {
        console.error('Error fetching work order:', error);
      }
    };

    fetchWorkOrder();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user?.email) {
      alert('You must be logged in to edit a work order');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/workorders/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update work order');
      }

      router.push('/workorders');
      router.refresh();
    } catch (error) {
      console.error('Error updating work order:', error);
      alert('Failed to update work order. Please try again.');
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
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Work Order</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
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

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
              required
            >
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label htmlFor="fameNumber">Fame Number</Label>
            <Input
              id="fameNumber"
              value={formData.fameNumber}
              onChange={(e) => handleChange('fameNumber', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientContactName">Contact Name</Label>
            <Input
              id="clientContactName"
              value={formData.clientContactName}
              onChange={(e) => handleChange('clientContactName', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone">Contact Phone</Label>
            <Input
              id="clientPhone"
              type="tel"
              value={formData.clientPhone}
              onChange={(e) => handleChange('clientPhone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startHour">Start Hour</Label>
            <Input
              id="startHour"
              type="time"
              value={formData.startHour}
              onChange={(e) => handleChange('startHour', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endHour">End Hour</Label>
            <Input
              id="endHour"
              type="time"
              value={formData.endHour}
              onChange={(e) => handleChange('endHour', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="noteText">Notes</Label>
            <Input
              id="noteText"
              value={formData.noteText}
              onChange={(e) => handleChange('noteText', e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/workorders')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
