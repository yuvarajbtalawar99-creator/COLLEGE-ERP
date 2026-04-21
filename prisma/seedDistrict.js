"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // 1️⃣ Create State first
    const karnataka = await prisma.state.upsert({
        where: { name: "Karnataka" },
        update: {},
        create: {
            name: "Karnataka"
        }
    });
    // 2️⃣ Create Districts under Karnataka
    await prisma.district.createMany({
        data: [
            { name: "Belagavi", stateId: karnataka.id },
            { name: "Bagalkot", stateId: karnataka.id },
            { name: "Dharwad", stateId: karnataka.id },
            { name: "Vijayapura", stateId: karnataka.id }
        ],
        skipDuplicates: true
    });
    console.log("State & Districts seeded successfully.");
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
