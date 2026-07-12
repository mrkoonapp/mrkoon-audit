import type { RootState } from 'src/store';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

// ----------------------------------------------------------------------

export function usePermissions() {
  const role = useSelector((state: RootState) => state.user.roles);
  const permissionsSet = useMemo(() => new Set(role?.permissions ?? []), [role?.permissions]);

  return useMemo(
    () => ({
      permissions: role?.permissions ?? [],
      has: (key: string) => permissionsSet.has(key),
      hasAny: (keys: string[]) => keys.some((k) => permissionsSet.has(k)),
      hasAll: (keys: string[]) => keys.every((k) => permissionsSet.has(k)),
    }),
    [role?.permissions, permissionsSet]
  );
}
