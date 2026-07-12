import type { PermissionKey } from 'src/sections/users-permissions/types';

import { usePermissions } from 'src/hooks/use-permissions';

// ----------------------------------------------------------------------

type CanProps = {
  children: React.ReactNode;
  permission: PermissionKey | PermissionKey[];
  /** When `permission` is an array, require all keys instead of any. */
  requireAll?: boolean;
  fallback?: React.ReactNode;
};

export function Can({ children, permission, requireAll, fallback = null }: CanProps) {
  const { has, hasAny, hasAll } = usePermissions();

  const allowed = Array.isArray(permission)
    ? requireAll
      ? hasAll(permission)
      : hasAny(permission)
    : has(permission);

  return <>{allowed ? children : fallback}</>;
}
