import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WorkOrder } from '@/types/workorder';
import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// Define the exact type that Prisma returns
type PrismaWorkOrder = Prisma.WorkOrderGetPayload<{
  include: {
    assignedTo: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        role: true;
        phone: true;
      };
    };
    supervisor: {
      select: {
        id: true;
        firstName: true;
        lastName: true;
        email: true;
        role: true;
        phone: true;
      };
    };
    pickupLocation: true;
    deliveryLocation: true;
  };
}>;

/**
 * Transforms a Prisma work order into our domain WorkOrder type
 */
function toDomainWorkOrder(dbWorkOrder: PrismaWorkOrder): WorkOrder {
  return {
    id: dbWorkOrder.id,
    title: `${dbWorkOrder.fameNumber} - ${dbWorkOrder.clientName}`,
    fameNumber: dbWorkOrder.fameNumber,
    type: dbWorkOrder.type,
    status: dbWorkOrder.status,
    clientName: dbWorkOrder.clientName,
    clientEmail: dbWorkOrder.clientEmail || undefined,
    clientPhone: dbWorkOrder.clientPhone || undefined,
    pickupLocationId: dbWorkOrder.pickupLocationId || undefined,
    deliveryLocationId: dbWorkOrder.deliveryLocationId || undefined,
    startDate: dbWorkOrder.startDate,
    endDate: dbWorkOrder.endDate,
    assignedTo: {
      id: dbWorkOrder.assignedTo.id,
      firstName: dbWorkOrder.assignedTo.firstName,
      lastName: dbWorkOrder.assignedTo.lastName,
      email: dbWorkOrder.assignedTo.email,
      role: dbWorkOrder.assignedTo.role,
      phone: dbWorkOrder.assignedTo.phone,
    },
    supervisor: dbWorkOrder.supervisor
      ? {
          id: dbWorkOrder.supervisor.id,
          firstName: dbWorkOrder.supervisor.firstName,
          lastName: dbWorkOrder.supervisor.lastName,
          email: dbWorkOrder.supervisor.email,
          role: dbWorkOrder.supervisor.role,
          phone: dbWorkOrder.supervisor.phone,
        }
      : undefined,
  };
}

/**
 * Handles GET requests to retrieve work orders.
 */
export async function GET(): Promise<NextResponse<WorkOrder[] | { error: string }>> {
  try {
    const dbWorkOrders = await prisma.workOrder.findMany({
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
          },
        },
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
          },
        },
        pickupLocation: true,
        deliveryLocation: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    // Transform database models to domain models
    const workOrders = dbWorkOrders.map(toDomainWorkOrder);
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
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const workOrder = await prisma.workOrder.create({
      data: {
        type: data.type,
        fameNumber: data.fameNumber,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        clientEmail: data.clientEmail,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        assignedTo: {
          connect: { id: data.assignedToId }
        },
        supervisor: {
          connect: { id: data.supervisorId }
        },
        createdBy: {
          connect: { id: session.user.id }
        },
        pickupLocation: {
          connect: { id: data.pickupLocationId }
        },
        deliveryLocation: {
          connect: { id: data.deliveryLocationId }
        }
      },
      include: {
        pickupLocation: true,
        deliveryLocation: true,
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
          }
        },
        supervisor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            phone: true,
          }
        }
      }
    });

    return NextResponse.json(workOrder);
  } catch (error) {
    console.error('Error creating work order:', error);
    return NextResponse.json({ error: 'Failed to create work order' }, { status: 500 });
  }
}
