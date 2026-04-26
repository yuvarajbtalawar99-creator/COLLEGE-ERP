import prisma from "../src/config/prisma";

async function main() {
  await prisma.user.upsert({
    where: { supabaseUserId: "seeded-admission-officer" },
    update: {
      email: "officer@gmail.com",
      mobile: "9876543210",
      role: "ADMISSION_OFFICER"
    },
    create: {
      supabaseUserId: "seeded-admission-officer",
      email: "officer@gmail.com",
      mobile: "9876543210",
      role: "ADMISSION_OFFICER"
    }
  });

  console.log("Admission Officer created successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());