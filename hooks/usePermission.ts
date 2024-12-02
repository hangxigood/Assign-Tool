import { useSession } from "next-auth/react";
import { Permission, hasPermission } from "@/lib/permission";

export function usePermission(permission: Permission) {
  const { data: session } = useSession();
  return hasPermission(session?.user?.role, permission);
}