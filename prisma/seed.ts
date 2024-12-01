const { PrismaClient, UserRole, WorkOrderType, WorkOrderStatus, EquipmentType, EquipmentStatus } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create test users
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      phone: '123-456-7890',
    },
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      phone: '123-456-7890',
    },
  })

  const supervisorPassword = await hash('super123', 12)
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@example.com' },
    update: {
      password: supervisorPassword,
      firstName: 'Super',
      lastName: 'Visor',
      role: UserRole.SUPERVISOR,
      phone: '123-456-7891',
    },
    create: {
      email: 'supervisor@example.com',
      password: supervisorPassword,
      firstName: 'Super',
      lastName: 'Visor',
      role: UserRole.SUPERVISOR,
      phone: '123-456-7891',
    },
  })

  const technicianPassword = await hash('tech123', 12)
  const technician = await prisma.user.upsert({
    where: { email: 'tech@example.com' },
    update: {
      password: technicianPassword,
      firstName: 'Tech',
      lastName: 'Nician',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7892',
    },
    create: {
      email: 'tech@example.com',
      password: technicianPassword,
      firstName: 'Tech',
      lastName: 'Nician',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7892',
    },
  })

  // Create test equipment
  const truck = await prisma.equipment.create({
    data: {
      name: 'Truck 001',
      type: EquipmentType.TRUCK,
      status: EquipmentStatus.AVAILABLE,
    },
  })

  const trailer = await prisma.equipment.create({
    data: {
      name: 'Trailer 001',
      type: EquipmentType.TRAILER,
      status: EquipmentStatus.AVAILABLE,
    },
  })

  // Create work orders
  const workOrders = await Promise.all([
    // Today's work order
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-001' },
      update: {
        type: WorkOrderType.PICKUP,
        status: WorkOrderStatus.PENDING,
        clientName: 'Primary',
        clientContactName: 'John Contact',
        clientPhone: '555-0123',
        startDate: new Date(),
        startHour: '09:00',
        endHour: '17:00',
        location: '123 Test St, Calgary',
        noteText: 'Test work order',
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        fameNumber: 'WO-2024-001',
        type: WorkOrderType.PICKUP,
        status: WorkOrderStatus.PENDING,
        clientName: 'Primary',
        clientContactName: 'John Contact',
        clientPhone: '555-0123',
        startDate: new Date(),
        startHour: '09:00',
        endHour: '17:00',
        location: '123 Test St, Calgary',
        noteText: 'Test work order',
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    
    // Tomorrow's work order
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-002' },
      update: {
        type: WorkOrderType.DELIVERY,
        status: WorkOrderStatus.PENDING,
        clientName: 'City of Calgary',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        startHour: '10:00',
        endHour: '18:00',
        location: '456 Test Ave, Calgary',
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        fameNumber: 'WO-2024-002',
        type: WorkOrderType.DELIVERY,
        status: WorkOrderStatus.PENDING,
        clientName: 'City of Calgary',
        startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        startHour: '10:00',
        endHour: '18:00',
        location: '456 Test Ave, Calgary',
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
  ])

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
