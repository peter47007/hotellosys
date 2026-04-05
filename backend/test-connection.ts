// Test database connectivity for HotelloSys
import { prisma } from './src/lib/prisma.js';

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Attempt to query the database
    console.log('📊 Attempting to connect to Prisma client...');
    
    // Try to access the database
    const hotels = await prisma.hotels.count();
    console.log(`✅ Database connected successfully!`);
    console.log(`   Hotels in database: ${hotels}`);

    // Test other tables
    const employees = await prisma.employees.count();
    console.log(`   Employees in database: ${employees}`);

    const rooms = await prisma.rooms.count();
    console.log(`   Rooms in database: ${rooms}`);

    console.log('\n✨ All database tables are accessible!');
    
    return true;
  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error(`Error: ${error.message}`);
    console.error('\nTroubleshooting steps:');
    console.error('1. Verify DATABASE_URL in backend/.env');
    console.error('2. Run: npm run prisma:migrate');
    console.error('3. Check that Prisma schema is valid');
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().then((success) => {
  process.exit(success ? 0 : 1);
});
