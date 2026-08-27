"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  checkPassword,
  clearFailures,
  createSession,
  destroySession,
  registerFailure,
  tooManyAttempts,
} from "./auth";

export type LoginState = { error?: string };

async function clientIp() {
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown"
  );
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const ip = await clientIp();

  if (tooManyAttempts(ip)) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const code = String(formData.get("code") ?? "");
  if (!checkPassword(code)) {
    registerFailure(ip);
    // Ralentit volontairement les tentatives automatisées
    await new Promise((r) => setTimeout(r, 600));
    return { error: "Code incorrect." };
  }

  clearFailures(ip);
  await createSession();
  revalidatePath("/leads");
  return {};
}

export async function logout() {
  await destroySession();
  revalidatePath("/leads");
}
