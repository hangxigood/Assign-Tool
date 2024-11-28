import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const workOrder = await prisma.workOrder.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: {
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
        endDate: data.endDate ? new Date(data.endDate) : null,
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
