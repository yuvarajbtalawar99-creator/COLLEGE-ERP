import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {

  await prisma.branch.createMany({
    data: [
      {
        name: "Computer Science & Engineering",
        code: "CSE"
      },
      {
        name: "Electronics & Communication Engineering",
        code: "ECE"
      },
      {
        name: "Computer Science & Engineering (AI & ML)",
        code: "AIML"
      },
      {
        name: "Mechanical Engineering",
        code: "ME"
      },
      {
        name: "Civil Engineering",
        code: "CE"
      }
    ],
    skipDuplicates: true
  });

  console.log("Branches seeded successfully");

}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());