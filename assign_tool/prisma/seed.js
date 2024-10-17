const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  // Create Admin
  const adminPassword = await bcrypt.hash('adminpassword', saltRounds);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create Manager
  const managerPassword = await bcrypt.hash('managerpassword', saltRounds);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      name: 'Manager User',
      email: 'manager@example.com',
      password: managerPassword,
      role: 'MANAGER',
    },
  });

  // Create Technicians
  const technicianPassword = await bcrypt.hash('technicianpassword', saltRounds);
  const technicians = await Promise.all([
    prisma.user.upsert({
      where: { email: 'tech1@example.com' },
      update: {},
      create: {
        name: 'Technician 1',
        email: 'tech1@example.com',
        password: technicianPassword,
        role: 'TECHNICIAN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'tech2@example.com' },
      update: {},
      create: {
        name: 'Technician 2',
        email: 'tech2@example.com',
        password: technicianPassword,
        role: 'TECHNICIAN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'tech3@example.com' },
      update: {},
      create: {
        name: 'Technician 3',
        email: 'tech3@example.com',
        password: technicianPassword,
        role: 'TECHNICIAN',
      },
    }),
  ]);

  console.log({ admin, manager, technicians });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

