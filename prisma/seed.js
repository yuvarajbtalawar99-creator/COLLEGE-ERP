"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
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
