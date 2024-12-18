const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed Admin
  const admin = await prisma.admin.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("12345678", 10), // Use a hashed password in production
    },
  });

  console.log("Admin created:", admin);

  // Seed Users
  const users = await prisma.user.createMany({
    data: [
      {
        name: "example",
        email: "example@example.com",
        password: await bcrypt.hash("12345678", 10), // Use a hashed password in production
        status: 0,
      },
    ],
  });

  console.log(`${users.count} users created.`);
  
  const config = await prisma.config.create({
    data: {
      longitude: "-7.100000",
      latitude: "110.400000",
      phone: "08123456789",
    },
  });
  console.log(`${config} users created.`);
}

main()
  .then(() => {
    console.log("Seeding completed.");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Error while seeding:", e);
    process.exit(1);
  });
