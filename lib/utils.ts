import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function hashEmail(email: string): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase()
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(normalizedEmail),
  )

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}
