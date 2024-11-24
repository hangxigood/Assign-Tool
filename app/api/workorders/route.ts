import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const workOrders = await prisma.workOrder.findMany({
      include: {
        assignedTo: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const workOrder = await prisma.workOrder.create({
      data: {
        type: data.type,
        fameNumber: data.fameNumber,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        assignedToId: data.assignedToId,
        createdById: data.createdById,
        supervisorId: data.supervisorId,
        pickupLocationId: data.pickupLocationId,
        deliveryLocationId: data.deliveryLocationId,
      },
    });
    
    return NextResponse.json(workOrder);
  } catch (error) {
    console.error('Error creating work order:', error);
    return NextResponse.json(
      { error: 'Failed to create work order' },
      { status: 500 }
    );
  }
}
