import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ilike as _ilike, sql } from 'drizzle-orm';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ilike(
  column: Parameters<typeof _ilike>[0],
  value: Parameters<typeof _ilike>[1],
) {
  // like(column, `%${value}%`)
  return sql`${column} LIKE ${value} COLLATE NOCASE`;
}
