"use server";

import {
  shippingAddressSchema,
  signinFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { PaymentMethod, ShippingAddress } from "@/types";
import { PAGE_SIZE } from "../constant";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Sign In User with Credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signinFormSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    await signIn("credentials", user);
    return { success: true, message: "Sign In Successful" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" };
  }
}

export async function signOutUser() {
  await signOut();
}

// Sign Up User
export async function signUpUser(prevState: unknown, data: FormData) {
  try {
    const { name, password, email } = signUpFormSchema.parse({
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("name"),
    });
    const plainPassword = password;

    const hashedPassword = hashSync(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await signIn("credentials", {
      email,
      password: plainPassword,
    });

    return { success: true, message: "User Registered Successfully!" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "User was not registered",
      error: formatError(error),
    };
  }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
  });

  return user;
}

export async function updateUserAddress(address: ShippingAddress) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("User Not Found");

    const parsedAddress = shippingAddressSchema.parse(address);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        address: parsedAddress,
      },
    });

    if (!user) throw new Error("Address Not Found");

    return {
      success: true,
      data: user.address,
    };
  } catch (error) {
    return {
      success: "fail",
      message: formatError(error),
    };
  }
}

export const updateUserPaymentMethod = async (data: PaymentMethod) => {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User Not Found");

    await prisma.user.update({
      where: { id: currentUser?.id },
      data: {
        paymentMethod: data.type,
      },
    });

    return {
      success: true,
      message: "User Payment Method Update Successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
};

export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });

    if (!currentUser) throw new Error("User Not Found");

    await prisma.user.update({
      where: { id: currentUser?.id },
      data: {
        ...user,
      },
    });

    return {
      success: true,
      message: "User Profile Updated Successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/users");
    return {
      success: true,
      message: 'User Deleted Successfully',
    };
    
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}