import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database sanitization...");
  
  try {
    // We use executeRawUnsafe to handle the specific MySQL zero-date comparison
    const count = await prisma.$executeRawUnsafe(
      "UPDATE user SET createdAt = NOW() WHERE createdAt = '0000-00-00 00:00:00' OR createdAt IS NULL"
    );
    console.log(`Successfully corrected ${count} rows with invalid dates.`);
    
    // Check if college accounts exist
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMISSION_OFFICER'
      },
      select: {
        email: true,
        createdAt: true
      }
    });
    console.log("Available Admin Accounts:", JSON.stringify(admins, null, 2));

  } catch (error) {
    console.error("Sanitization failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
