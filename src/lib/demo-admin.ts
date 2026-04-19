export const DEMO_ADMIN = {
  email: "vanshika@gmail.com",
  password: "vanshika1031",
  name: "Vanshika",
} as const;

export function isDemoAdminEmail(email: string) {
  return email.trim().toLowerCase() === DEMO_ADMIN.email;
}
