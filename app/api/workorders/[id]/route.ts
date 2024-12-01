import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { parseISO, addDays, formatISO } from 'date-fns';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        cancelledBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        supervisor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        notes: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!workOrder) {
      return NextResponse.json({ error: 'Work order not found' }, { status: 404 });
    }

    // Ensure we have a proper Date object and adjust for timezone
    const startDate = parseISO(workOrder.startDate);
    
    // Add one day to compensate for timezone difference
    const adjustedDate = addDays(startDate, 1);

    // Format the response to match the expected structure
    const formattedWorkOrder = {
      id: workOrder.id,
      title: `${workOrder.type} - ${workOrder.fameNumber} - ${workOrder.clientName}`,
      start: formatISO(adjustedDate),
      end: formatISO(adjustedDate),
      type: workOrder.type,
      status: workOrder.status,
      clientName: workOrder.clientName || 'N/A',
      fameNumber: workOrder.fameNumber || 'N/A',
      extendedProps: {
        type: workOrder.type,
        status: workOrder.status,
        clientName: workOrder.clientName || 'N/A',
        fameNumber: workOrder.fameNumber || 'N/A',
        createdBy: workOrder.createdBy 
          ? `${workOrder.createdBy.firstName} ${workOrder.createdBy.lastName}`
          : 'System',
        supervisor: workOrder.supervisor 
          ? `${workOrder.supervisor.firstName} ${workOrder.supervisor.lastName}` 
          : 'N/A',
        startHour: workOrder.startHour || 'N/A',
        endHour: workOrder.endHour || 'N/A',
        location: workOrder.location || 'N/A',
        truckNumber: workOrder.truckNumber || 'N/A',
        technician: workOrder.technician || 'N/A',
        documents: workOrder.documents || [],
        notes: workOrder.notes || [],
        rawDate: formatISO(adjustedDate),
      }
    };

    return NextResponse.json(formattedWorkOrder);
  } catch (error) {
    console.error('Error fetching work order:', error);
    return NextResponse.json({ error: 'Failed to fetch work order' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = context.params;
    const data = await request.json();

    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: {
        type: data.type,
        status: data.status,
        fameNumber: data.fameNumber,
        clientName: data.clientName,
        clientContactName: data.clientContactName,
        clientPhone: data.clientPhone,
        startDate: parseISO(data.startDate), 
        startHour: data.startHour,
        endHour: data.endHour,
        location: data.location,
        noteText: data.noteText,
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        supervisor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(workOrder);
  } catch (error) {
    console.error('Error updating work order:', error);
    return NextResponse.json({ error: 'Failed to update work order' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar si el usuario es un supervisor
    if (session.user.role !== 'SUPERVISOR') {
      console.log('User role:', session.user.role);
      return NextResponse.json(
        { error: 'Only supervisors can update work orders' },
        { status: 403 }
      );
    }

    const { id } = params;
    const data = await request.json();
    const { truckNumber, technician } = data;

    const updatedWorkOrder = await prisma.workOrder.update({
      where: { id },
      data: {
        truckNumber,
        technician,
        supervisorId: session.user.id,
        updatedAt: new Date(),
      },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        supervisor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        documents: {
          select: {
            id: true,
            name: true,
            url: true,
          },
        },
        notes: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return NextResponse.json(updatedWorkOrder);
  } catch (error) {
    console.error('Error updating work order:', error);
    return NextResponse.json({ error: 'Failed to update work order' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { id } = context.params;
    await prisma.workOrder.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Work order deleted successfully' });
  } catch (error) {
    console.error('Error deleting work order:', error);
    return NextResponse.json({ error: 'Failed to delete work order' }, { status: 500 });
  }
}
