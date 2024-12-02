import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { hasPermission } from '@/lib/permission';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role, "view-work-orders")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = context.params;

  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        pickupLocation: true,
        deliveryLocation: true,
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
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role, "edit-work-orders")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = context.params;
  try {
    const data = await request.json();
    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: {
        type: data.type,
        status: data.status,
        fameNumber: data.fameNumber,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        assignedToId: data.assignedToId,
        supervisorId: data.supervisorId,
        pickupLocationId: data.pickupLocationId,
        deliveryLocationId: data.deliveryLocationId,
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

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasPermission(session.user.role, "edit-work-orders")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = context.params;
  try {
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
