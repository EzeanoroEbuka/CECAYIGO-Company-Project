export type Role = "admin" | "customer";

export const isRole = (value: unknown): value is Role =>
  value === "admin" || value === "customer";
