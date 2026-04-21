import prisma from "../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (
  email: string,
  mobile: string,
  password: string,
  role: "STUDENT" | "ADMISSION_OFFICER" | "SUPER_ADMIN"
) => {

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { mobile }]
    }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      mobile,
      password: hashedPassword,
      role
    }
  });

  return user;
};

export const loginUser = async (
  email: string,
  password: string
) => {

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  return { token };
};