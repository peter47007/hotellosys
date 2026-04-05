// Database seeding script for HotelloSys
import { prisma } from './src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data (optional - comment out if you want to keep data)
    // await prisma.employees.deleteMany({});
    // await prisma.hotels.deleteMany({});

    // 1. Create a Hotel
    const hotel = await prisma.hotels.create({
      data: {
        hotelName: 'Test Hotel Demo',
        address: '123 Main Street',
        city: 'New York',
        country: 'USA',
        postalCode: '10001',
        phoneNumber: '+1-212-555-0100',
        email: 'contact@testhotel.com',
        website: 'https://testhotel.example.com',
        registrationNumber: 'REG-12345',
        taxId: 'TAX-98765',
        subscriptionType: 'Premium',
        subscriptionStartDate: new Date('2026-01-01'),
        subscriptionEndDate: new Date('2027-01-01'),
        defaultCurrency: 'USD',
        defaultLanguage: 'en',
        isActive: true,
      },
    });
    console.log('✅ Hotel created:', hotel.hotelName);

    // 2. Create Departments
    const frontDeskDept = await prisma.departments.create({
      data: {
        hotelId: hotel.hotelId,
        departmentName: 'Front Desk',
        departmentDescription: 'Guest check-in and support',
      },
    });

    const kitchenDept = await prisma.departments.create({
      data: {
        hotelId: hotel.hotelId,
        departmentName: 'Kitchen',
        departmentDescription: 'Food preparation and service',
      },
    });

    console.log('✅ Departments created:', frontDeskDept.departmentName, kitchenDept.departmentName);

    // 3. Create Roles
    const adminRole = await prisma.roles.create({
      data: {
        hotelId: hotel.hotelId,
        roleName: 'Administrator',
        roleDescription: 'Full system access',
      },
    });

    const frontDeskRole = await prisma.roles.create({
      data: {
        hotelId: hotel.hotelId,
        roleName: 'Front Desk Staff',
        roleDescription: 'Check-in and guest services',
      },
    });

    console.log('✅ Roles created:', adminRole.roleName, frontDeskRole.roleName);

    // 4. Create Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminEmployee = await prisma.employees.create({
      data: {
        hotelId: hotel.hotelId,
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@testhotel.com',
        departmentId: frontDeskDept.departmentId,
        roleId: adminRole.roleId,
        title: 'System Administrator',
        gender: 'Not Specified',
        joinDate: new Date(),
        username: 'admin',
        passwordHash: hashedPassword,
        isActive: true,
      },
    });

    console.log('✅ Admin user created:', adminEmployee.username);
    console.log('   📧 Email: admin@testhotel.com');
    console.log('   🔐 Password: admin123');

    // 5. Create Sample Rooms and Types
    const deluxeRoomType = await prisma.roomTypes.create({
      data: {
        hotelId: hotel.hotelId,
        typeName: 'Deluxe Suite',
        typeDescription: 'Premium room with ocean view',
        basePrice: new Prisma.Decimal('199.99'),
        capacity: 4,
        amenities: 'WiFi, AC, TV, Minibar, Balcony',
      },
    });

    const room101 = await prisma.rooms.create({
      data: {
        hotelId: hotel.hotelId,
        roomTypeId: deluxeRoomType.roomTypeId,
        roomNumber: '101',
        floor: 1,
        roomStatus: 'Available',
      },
    });

    const room102 = await prisma.rooms.create({
      data: {
        hotelId: hotel.hotelId,
        roomTypeId: deluxeRoomType.roomTypeId,
        roomNumber: '102',
        floor: 1,
        roomStatus: 'Available',
      },
    });

    console.log('✅ Rooms created:', room101.roomNumber, '&', room102.roomNumber);

    // 6. Create Sample Customer
    const customer = await prisma.customers.create({
      data: {
        hotelId: hotel.hotelId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+1-555-0123',
        customerType: 'Individual',
        isActive: true,
      },
    });

    console.log('✅ Customer created:', customer.firstName, customer.lastName);

    // 7. Create Sample Reservation
    const reservation = await prisma.reservations.create({
      data: {
        hotelId: hotel.hotelId,
        customerId: customer.customerId,
        roomId: room101.roomId,
        checkInDate: new Date('2026-04-15'),
        checkOutDate: new Date('2026-04-20'),
        numberOfGuests: 2,
        reservationStatus: 'Confirmed',
        reservationType: 'Standard',
        basePrice: new Prisma.Decimal('999.95'),
        totalPrice: new Prisma.Decimal('999.95'),
        bookedByEmployeeId: adminEmployee.employeeId,
      },
    });

    console.log('✅ Reservation created for', customer.firstName, 'in room', room101.roomNumber);

    console.log('\n🌳 Database seeded successfully!\n');
    console.log('📊 Summary:');
    console.log('   Hotels:       1');
    console.log('   Departments:  2');
    console.log('   Roles:        2');
    console.log('   Employees:    1');
    console.log('   Rooms:        2');
    console.log('   Customers:    1');
    console.log('   Reservations: 1');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Import Prisma types
import { Prisma } from '@prisma/client';

main();
