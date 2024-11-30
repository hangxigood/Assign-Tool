import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Handles GET requests to retrieve work orders.
 */
export async function GET() {
  try {
    const workOrders = await prisma.workOrder.findMany({
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
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    
    return NextResponse.json(workOrders);
  } catch (error) {
    console.error('Error fetching work orders:', error);
    return NextResponse.json({ error: 'Failed to fetch work orders' }, { status: 500 });
  }
}

/**
 * Handles POST requests to create new work orders.
 * 
 * @param request The incoming request object.
 */
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
    return NextResponse.json({ error: 'Failed to create work order' }, { status: 500 });
  }
}
