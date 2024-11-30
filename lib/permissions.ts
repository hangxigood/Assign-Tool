/*
These 2 are universal permissions
'view-calendar'
'view-work-orders'
*/
export type Permission = 
  | 'create-work-orders'
  | 'edit-work-orders'
  | 'manage-users'
  | 'manage-equipment'
  | 'assign-technicians';

const rolePermissions: Record<string, Permission[]> = {
  ADMIN: [
    'create-work-orders',
    'edit-work-orders',
    'manage-users',
    'manage-equipment',
    'assign-technicians'
  ],
  SUPERVISOR: [
    'edit-work-orders',
    'manage-equipment',
    'assign-technicians'
  ],
  TECHNICIAN: []
};

export function hasPermission(userRole: string | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return rolePermissions[userRole]?.includes(permission) ?? false;
} 