import type { IUserTags } from 'src/types/user.types';
import type { ICountry, ILanguage } from 'src/types/main.types';

// ----------------------------------------------------------------------

export interface UserType {
  id: number;
  title: ILanguage;
  icon: string;
  level: number;
  show_price: number;
  user_count: number;
  parent_id: number;
  subTypes?: SubTypesEntity[] | null;
}

export interface SubTypesEntity {
  id: number;
  title: ILanguage;
  icon: string;
  level: number;
  show_price: number;
  user_count: number;
  parent_id: number;
  subTypes?: null[] | null;
}

export interface IUserCompany {
  id: number;
  name: string;
  email: string;
  phone: string;
  logo: string;
  job_position: string;
  country: ICountry;
}

export interface UserInfo {
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
  city: string | null;
  company: IUserCompany | null;
  company_country_id: string;
  user_type: UserType;
  is_plus: number;
  plus_price_permission: number;
  unread_notification_count?: number;
}
