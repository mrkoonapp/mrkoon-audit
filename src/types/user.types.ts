import type {
  Admin,
  ITags,
  District,
  ICountry,
  UserType,
  ICategory,
  ILanguage,
  AddsEntity,
  CityOrUnit,
  ITicketSize,
  MainAddressOrAddress,
} from './main.types';

export interface IUserRole {
  id: number;
  name: string;
  permissions: string[];
}

export interface IUserCompany {
  id: number;
  name: string;
  email: string;
  phone: string;
  logo: string;
  job_position: string;
  owner: IUser;
}

export interface IMainUserInfo {
  id: number;
  name: string;
  image: string;
  phone: string;
  email: string;
  token?: string | null;
  active_status: 1 | 2;
  country_id: string;
  isDemo?: number;
  timezone?: string;
  apply_new_register?: number;
  is_dismiss_new_register?: number;
  country: ICountry | null;
  country_code_external: string;
  city_id: string;
  address: string;
  user_tags: IUserTags[];
  city: CityOrUnit | null;
  company: IUserCompany | null;
  company_country_id: string;
  user_type: UserType;
  company_country: ICountry | null;
  is_plus: number;
  plus_price_permission: number;
  unread_notification_count?: number;
  roles: IUserRole | null;
}
export interface IUser {
  active_status: number;
  active_code: number;
  added_tax_number: string;
  adds: AddsEntity[];
  admin: Admin;
  adminAfterDistribute: Admin;
  admin_login_token: string;
  apply_new_register: number;
  cats: ICategory[];
  commercial_register: string;
  company: IUserCompany | null;
  company_name: string;
  company_logo: string;
  contact_status: number;
  country: ICountry;
  created_at: string;
  electronic_invoice: string;
  email: string;
  export_description: string;
  fire_base_token: string;
  id: number;
  image: string;
  import_description: string;
  individual_or_company: number;
  is_dismiss_new_register: number;
  is_downloaded_app: number;
  lang: string;
  mainAddress: MainAddressOrAddress;
  name: string;
  phone: string;
  platform: string;
  rate: number;
  reason_for_inactive: string;
  status: number;
  tax_card: string;
  ticket_size: ITicketSize;
  token: string;
  unread_notification_count: number;
  uploaded_papers_percentage: number;
  user_tags: ITags[];
  user_type: UserType;
  wallet: number;
  password_code: number;
  is_plus: number;
  role?: IUserRole | null;
}
export interface UserDTO {
  lead_id?: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  password: string;
  status: string | number;
  commercial_register: string;
  tax_card: string;
  added_tax_number: string;
  electronic_invoice: string;
  adds: {
    key: string;
    value: string;
  }[];
  image: string;
  company_logo: string;
  individual_or_company: string;
  address: string;
  city_id: string | number;
  district_id?: District;
  cats?: { id: number; name: string }[];
  user_tags: IUserTags[];
  user_type_id: string | number;
  sub_user_type?: string;
  reason_for_inactive?: string;
  country_id: number | string;
  export_description: string;
  import_description: string;
  admin_id?: number | null;
  ticket_size_id?: ITicketSize;
}

export interface IUserTags {
  id: number;
  is_primary: number;
  tag?: ITags;
}

export interface ProfileDTO {
  // Company fields
  company_name?: string;
  company_logo?: string;
  company_email?: string;
  company_phone?: string;
  company_country_id?: string | ICountry;
  user_type_id?: string;

  // User fields
  name?: string;
  phone?: string;
  email?: string;
  country_id?: number | string | ICountry;
  image?: string;
  job_position?: string;
}

export interface InterestsDTO {
  user_tags: { tag_id: number; is_primary: number }[];
}

export interface IUserPapers {
  id: number;
  name: ILanguage;
  is_required: number;
  user_papers: ISingleUserPaper[];
}

export interface IUserPapersProps {
  page?: number;
  limit?: number;
}
export interface ISingleUserPaper {
  id: number;
  created_at: string;
  file: string;
  is_uploaded: number;
  note: string;
  number: number;
}
