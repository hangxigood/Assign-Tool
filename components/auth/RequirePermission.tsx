/*Create a higher-order component for protecting routes*/
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Permission, hasPermission } from "@/lib/permission";
import { ReactNode } from "react";

interface RequirePermissionProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function RequirePermission({ 
  permission, 
  children, 
  fallback 
}: RequirePermissionProps) {
  const { data: session, status } = useSession();
  
  if (status === "loading") {
    return null;
  }

  if (!session) {
    redirect("/login");
  }

  if (!hasPermission(session.user.role, permission)) {
    return fallback || <div>You don't have permission to access this resource.</div>;
  }

  return <>{children}</>;
}