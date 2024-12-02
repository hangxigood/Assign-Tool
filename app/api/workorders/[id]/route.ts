import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
    WorkOrderResponse, 
    UpdateWorkOrderRequest, 
    isUpdateWorkOrderRequest,
    ApiErrorResponse, 
    WorkOrderLocation,
    WorkOrderUser
} from '@/types/workorder';

export async function GET(
    request: Request,
    context: { params: { id: string } }
): Promise<NextResponse<WorkOrderResponse | ApiErrorResponse>> {
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

        // Add the title field to the response
        const workOrderWithTitle: WorkOrderResponse = {
            id: workOrder.id,
            type: workOrder.type,
            status: workOrder.status,
            fameNumber: workOrder.fameNumber,
            clientName: workOrder.clientName,
            clientPhone: workOrder.clientPhone,
            clientEmail: workOrder.clientEmail!, // Assert non-null since it's required in schema
            startDate: workOrder.startDate,
            endDate: workOrder.endDate,
            title: `${workOrder.type} - ${workOrder.clientName} - ${workOrder.fameNumber}`,
            pickupLocation: workOrder.pickupLocation as WorkOrderLocation,
            deliveryLocation: workOrder.deliveryLocation as WorkOrderLocation,
            assignedTo: workOrder.assignedTo as WorkOrderUser,
            supervisor: workOrder.supervisor as WorkOrderUser,
            pickupLocationId: workOrder.pickupLocationId,
            deliveryLocationId: workOrder.deliveryLocationId,
        };

        return NextResponse.json(workOrderWithTitle);
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
): Promise<NextResponse<WorkOrderResponse | ApiErrorResponse>> {
    const { id } = context.params;

    try {
        const body: UpdateWorkOrderRequest = await request.json();
        
        if (!isUpdateWorkOrderRequest(body)) {
            return NextResponse.json(
                { error: 'Invalid work order data' },
                { status: 400 }
            );
        }

        const workOrder = await prisma.workOrder.update({
            where: { id },
            data: {
                type: body.type,
                status: body.status,
                fameNumber: body.fameNumber,
                clientName: body.clientName,
                clientPhone: body.clientPhone,
                clientEmail: body.clientEmail,
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                assignedToId: body.assignedToId,
                supervisorId: body.supervisorId,
                pickupLocationId: body.pickupLocationId,
                deliveryLocationId: body.deliveryLocationId,
            },
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

        // Add the title field to the response
        const workOrderWithTitle: WorkOrderResponse = {
            id: workOrder.id,
            type: workOrder.type,
            status: workOrder.status,
            fameNumber: workOrder.fameNumber,
            clientName: workOrder.clientName,
            clientPhone: workOrder.clientPhone,
            clientEmail: workOrder.clientEmail!, // Assert non-null since it's required in schema
            startDate: workOrder.startDate,
            endDate: workOrder.endDate,
            title: `${workOrder.type} - ${workOrder.clientName} - ${workOrder.fameNumber}`,
            pickupLocation: workOrder.pickupLocation as WorkOrderLocation,
            deliveryLocation: workOrder.deliveryLocation as WorkOrderLocation,
            assignedTo: workOrder.assignedTo as WorkOrderUser,
            supervisor: workOrder.supervisor as WorkOrderUser,
            pickupLocationId: workOrder.pickupLocationId,
            deliveryLocationId: workOrder.deliveryLocationId,
        };

        return NextResponse.json(workOrderWithTitle);
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
): Promise<NextResponse<{ message: string } | ApiErrorResponse>> {
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
