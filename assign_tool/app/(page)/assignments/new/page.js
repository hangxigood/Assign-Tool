'use client'

import React from 'react';
import { useSession } from 'next-auth/react';
import AssignmentForm from '@/components/AssignmentForm';

export default function NewAssignment() {
  const { data: session } = useSession();

  if (!session || (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN')) {
    return <p>Access denied. Only admins can create assignments.</p>;
  }

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Failed to create assignment: ${errorData.error}`);
      }

      // Handle successful creation (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error creating assignment:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create New Assignment</h1>
      <AssignmentForm onSubmit={handleSubmit} />
    </div>
  );
}
