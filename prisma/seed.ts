import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.info("🌱 Starting database seed script...");

  // 1. Seed Admin User
  const adminEmail = "admin@shiksha.app";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const adminUser = await prisma.user.create({
      data: {
        firebaseUid: "admin-seeded-firebase-uid",
        email: adminEmail,
        fullName: "Shiksha+ Administrator",
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.info(`✅ Admin created: ${adminUser.email}`);
  } else {
    console.info("ℹ️ Admin already exists. Skipping creation.");
  }

  // 2. Seed Indian States & Union Territories
  const states = [
    { name: "Andhra Pradesh", code: "AP" },
    { name: "Arunachal Pradesh", code: "AR" },
    { name: "Assam", code: "AS" },
    { name: "Bihar", code: "BR" },
    { name: "Chhattisgarh", code: "CG" },
    { name: "Goa", code: "GA" },
    { name: "Gujarat", code: "GJ" },
    { name: "Haryana", code: "HR" },
    { name: "Himachal Pradesh", code: "HP" },
    { name: "Jharkhand", code: "JH" },
    { name: "Karnataka", code: "KA" },
    { name: "Kerala", code: "KL" },
    { name: "Madhya Pradesh", code: "MP" },
    { name: "Maharashtra", code: "MH" },
    { name: "Manipur", code: "MN" },
    { name: "Meghalaya", code: "ML" },
    { name: "Mizoram", code: "MZ" },
    { name: "Nagaland", code: "NL" },
    { name: "Odisha", code: "OD" },
    { name: "Punjab", code: "PB" },
    { name: "Rajasthan", code: "RJ" },
    { name: "Sikkim", code: "SK" },
    { name: "Tamil Nadu", code: "TN" },
    { name: "Telangana", code: "TG" },
    { name: "Tripura", code: "TR" },
    { name: "Uttar Pradesh", code: "UP" },
    { name: "Uttarakhand", code: "UK" },
    { name: "West Bengal", code: "WB" },
    { name: "Delhi", code: "DL" },
    { name: "Jammu and Kashmir", code: "JK" },
    { name: "Ladakh", code: "LA" },
    { name: "Chandigarh", code: "CH" },
    { name: "Puducherry", code: "PY" },
    { name: "Lakshadweep", code: "LD" },
    { name: "Andaman and Nicobar Islands", code: "AN" },
    { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN" },
  ];

  for (const stateData of states) {
    await prisma.state.upsert({
      where: { code: stateData.code },
      update: {},
      create: stateData,
    });
  }
  console.info(`✅ Seeded ${states.length} Indian states and UTs.`);

  // 3. Seed Default Category
  const defaultCategory = await prisma.category.upsert({
    where: { slug: "competitive-exams" },
    update: {},
    create: {
      name: "Competitive Exams",
      slug: "competitive-exams",
      description:
        "National and State level competitive examinations for government jobs.",
    },
  });
  console.info(`✅ Seeded default category: ${defaultCategory.name}`);

  console.info("🌱 Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Database seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
