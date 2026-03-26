"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  workspace: z.string().min(3),
});

export async function registerAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const parsed = registerSchema.safeParse(data);

    if (!parsed.success) {
      return { error: "Invalid data provided. Please check the fields." };
    }

    const { firstName, lastName, email, password, workspace } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "This email is already associated with an account." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const slug = workspace.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // Atomic transaction to provision the entire Tenant + User
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email,
          passwordHash,
        },
      });

      // 2. Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: workspace,
          slug,
        },
      });

      // 3. Create Organization Profile for the Tenant
      await tx.organization.create({
        data: {
          tenantId: tenant.id,
          name: workspace,
        },
      });

      // 4. Create Membership linking Owner to Tenant
      await tx.membership.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          role: "OWNER",
        },
      });

      return { userId: user.id, tenantId: tenant.id };
    });

    return { success: true, ...result };
  } catch (err) {
    console.error("Registration error:", err);
    return { error: "An unexpected error occurred during registration." };
  }
}

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

export async function signInAction(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error; // Let redirect propagate if it wasn't explicitly prevented
  }
}
