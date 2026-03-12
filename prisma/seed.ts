import bcrypt from "bcrypt";
import { PrismaClient, User, Role } from "#generated/prisma";
import { generateAleatoryCodes } from "#infrastructure/utils/codes";

const prisma = new PrismaClient();

async function initializeUser() {
  const userEmail = "admin@ujcrepo.ac.mz";
  const fullName = "Admin Repo";
  const password = "adminRepo2026";
  const role = Role.ADMIN;
  const hashedPassword = await bcrypt.hash(password, 10);

  const code = generateAleatoryCodes();

  const userExists = await prisma.user.findUnique({
    where: {
      email: userEmail,
    },
  });
  if (userExists) {
    console.log("User already exists");
    return;
  }
  const newUser = await prisma.user.create({
    data: {
      fullName: fullName,
      email: userEmail,
      password: hashedPassword,
      role: role,
      code: code,
    },
  });

  console.log("User created:", newUser);
}

async function seed() {
  await initializeUser();
}
seed().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
});
