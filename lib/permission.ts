/*Enhance permission.ts for better maintainability and type safety*/
// Define permission types more explicitly
export const Permissions = {
  // Universal permissions (available to all authenticated users)
  UNIVERSAL: {
    VIEW_CALENDAR: 'view-calendar',
    VIEW_WORK_ORDERS: 'view-work-orders',
  },
  // Role-specific permissions
  WORK_ORDERS: {
    CREATE: 'create-work-orders',
    EDIT: 'edit-work-orders',
  },
  MANAGEMENT: {
    MANAGE_USERS: 'manage-users',
    MANAGE_EQUIPMENT: 'manage-equipment',
    ASSIGN_TECHNICIANS: 'assign-technicians',
  },
} as const;

// Create a union type of all permission values
export type Permission = 
  | 'view-calendar'
  | 'view-work-orders'
  | 'create-work-orders'
  | 'edit-work-orders'
  | 'manage-users'
  | 'manage-equipment'
  | 'assign-technicians';

// Define role permissions more explicitly
const rolePermissions: Record<string, Permission[]> = {
  ADMIN: [
    Permissions.UNIVERSAL.VIEW_CALENDAR,
    Permissions.UNIVERSAL.VIEW_WORK_ORDERS,
    Permissions.WORK_ORDERS.CREATE,
    Permissions.WORK_ORDERS.EDIT,
    Permissions.MANAGEMENT.MANAGE_USERS,
    Permissions.MANAGEMENT.MANAGE_EQUIPMENT,
    Permissions.MANAGEMENT.ASSIGN_TECHNICIANS,
  ],
  SUPERVISOR: [
    Permissions.UNIVERSAL.VIEW_CALENDAR,
    Permissions.UNIVERSAL.VIEW_WORK_ORDERS,
    Permissions.WORK_ORDERS.EDIT,
    Permissions.MANAGEMENT.MANAGE_EQUIPMENT,
    Permissions.MANAGEMENT.ASSIGN_TECHNICIANS,
  ],
  TECHNICIAN: [
    Permissions.UNIVERSAL.VIEW_CALENDAR,
    Permissions.UNIVERSAL.VIEW_WORK_ORDERS,
  ],
};

export function hasPermission(userRole: string | undefined, permission: Permission): boolean {
  if (!userRole) return false;
  return rolePermissions[userRole]?.includes(permission) ?? false;
} 