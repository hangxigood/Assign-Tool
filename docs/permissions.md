# Permission System Documentation

## Overview

The permission system provides role-based access control (RBAC) through two main components:
- `usePermission` hook for conditional rendering
- `RequirePermission` component for protecting routes/components

## Usage

### Checking Permissions

```tsx
// Using the hook
const canEditOrders = usePermission('edit-work-orders');

// Using the component
<RequirePermission permission="create-work-orders">
  <CreateOrderForm />
</RequirePermission>
```

### Available Permissions

- Universal
  - `view-calendar`: View the calendar
  - `view-work-orders`: View work orders list

- Work Orders
  - `create-work-orders`: Create new work orders
  - `edit-work-orders`: Edit existing work orders

- Management
  - `manage-users`: Manage user accounts
  - `manage-equipment`: Manage equipment
  - `assign-technicians`: Assign technicians to work orders

### Role Permissions

| Permission          | Admin | Supervisor | Technician |
|--------------------|-------|------------|------------|
| view-calendar      | ✓     | ✓          | ✓         |
| view-work-orders   | ✓     | ✓          | ✓         |
| create-work-orders | ✓     | ✕          | ✕         |
| edit-work-orders   | ✓     | ✓          | ✕         |
| manage-users       | ✓     | ✕          | ✕         |
| manage-equipment   | ✓     | ✓          | ✕         |
| assign-technicians | ✓     | ✓          | ✕         |

## Best Practices

1. Use `RequirePermission` for:
   - Page-level protection
   - Complete component protection
   - When you need fallback content

2. Use `usePermission` for:
   - Fine-grained UI control
   - Multiple permission checks
   - Performance-critical sections