const { PrismaClient, UserRole, WorkOrderType, WorkOrderStatus } = require('@prisma/client')
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

  // Additional Technicians
  const technician2Password = await hash('tech123', 12)
  const technician2 = await prisma.user.upsert({
    where: { email: 'tech2@example.com' },
    update: {
      password: technician2Password,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7893',
    },
    create: {
      email: 'tech2@example.com',
      password: technician2Password,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7893',
    },
  })

  const technician3Password = await hash('tech123', 12)
  const technician3 = await prisma.user.upsert({
    where: { email: 'tech3@example.com' },
    update: {
      password: technician3Password,
      firstName: 'Michael',
      lastName: 'Chen',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7894',
    },
    create: {
      email: 'tech3@example.com',
      password: technician3Password,
      firstName: 'Michael',
      lastName: 'Chen',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7894',
    },
  })

  const technician4Password = await hash('tech123', 12)
  const technician4 = await prisma.user.upsert({
    where: { email: 'tech4@example.com' },
    update: {
      password: technician4Password,
      firstName: 'Emily',
      lastName: 'Davis',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7895',
    },
    create: {
      email: 'tech4@example.com',
      password: technician4Password,
      firstName: 'Emily',
      lastName: 'Davis',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7895',
    },
  })

  const technician5Password = await hash('tech123', 12)
  const technician5 = await prisma.user.upsert({
    where: { email: 'tech5@example.com' },
    update: {
      password: technician5Password,
      firstName: 'James',
      lastName: 'Wilson',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7896',
    },
    create: {
      email: 'tech5@example.com',
      password: technician5Password,
      firstName: 'James',
      lastName: 'Wilson',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7896',
    },
  })

  const technician6Password = await hash('tech123', 12)
  const technician6 = await prisma.user.upsert({
    where: { email: 'tech6@example.com' },
    update: {
      password: technician6Password,
      firstName: 'Lisa',
      lastName: 'Brown',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7897',
    },
    create: {
      email: 'tech6@example.com',
      password: technician6Password,
      firstName: 'Lisa',
      lastName: 'Brown',
      role: UserRole.TECHNICIAN,
      phone: '123-456-7897',
    },
  })

  // Additional Supervisors
  const supervisor2Password = await hash('super123', 12)
  const supervisor2 = await prisma.user.upsert({
    where: { email: 'supervisor2@example.com' },
    update: {
      password: supervisor2Password,
      firstName: 'Robert',
      lastName: 'Martinez',
      role: UserRole.SUPERVISOR,
      phone: '123-456-7898',
    },
    create: {
      email: 'supervisor2@example.com',
      password: supervisor2Password,
      firstName: 'Robert',
      lastName: 'Martinez',
      role: UserRole.SUPERVISOR,
      phone: '123-456-7898',
    },
  })

  const supervisor3Password = await hash('super123', 12)
  const supervisor3 = await prisma.user.upsert({
    where: { email: 'supervisor3@example.com' },
    update: {
      password: supervisor3Password,
      firstName: 'Jennifer',
      lastName: 'Taylor',
      role: UserRole.SUPERVISOR,
      phone: '123-456-7899',
    },
    create: {
      email: 'supervisor3@example.com',
      password: supervisor3Password,
      firstName: 'Jennifer',
      lastName: 'Taylor',
      role: UserRole.SUPERVISOR,
      phone: '123-456-7899',
    },
  })

  // Create test locations
  const warehouse = await prisma.location.create({
    data: {
      name: 'Main Warehouse',
      address: '123 Warehouse St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
    },
  })

  const venue = await prisma.location.create({
    data: {
      name: 'Convention Center',
      address: '456 Event Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94111',
    },
  })

  // Additional Warehouses
  const warehouse2 = await prisma.location.create({
    data: {
      name: 'South Warehouse',
      address: '456 Industrial Blvd',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95110',
    },
  })

  const warehouse3 = await prisma.location.create({
    data: {
      name: 'East Warehouse',
      address: '789 Distribution Way',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94601',
    },
  })

  const warehouse4 = await prisma.location.create({
    data: {
      name: 'North Warehouse',
      address: '321 Logistics Ave',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95814',
    },
  })

  // Helper function to create a date with specific hours
  const createDateTime = (daysFromNow: number, startHour: number): Date => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    date.setHours(startHour, 0, 0, 0)
    return date
  }

  // Create work orders
  const workOrders = await Promise.all([
    // Today's work orders
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-001' },
      update: {
        type: WorkOrderType.PICKUP,
        status: WorkOrderStatus.PENDING,
        clientName: 'John Smith',
        clientPhone: '555-0101',
        clientEmail: 'john@example.com',
        startDate: createDateTime(0, 8), // Today 8 AM
        endDate: createDateTime(0, 12), // Today 12 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.PICKUP,
        status: WorkOrderStatus.PENDING,
        fameNumber: 'WO-2024-001',
        clientName: 'John Smith',
        clientPhone: '555-0101',
        clientEmail: 'john@example.com',
        startDate: createDateTime(0, 8), // Today 8 AM
        endDate: createDateTime(0, 12), // Today 12 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-002' },
      update: {
        type: WorkOrderType.SETUP,
        status: WorkOrderStatus.IN_PROGRESS,
        clientName: 'Jane Doe',
        clientPhone: '555-0102',
        clientEmail: 'jane@example.com',
        startDate: createDateTime(0, 13), // Today 1 PM
        endDate: createDateTime(0, 17), // Today 5 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.SETUP,
        status: WorkOrderStatus.IN_PROGRESS,
        fameNumber: 'WO-2024-002',
        clientName: 'Jane Doe',
        clientPhone: '555-0102',
        clientEmail: 'jane@example.com',
        startDate: createDateTime(0, 13), // Today 1 PM
        endDate: createDateTime(0, 17), // Today 5 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    // Tomorrow's work orders
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-003' },
      update: {
        type: WorkOrderType.DELIVERY,
        status: WorkOrderStatus.PENDING,
        clientName: 'Bob Wilson',
        clientPhone: '555-0103',
        clientEmail: 'bob@example.com',
        startDate: createDateTime(1, 9), // Tomorrow 9 AM
        endDate: createDateTime(1, 15), // Tomorrow 3 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.DELIVERY,
        status: WorkOrderStatus.PENDING,
        fameNumber: 'WO-2024-003',
        clientName: 'Bob Wilson',
        clientPhone: '555-0103',
        clientEmail: 'bob@example.com',
        startDate: createDateTime(1, 9), // Tomorrow 9 AM
        endDate: createDateTime(1, 15), // Tomorrow 3 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    // Additional work orders
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-004' },
      update: {
        type: WorkOrderType.ACTIVATION,
        status: WorkOrderStatus.PENDING,
        clientName: 'Alice Johnson',
        clientPhone: '555-0104',
        clientEmail: 'alice@example.com',
        startDate: createDateTime(2, 10), // Day after tomorrow 10 AM
        endDate: createDateTime(2, 16), // Day after tomorrow 4 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.ACTIVATION,
        status: WorkOrderStatus.PENDING,
        fameNumber: 'WO-2024-004',
        clientName: 'Alice Johnson',
        clientPhone: '555-0104',
        clientEmail: 'alice@example.com',
        startDate: createDateTime(2, 10), // Day after tomorrow 10 AM
        endDate: createDateTime(2, 16), // Day after tomorrow 4 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-005' },
      update: {
        type: WorkOrderType.TEARDOWN,
        status: WorkOrderStatus.PENDING,
        clientName: 'Charlie Brown',
        clientPhone: '555-0105',
        clientEmail: 'charlie@example.com',
        startDate: createDateTime(2, 14), // Day after tomorrow 2 PM
        endDate: createDateTime(2, 20), // Day after tomorrow 8 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.TEARDOWN,
        status: WorkOrderStatus.PENDING,
        fameNumber: 'WO-2024-005',
        clientName: 'Charlie Brown',
        clientPhone: '555-0105',
        clientEmail: 'charlie@example.com',
        startDate: createDateTime(2, 14), // Day after tomorrow 2 PM
        endDate: createDateTime(2, 20), // Day after tomorrow 8 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-006' },
      update: {
        type: WorkOrderType.PICKUP,
        status: WorkOrderStatus.PENDING,
        clientName: 'David Miller',
        clientPhone: '555-0106',
        clientEmail: 'david@example.com',
        startDate: createDateTime(3, 8), // 3 days from now 8 AM
        endDate: createDateTime(3, 14), // 3 days from now 2 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.PICKUP,
        status: WorkOrderStatus.PENDING,
        fameNumber: 'WO-2024-006',
        clientName: 'David Miller',
        clientPhone: '555-0106',
        clientEmail: 'david@example.com',
        startDate: createDateTime(3, 8), // 3 days from now 8 AM
        endDate: createDateTime(3, 14), // 3 days from now 2 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-007' },
      update: {
        type: WorkOrderType.SETUP,
        status: WorkOrderStatus.PENDING,
        clientName: 'Eva White',
        clientPhone: '555-0107',
        clientEmail: 'eva@example.com',
        startDate: createDateTime(3, 15), // 3 days from now 3 PM
        endDate: createDateTime(3, 21), // 3 days from now 9 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.SETUP,
        status: WorkOrderStatus.PENDING,
        fameNumber: 'WO-2024-007',
        clientName: 'Eva White',
        clientPhone: '555-0107',
        clientEmail: 'eva@example.com',
        startDate: createDateTime(3, 15), // 3 days from now 3 PM
        endDate: createDateTime(3, 21), // 3 days from now 9 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-008' },
      update: {
        type: WorkOrderType.DELIVERY,
        status: WorkOrderStatus.PENDING,
        clientName: 'Frank Thomas',
        clientPhone: '555-0108',
        clientEmail: 'frank@example.com',
        startDate: createDateTime(4, 9), // 4 days from now 9 AM
        endDate: createDateTime(4, 15), // 4 days from now 3 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.DELIVERY,
        status: WorkOrderStatus.PENDING,
        fameNumber: 'WO-2024-008',
        clientName: 'Frank Thomas',
        clientPhone: '555-0108',
        clientEmail: 'frank@example.com',
        startDate: createDateTime(4, 9), // 4 days from now 9 AM
        endDate: createDateTime(4, 15), // 4 days from now 3 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-009' },
      update: {
        type: WorkOrderType.ACTIVATION,
        status: WorkOrderStatus.PENDING,
        clientName: 'Grace Lee',
        clientPhone: '555-0109',
        clientEmail: 'grace@example.com',
        startDate: createDateTime(4, 16), // 4 days from now 4 PM
        endDate: createDateTime(4, 22), // 4 days from now 10 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.ACTIVATION,
        status: WorkOrderStatus.PENDING,
        fameNumber: 'WO-2024-009',
        clientName: 'Grace Lee',
        clientPhone: '555-0109',
        clientEmail: 'grace@example.com',
        startDate: createDateTime(4, 16), // 4 days from now 4 PM
        endDate: createDateTime(4, 22), // 4 days from now 10 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
    prisma.workOrder.upsert({
      where: { fameNumber: 'WO-2024-010' },
      update: {
        type: WorkOrderType.TEARDOWN,
        status: WorkOrderStatus.PENDING,
        clientName: 'Henry Wilson',
        clientPhone: '555-0110',
        clientEmail: 'henry@example.com',
        startDate: createDateTime(5, 10), // 5 days from now 10 AM
        endDate: createDateTime(5, 16), // 5 days from now 4 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
      create: {
        type: WorkOrderType.TEARDOWN,
        status: WorkOrderStatus.PENDING,
        fameNumber: 'WO-2024-010',
        clientName: 'Henry Wilson',
        clientPhone: '555-0110',
        clientEmail: 'henry@example.com',
        startDate: createDateTime(5, 10), // 5 days from now 10 AM
        endDate: createDateTime(5, 16), // 5 days from now 4 PM
        pickupLocationId: warehouse.id,
        deliveryLocationId: venue.id,
        assignedToId: technician.id,
        createdById: admin.id,
        supervisorId: supervisor.id,
      },
    }),
  ])

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
