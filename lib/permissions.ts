export type Permission = 
  | 'view-calendar'
  | 'view-work-orders'
  | 'create-work-orders'
  | 'edit-work-orders'
  | 'manage-users'
  | 'manage-equipment'
  | 'assign-technicians';

const rolePermissions: Record<string, Permission[]> = {
  ADMIN: [
    'view-calendar',
    'view-work-orders',
    'create-work-orders',
    'edit-work-orders',
    'manage-users',
    'manage-equipment',
    'assign-technicians'
  ],
  SUPERVISOR: [
    'view-calendar',
    'view-work-orders',
    'edit-work-orders',
    'manage-equipment',
    'assign-technicians'
  ],
  TECHNICIAN: [
    'view-calendar',
    'view-work-orders'
  ]
};

export function hasPermission(userRole: string | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return rolePermissions[userRole]?.includes(permission) ?? false;
} 