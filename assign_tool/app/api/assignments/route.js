import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/db';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    let assignments;
    if (session.user.role === 'ADMIN' || session.user.role === 'MANAGER') {
      // Fetch all assignments for admin/manager
      assignments = await prisma.assignment.findMany({
        include: {
          technician: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
    } else {
      // Fetch only user's assignments for technician
      assignments = await prisma.assignment.findMany({
        where: {
          technician: {
            email: session.user.email
          }
        },
        include: {
          technician: {
            select: {
              name: true
            }
          }
        }
      });
    }
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  try {
    const { title, description, startTime, endTime, technicianId } = await req.json();
    
    console.log('Received data:', { title, description, startTime, endTime, technicianId });

    if (!title || !startTime || !endTime || !technicianId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        technicianId
      }
    });

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json({ error: 'Failed to create assignment', details: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
  }

  const { title, description, startTime, endTime, technicianId } = await req.json();

  try {
    const updatedAssignment = await prisma.assignment.update({
      where: { id },
      data: {
        title,
        description,
        startTime,
        endTime,
        technicianId
      }
    });

    return NextResponse.json(updatedAssignment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 400 });
  }
}

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Assignment ID is required' }, { status: 400 });
  }

  try {
    await prisma.assignment.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete assignment' }, { status: 400 });
  }
}
