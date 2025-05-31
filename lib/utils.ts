import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if a string is a valid SUI address format
 * SUI addresses are 32 bytes (64 hex characters) prefixed with 0x
 * @param address - The address string to validate
 * @returns boolean - true if valid SUI address format
 */
export function isValidSuiAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false

  // Single regex to validate SUI address format: 0x followed by exactly 64 hex characters
  const suiAddressRegex = /^0x[0-9a-fA-F]{64}$/
  return suiAddressRegex.test(address.trim())
}
