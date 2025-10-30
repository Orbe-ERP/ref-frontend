export const userRoutes = [
  "/user/home",
  "/user/profile",
  "/user/orders",
];

export const adminRoutes = [
  "/admin/dashboard",
  "/admin/restaurants",
  "/admin/users",
];

export function canAccessRoute(role: string, pathname: string) {
  if (role === "ADMIN") {
    return adminRoutes.includes(pathname);
  } else if (role === "USER") {
    return userRoutes.includes(pathname);
  }
  return false;
}
