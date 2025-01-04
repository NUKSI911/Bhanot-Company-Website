import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export const formatNumberWithDecimal = (num: number) => {
  const [int, decimal] = num.toString().split(".");
  return `${int}.${decimal.slice(0, 2)}`;
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
};
