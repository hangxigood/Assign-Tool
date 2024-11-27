import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

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
  console.log('PUT request received for id:', context.params.id);

  try {
    const { id } = context.params;
    const data = await request.json();
    
    console.log('Received data:', data);

    if (!data) {
      console.log('No data provided');
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    const workOrder = await prisma.workOrder.update({
      where: { id },
      data: {
        type: data.type,
        status: data.status,
        // Only update fameNumber if it's different from the current one
        ...(data.fameNumber ? { fameNumber: data.fameNumber } : {}),
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        assignedTo: data.assignedToId ? {
          connect: { id: data.assignedToId }
        } : undefined,
        supervisor: data.supervisorId ? {
          connect: { id: data.supervisorId }
        } : undefined,
        pickupLocation: data.pickupLocationId ? {
          connect: { id: data.pickupLocationId }
        } : undefined,
        deliveryLocation: data.deliveryLocationId ? {
          connect: { id: data.deliveryLocationId }
        } : undefined
      },
      include: {
        assignedTo: true,
        supervisor: true,
        pickupLocation: true,
        deliveryLocation: true
      }
    });
    
    console.log('Work order updated successfully:', workOrder);
    const response = { data: workOrder, success: true };
    console.log('Sending response:', response);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Work order or referenced item not found' },
        { status: 404 }
      );
    }

    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'One or more referenced items (location or user) do not exist' },
        { status: 400 }
      );
    }

    const errorResponse = {
      error: error.message || 'An unexpected error occurred',
      details: error.code ? `Error code: ${error.code}` : undefined
    };
    console.log('Sending error response:', errorResponse);
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
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
