import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WorkOrderStatus } from '@prisma/client';

export async function GET() {
  try {
    // Get total trucks and assigned trucks
    const totalTrucks = await prisma.equipment.count({
      where: { type: 'TRUCK' }
    });
    const assignedTrucks = await prisma.equipment.count({
      where: { 
        type: 'TRUCK',
        status: 'IN_USE'
      }
    });

    // Get total technicians
    const totalTechnicians = await prisma.user.count({
      where: {
        role: 'TECHNICIAN',
      }
    });
    
    // Get total active work orders
    const activeWorkOrders = await prisma.workOrder.count({
      where: {
        status: { not: WorkOrderStatus.COMPLETED }
      }
    });

    // Calculate hours worked today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayWorkOrders = await prisma.workOrder.findMany({
      where: {
        status: WorkOrderStatus.COMPLETED,
        startDate: {
          gte: today
        }
      }
    });

    let todayHours = 0;
    for (const order of todayWorkOrders) {
      if (order.startHour && order.endHour) {
        const [startHour, startMinute] = order.startHour.split(':').map(Number);
        const [endHour, endMinute] = order.endHour.split(':').map(Number);
        const hours = endHour - startHour + (endMinute - startMinute) / 60;
        if (hours > 0) {
          todayHours += hours;
        }
      }
    }

    // Calculate hours worked this month
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthWorkOrders = await prisma.workOrder.findMany({
      where: {
        status: WorkOrderStatus.COMPLETED,
        startDate: {
          gte: firstDayOfMonth
        }
      }
    });

    let monthHours = 0;
    for (const order of monthWorkOrders) {
      if (order.startHour && order.endHour) {
        const [startHour, startMinute] = order.startHour.split(':').map(Number);
        const [endHour, endMinute] = order.endHour.split(':').map(Number);
        const hours = endHour - startHour + (endMinute - startMinute) / 60;
        if (hours > 0) {
          monthHours += hours;
        }
      }
    }

    return NextResponse.json({
      totalTrucks,
      assignedTrucks,
      totalTechnicians,
      activeWorkOrders,
      todayHours: Math.round(todayHours * 10) / 10,
      monthHours: Math.round(monthHours * 10) / 10,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
