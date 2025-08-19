import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const NEW_AUTH_USER_ID_KEY = "userId"
const LEGACY_AUTH_USER_ID_KEY = "auth_user_id"

export function getLoggedInUserId(): number | null {
  try {
    let raw = localStorage.getItem(NEW_AUTH_USER_ID_KEY)
    if (!raw) {
      raw = localStorage.getItem(LEGACY_AUTH_USER_ID_KEY)
    }
    if (!raw) return null
    const parsed = Number.parseInt(raw)
    return Number.isFinite(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function setLoggedInUserId(userId: number | null): void {
  if (userId === null) {
    localStorage.removeItem(NEW_AUTH_USER_ID_KEY)
    localStorage.removeItem(LEGACY_AUTH_USER_ID_KEY)
  } else {
    localStorage.setItem(NEW_AUTH_USER_ID_KEY, String(userId))
    localStorage.removeItem(LEGACY_AUTH_USER_ID_KEY)
  }
}