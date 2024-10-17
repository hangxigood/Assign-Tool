import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import AssignmentForm from '@/components/AssignmentForm';

export default function EditAssignment() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    if (id) {
      fetchAssignment();
    }
  }, [id]);

  const fetchAssignment = async () => {
    try {
      const response = await fetch(`/api/assignments/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch assignment');
      }
      const data = await response.json();
      setAssignment(data);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      // Handle error (e.g., show an error message)
    }
  };

  if (!session || session.user.role !== 'MANAGER') {
    return <p>Access denied. Only managers can edit assignments.</p>;
  }

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update assignment');
      }

      // Handle successful update (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error updating assignment:', error);
      // Handle error (e.g., show an error message)
    }
  };

  if (!assignment) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Edit Assignment</h1>
      <AssignmentForm assignment={assignment} onSubmit={handleSubmit} />
    </div>
  );
}