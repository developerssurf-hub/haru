"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginStrapi } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;

  const result = await loginStrapi(identifier, password);

  if (result.success && result.jwt) {
    const cookieStore = await cookies();
    cookieStore.set("jwt", result.jwt, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    return { success: true };
  }

  return { success: false, error: result.error };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
  cookieStore.delete("simulated_role");
  redirect("/login");
}

export async function setSimulatedRoleAction(role: string) {
  const cookieStore = await cookies();
  cookieStore.set("simulated_role", role, {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
