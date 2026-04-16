import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@raseen.local";
  const adminPasswordHash = await bcrypt.hash("Admin@12345", 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      companyName: "Raseen Authority",
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
    },
  });

  console.log("Seed completed. Admin user: admin@raseen.local / Admin@12345");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
