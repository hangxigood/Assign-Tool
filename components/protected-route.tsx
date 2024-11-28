'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Permission, hasPermission } from "@/lib/permissions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission: Permission;
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && !hasPermission(session?.user?.role, requiredPermission)) {
      setShowAlert(true);
    }
  }, [status, session, requiredPermission]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push('/api/auth/signin');
    return null;
  }

  return (
    <>
      {hasPermission(session?.user?.role, requiredPermission) ? (
        children
      ) : (
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Access Denied</AlertDialogTitle>
              <AlertDialogDescription>
                You are not authorized to access this feature. Please contact your administrator if you believe this is a mistake.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.push('/')}>Return to Home</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}