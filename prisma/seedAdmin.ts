import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma";

async function main() {

  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      email: "officer@gmail.com",
      mobile: "9876543210", // must be unique
      password: hashedPassword,
      role: "ADMISSION_OFFICER"
    }
  });

  console.log("Admission Officer created successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());