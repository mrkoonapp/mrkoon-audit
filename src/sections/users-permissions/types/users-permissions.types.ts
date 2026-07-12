import type { IPagination } from 'src/types/main.types';

// ----------------------------------------------------------------------

export interface IPermission {
  id: number;
  key: string;
  name: string;
}

export interface IRoleCompany {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  logo: string | null;
}

export interface IRole {
  id: number;
  name: string;
  company?: IRoleCompany;
  permissions: string[];
  created_at?: string;
  employees_count?: number;
  employees?: IEmployee[];
}

export interface IEmployee {
  id: number;
  name: string;
  email: string;
  phone: string;
  image?: string | null;
  country_id?: number | string | null;
  country?: { id: number; name: string; icon?: string; country_code?: string } | null;
  role_id?: number | null;
  role?: IRole | { id: number; name: string } | null;
  active_status?: number;
  status?: number;
  created_at?: string;
}

// ----------------------------------------------------------------------

export interface IEmployeesFilters {
  search_text?: string;
  role_id?: string;
  status_id?: string;
  limit: number;
  page: number;
}

export interface IEmployeesResponse {
  data: IEmployee[];
  pagination: IPagination;
}

export interface IRolesResponse {
  data: IRole[];
  pagination?: IPagination;
}

// ----------------------------------------------------------------------

export interface ICreateEmployeePayload {
  name: string;
  email: string;
  phone: string;
  country_id: number | string;
  role_id: number | string;
}

export interface IUpdateEmployeePayload extends Partial<ICreateEmployeePayload> {
  id: number | string;
}

export interface ICreateRolePayload {
  name: string;
  permissions?: string[];
}

export interface IUpdateRolePayload {
  id: number | string;
  name?: string;
  permissions?: string[];
}

export interface IUsersPermissionsHeader {
  users_count: number;
  roles_count: number;
  roles: IHeaderRole[];
}

export interface IHeaderRole {
  id: number;
  name: string;
  users_count: number;
  users_images: (string | null)[];
}

export enum USER_STATUS_ENUM {
  activated = 1,
  notActivated = 2,
  new = 3,
  noRespond = 4,
  paysCondition = 5,
  contacting = 6,
}

export enum PERMISSION_KEYS {
  PRODUCTS = 'product',
  PERMISSIONS = 'roles',
  REPORTS = 'reports',
  TRANSACTIONS = 'transactions',
  WAREHOUSE = 'warehouse',
}

export enum PERMISSION_ACTIONS {
  VIEW = 'view',
  CREATE = 'create',
  UPDATE = 'edit',
  DELETE = 'delete',
}

export type PermissionKey = `${PERMISSION_KEYS}.${PERMISSION_ACTIONS}`;

export const PERMISSIONS = {
  products: {
    view: `${PERMISSION_KEYS.PRODUCTS}.${PERMISSION_ACTIONS.VIEW}`,
    create: `${PERMISSION_KEYS.PRODUCTS}.${PERMISSION_ACTIONS.CREATE}`,
    edit: `${PERMISSION_KEYS.PRODUCTS}.${PERMISSION_ACTIONS.UPDATE}`,
    delete: `${PERMISSION_KEYS.PRODUCTS}.${PERMISSION_ACTIONS.DELETE}`,
  },
  permissions: {
    view: `${PERMISSION_KEYS.PERMISSIONS}.${PERMISSION_ACTIONS.VIEW}`,
    create: `${PERMISSION_KEYS.PERMISSIONS}.${PERMISSION_ACTIONS.CREATE}`,
    edit: `${PERMISSION_KEYS.PERMISSIONS}.${PERMISSION_ACTIONS.UPDATE}`,
    delete: `${PERMISSION_KEYS.PERMISSIONS}.${PERMISSION_ACTIONS.DELETE}`,
  },
  reports: {
    view: `${PERMISSION_KEYS.REPORTS}.${PERMISSION_ACTIONS.VIEW}`,
    create: `${PERMISSION_KEYS.REPORTS}.${PERMISSION_ACTIONS.CREATE}`,
    edit: `${PERMISSION_KEYS.REPORTS}.${PERMISSION_ACTIONS.UPDATE}`,
    delete: `${PERMISSION_KEYS.REPORTS}.${PERMISSION_ACTIONS.DELETE}`,
  },
  transactions: {
    view: `${PERMISSION_KEYS.TRANSACTIONS}.${PERMISSION_ACTIONS.VIEW}`,
    create: `${PERMISSION_KEYS.TRANSACTIONS}.${PERMISSION_ACTIONS.CREATE}`,
    edit: `${PERMISSION_KEYS.TRANSACTIONS}.${PERMISSION_ACTIONS.UPDATE}`,
    delete: `${PERMISSION_KEYS.TRANSACTIONS}.${PERMISSION_ACTIONS.DELETE}`,
  },
  warehouse: {
    view: `${PERMISSION_KEYS.WAREHOUSE}.${PERMISSION_ACTIONS.VIEW}`,
    create: `${PERMISSION_KEYS.WAREHOUSE}.${PERMISSION_ACTIONS.CREATE}`,
    edit: `${PERMISSION_KEYS.WAREHOUSE}.${PERMISSION_ACTIONS.UPDATE}`,
    delete: `${PERMISSION_KEYS.WAREHOUSE}.${PERMISSION_ACTIONS.DELETE}`,
  },
} as const satisfies Record<string, Record<string, PermissionKey>>;
