import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting district seeding...");

  // 1️⃣ Create/Update State (Karnataka)
  const karnataka = await prisma.state.upsert({
    where: { name: "Karnataka" },
    update: {},
    create: {
      name: "Karnataka"
    }
  });

  const districts = [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", 
    "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", 
    "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", 
    "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", 
    "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", 
    "Uttara Kannada", "Vijayapura", "Yadgir", "Vijayanagara"
  ];

  // 2️⃣ Create Districts under Karnataka
  const districtData = districts.map(name => ({
    name,
    stateId: karnataka.id
  }));

  const result = await prisma.district.createMany({
    data: districtData,
    skipDuplicates: true
  });

  console.log(`Successfully seeded ${result.count} districts for Karnataka.`);
}

main()
  .catch((e) => {
    console.error("Error seeding districts:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });