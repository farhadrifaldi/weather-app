// scripts/seed.js

import { PrismaClient } from "@prisma/client";
import { createHmac } from "crypto";

const EMAIL = "admin@admin.com";
const PASSWORD = hashString("password");
const NAME = "Admin";

const prisma = new PrismaClient();

function hashString(password) {
  const secret = "abcdefg";
  const hash = createHmac("sha256", secret).update(password).digest("hex");

  return hash;
}

async function main() {
  const user = await prisma.user.findUnique({
    where: {
      email: EMAIL,
    },
  });

  console.log("ini user", user);
  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        name: NAME,
        email: EMAIL,
        password: PASSWORD,
        cities: {
          create: [{ name: "JAKARTA" }],
        },
      },
    });

    console.log("User  created:", newUser);
  } else {
    console.log("User already created");
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
