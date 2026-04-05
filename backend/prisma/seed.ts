// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\prisma\seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. CLEANUP (Ordering matters due to Foreign Key constraints)
  await prisma.employees.deleteMany();
  await prisma.departments.deleteMany();
  await prisma.roles.deleteMany();
  await prisma.roomTypes.deleteMany();
  await prisma.hotels.deleteMany();
  console.log('Successfully cleaned old data.');

  // 2. CREATE HOTEL
  const hotel = await prisma.hotels.create({
    data: {
      hotelName: 'Buyza Grand HQ',
      address: 'Dar es Salaam, Tanzania',
      city: 'Dar es Salaam',
      country: 'Tanzania',
      defaultCurrency: 'TZS',
      isActive: true,
    },
  });
  console.log(`🏨 Hotel created: ${hotel.hotelName} (ID: ${hotel.hotelId})`);

  // 3. CREATE ROLE (Required for Employee)
  const adminRole = await prisma.roles.create({
    data: {
      hotelId: hotel.hotelId,
      roleName: 'Admin',
      roleDescription: 'Full System Access',
    },
  });

  // 4. CREATE DEPARTMENT (Required for Employee)
  const adminDept = await prisma.departments.create({
    data: {
      hotelId: hotel.hotelId,
      departmentName: 'Administration',
      departmentDescription: 'IT and Management',
    },
  });

  // 5. CREATE EMPLOYEE (Matching your schema exactly)
  const admin = await prisma.employees.create({
    data: {
      hotelId: hotel.hotelId,
      firstName: 'Peter',
      lastName: 'Chacha',
      email: 'admin@buyza.com',
      username: 'admin',
      passwordHash: 'admin123', // Note: your schema uses passwordHash
      departmentId: adminDept.departmentId,
      roleId: adminRole.roleId,
      joinDate: new Date(),
      isActive: true,
    },
  });
  console.log(`👤 Admin Employee created: ${admin.username}`);

  // 6. CREATE ROOM TYPE & ROOM (Optional but helpful)
  const stdType = await prisma.roomTypes.create({
    data: {
      hotelId: hotel.hotelId,
      typeName: 'Standard',
      basePrice: 150000,
      capacity: 2,
    }
  });

  await prisma.rooms.create({
    data: {
      hotelId: hotel.hotelId,
      roomTypeId: stdType.roomTypeId,
      roomNumber: '101',
      floor: 1,
      roomStatus: 'Available',
    }
  });

  console.log('🚀 Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seed Error details:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });