"use server";

import { signinFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";

// Sign In User with Credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  console.log("prevState", prevState);
  try {
    const user = signinFormSchema.parse({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
    await signIn("credentials", user);

    return { success: true, message: "Sign In Successful" };
  } catch (error) {
    console.log("error",error)
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

    return { success:true,message:"User Registered Successfully!"}
  } catch(error) {
        if (isRedirectError(error)) {
          throw error;
        }
    
        return { success: false, message: "User was not registered",error:formatError(error) };
  }
}
