// C:\Users\Admin\OneDrive\Desktop\BuyzaProject\hotellosys\backend\test-db.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('Testing HotelloSys Database Connection...');
  try {
    // Attempt to connect and fetch the hotel count
    const hotelCount = await prisma.hotels.count();
    console.log(`✅ Connection Successful!`);
    console.log(`📊 Total Hotels in DB: ${hotelCount}`);

    // Fetch the specific admin we just seeded
    const admin = await prisma.employees.findFirst({
      where: { username: 'admin' },
      include: {
        hotel: true,
        role: true,
        department: true
      }
    });

    if (admin) {
      console.log(`👤 Found Admin: ${admin.firstName} ${admin.lastName}`);
      console.log(`🏨 Linked to Hotel: ${admin.hotel.hotelName}`);
      console.log(`🔑 Role: ${admin.role.roleName}`);
    } else {
      console.log('⚠️ Database connected, but seeded admin was not found.');
    }

  } catch (error) {
    console.error('❌ Database Connection Failed:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();