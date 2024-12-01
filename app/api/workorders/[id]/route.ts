import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        cancelledBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        equipment: true,
      },
    });

    if (!workOrder) {
      return NextResponse.json(
        { error: 'Work order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(workOrder);
  } catch (error) {
    console.error('Error fetching work order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work order' },
      { status: 500 }
    );
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
        startDate: new Date(data.startDate),
        startHour: data.startHour,
        endHour: data.endHour,
        location: data.location,
        noteText: data.noteText,
      },
    });

    return NextResponse.json(workOrder);
  } catch (error) {
    console.error('Error updating work order:', error);
    return NextResponse.json(
      { error: 'Failed to update work order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verificar si el usuario es un supervisor
    if (session.user.role !== 'SUPERVISOR') {
      console.log('User role:', session.user.role); // Agregar log para debugging
      return NextResponse.json(
        { error: 'Only supervisors can update work orders' },
        { status: 403 }
      );
    }

    const { id } = context.params;
    const data = await request.json();
    const { truckNumber, technician } = data;

    const updatedWorkOrder = await prisma.workOrder.update({
      where: { id },
      data: {
        truckNumber,
        technician,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedWorkOrder);
  } catch (error) {
    console.error('Error updating work order:', error);
    return NextResponse.json(
      { error: 'Failed to update work order' },
      { status: 500 }
    );
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
    return NextResponse.json(
      { error: 'Failed to delete work order' },
      { status: 500 }
    );
  }
}
