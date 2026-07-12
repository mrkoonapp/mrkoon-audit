import type { IUser } from './user.types';

export interface ILanguage {
  ar: string;
  en: string;
  fr: string;
  'ar-EG'?: string;
  'ar-SA'?: string;
}
export interface IUnitsFilters {
  search_text?: string;
  page?: number;
  limit?: number;
}

export interface IAdminApproval {
  id: number;
  product_id: number;
  admin_approval_key: 'pending' | 'approved' | 'rejected';
  admin_approval_status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface IProduct {
  created_at: string;
  is_signed: number;
  views: number;
  city: CityOrUnit;
  insurance_status: number;
  id: number;
  is_fav: boolean;
  timeRemaining: TimeRemaining;
  country: ICountry;
  name: ILanguage;
  logo: string;
  company_logo: string;
  conditions_document?: null;
  pdf: string;
  description: ILanguage;
  masafa_price: string;
  start_price: string;
  step_price: string;
  quantity: string;
  is_green: number;
  type: number;
  is_paid_conditions_document: number;
  price_type: number;
  lot: number;
  sort: number;
  price: string;
  website_price: string;
  real_price: string;
  mazad_type: number;
  show_company: number;
  has_conditions_document: number;
  conditions_document_price: string;
  end_date: string;
  less_quantity: string;
  high_price: string;
  unit: CityOrUnit;
  category: ICategory;
  parent_cat_id: number;
  parent_id: number;
  status: Status;
  address: MainAddressOrAddress;
  user: IUser;
  images: ImagesEntity[];

  statistics: {
    key: ILanguage;
    value: ILanguage;
  }[];

  auctions: any[];
  adds?: {
    id: number;
    key: ILanguage;
    value: ILanguage;
  }[];
  tags?: ITags[] | null;
  admin: Admin;
  products?: IProduct[] | null;
  url: string;
  unique_code: string;
  three_D_link?: string;
  tag: ITags;
  duration: number;
  auctionsCount: number;
  inspectionCount: number;
  auction_report?: string;
  papers?: ISystemPapers[];
  related_data?: IAdminApproval;
  target_price?: number;
}
// export interface IMainUserInfo {
//   id: number;
//   name: string;
//   image: string;
//   company_logo: string;
//   phone: string;
//   email: string;
//   company_name: string;
//   token?: string | null;
//   active_status: 1 | 2;
//   country_id: string;
//   isDemo?: number;
//   timezone?: string;
//   apply_new_register?: number;
//   is_dismiss_new_register?: number;
//   country: ICountry | null;
//   country_code_external: string;
// }
export interface TimeRemaining {
  differenceInMilliseconds: number;
  remainingTime: string;
}
export interface CityOrUnit {
  id: number;
  name: ILanguage;
  country: ICountry;
}
export interface IDistrict {
  id: number;
  name: ILanguage;
  city: CityOrUnit;
}
export interface IBrand {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
}

export interface Asks {
  id: number;
  question: ILanguage;
  explanation: ILanguage;
}

export interface IStagnant {
  id: number;
  name: ILanguage;
  code: string;
  quantity: string;
  unit: CityOrUnit;
}
export interface ICategory {
  id: number;
  type: number;
  level: number;
  name: ILanguage;
  icon: string;
  description: ILanguage;
  stagnant_count: number;
  images: ImagesEntity[];
  parent?: {
    id: number;
    name: ILanguage;
  };
  cats?:
    | {
        id: number;
        name: ILanguage;
      }[]
    | [];
}
export interface Status {
  id: number;
  bid: number;
  show_name: number;
  show_price: number;
  show_status: number;
  show_countdown: number;
  show_price_list: number;
  show_price_for_seller: number;
  send_message: number;
  is_pay_conditions_document: number;
  msg_all_less_price_when_change: number;
  class: string;
  color: string;
  name: ILanguage;
  button: ILanguage;
  dark_background_back_color: string;
  background_back_color: string;
  dark_color: string;
}
export interface MainAddressOrAddress {
  id: number;
  lat?: number | string | null;
  lng?: number | string | null;
  address: string;
  note?: null;
  city: CityOrUnit;
  district: District;
  main: number;
  name?: string;
  description?: string;
  products?: IProduct[];
  products_count?: number;
}
export interface WarehouseAddress {
  id: number;
  lat?: number | string | null;
  lng?: number | string | null;
  address: string;
  note?: null;
  city: CityOrUnit | string;
  district: District | string;
  main: number;
  name?: string;
  description?: string;
  products?: IProduct[];
  products_count?: number;
}
export interface ICatAndTagsFilters {
  search_text?: string;
  page?: number;
  limit?: number;
  type?: string;
}
export interface AddressDTO {
  country: string;
  address_id?: string | number;
  address: string;
  city: string;
  district: string;
  lat?: number | null;
  lng?: number | null;
  note?: string | null;
  main?: number;
  name?: string;
  description?: string;
}

// export interface IUser {
//   id: number;
//   name: string;
//   image: string;
//   company_logo: string;
//   phone: string;
//   email: string;
//   company_name: string;
//   user_type: UserType;
//   status: number;
//   active_status: number;
//   active_code: number;
//   password_code: number;
//   individual_or_company: number;
//   rate: number;
//   fire_base_token?: null;
//   commercial_register?: null;
//   tax_card?: null;
//   added_tax_number?: null;
//   electronic_invoice?: null;
//   created_at: string;
//   admin_login_token?: null;
//   token?: null;
//   adds?: AddsEntity[] | null;
//   cats?: null[] | null;
//   mainAddress: MainAddressOrAddress;
//   apply_new_register: number;
// }
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
export interface AddsEntity {
  id: number;
  key: ILanguage;
  value: ILanguage;
}
export interface ImagesEntity {
  id: number;
  image: string;
  file_type: number;
}
export interface Admin {
  id: number;
  name: string;
  status: number;
  code: number;
  phone: string;
  email: string;
  fire_base?: null;
  image: string;
  token?: null;
  roles?: string[] | null;
}

export interface IAuction {
  buyer: IUser | null;
  created_at: string;
  firebaseKey: string;
  id: number;
  masafa_price: string;
  show_date: string;
  my_price: string;
  product: IProduct;
  quantity: string;
  seller: IUser | null;
  seller_price: string;
  buyer_price: string;
  status: {
    id: number;
    bid: number;
    show_name: number;
    show_price: number;
    show_status: number;
    show_countdown: number;
    show_price_list: number;
  };
  total_price: string;
  buyer_id: number;
  company_id: number;
  is_verified?: boolean | number;
}

export interface IWebsiteAuction {
  price: string;
  created_at?: string;
  id: number | string;
  bidderId: number | string;
  company_id: number | string;
  show_date?: string;
  is_verified?: boolean;
}

export interface ICart {
  totalPrice: number;
  data: ICartItem[];
}

export interface ICartItem {
  id: number;
  product: IProduct;
  quantity: string;
  product_price_with_masafa: string;
}

export interface IBlog {
  id: number;
  title: ILanguage;
  description: ILanguage;
  image: string;
  date: string;
}

export interface IWhyMarkoon {
  id: number;
  type: 1 | 2;
  title: ITranslatedText;
  icon: string;
  description: ITranslatedText;
}
export interface ITestimonial {
  id: number;
  name: string;
  title: ILanguage;
  description: ILanguage;
  icon: string;
  image: string;
}

export interface IPartner {
  id: number;
  logo: string;
}
export interface ITranslatedText {
  ar: string;
  en: string;
  fr: string;
}

export interface ISliderItem {
  id: number;
  type: 1 | 2; // 1 for image, 2 for video
  title: ILanguage | null;
  desc: ILanguage | null;
  button: ILanguage | null;
  image: string;
  button_link: string | null;
}

export interface INumber {
  id: number;
  comment: ILanguage;
  number: string;
  unit?: ILanguage;
}

export interface IFirebaseAuction {
  auction_id: string;
  buyer_id: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_price: string;
  created_at: object | string;
  id: number;
  quantity: string;
  company_id: number;
  seller_price: string;
  created_at_formatted: string;
}

export interface ICountry {
  id: number;
  name: ILanguage;
  icon: string;
  status: number;
  country_code: string;
  phone_numbers: number;
  countryID: string;
  global_code: string;
  currency_name: ILanguage;
  currency_icon: string;
}

export interface ISession {
  id: number;
  end_date: string;
  status: 1 | 2;
  name: string;
  session_numbers: ISessionNumber[];
}

export interface ISessionNumber {
  id: number;
  phone_number: number;
  country: ICountry;
}

export interface ISystemPapers {
  id: number;
  name: ILanguage;
  is_required: number;
}

export interface ITags {
  id: number;
  name: ILanguage;
  icon: string;
  level: number;
  status: number;
  parent: {
    id: number;
    name: ILanguage;
  };
  tags: ITags[];
  group?: {
    id: number;
    name: ILanguage;
    created_at: string;
  } | null;
}
export interface ITagsGroups {
  id: number;
  name: ILanguage;
  created_at: string;
  tags: ITags[];
}
export interface IInformation {
  ourNumbersTitle: ILanguage;
  id: number;
  whyMrkoon_title: ILanguage;
  ourNumbers_desc: ILanguage;
  ourNumbers_title: ILanguage;
  testimonial_title: ILanguage;
  blog_title: ILanguage;
  join_title: ILanguage;
  join_desc: ILanguage;
  footer: ILanguage;
  wahtsapp: string;
  facebook: string;
  instagram: string;
  email: string;
  linked_in: string;
  file: string | null;
  our_partner_title: ILanguage;
  our_partner_desc: ILanguage;
  blog_desc: ILanguage;
}

export interface ISettings {
  id: number;
  wahtsapp: string;
  interests_number: number;
  facebook: string;
  instagram: string;
  email: string;
  construction_materials: number;
  show_prices_guests: number;
  about: ILanguage;
  about_title: ILanguage;
  privacy: ILanguage;
  rwaked_bar: string;
  korda_bar: string;
  rwaked_menu: string;
  korda_menu: string;
  information: IInformation;
}

export interface IRevolutionScraps {
  id: number;
  title: ITranslatedText;
  description: ITranslatedText;
  icon: string;
}

export interface ITags {
  id: number;
  name: ILanguage;
  icon: string;
  level: number;
  status: number;
  parent: {
    id: number;
    name: ILanguage;
  };
  tags: ITags[];
  group?: {
    id: number;
    name: ILanguage;
    created_at: string;
  } | null;
}

export interface ITicketSize {
  id: number;
  name: ILanguage;
}

export interface District {
  id: number;
  name: ILanguage;
}

export interface IDistrictsFilters {
  search_text?: string;
  page?: number;
  limit?: number;
  city_id?: string | number;
}

export interface IPagination {
  count: number;
  current_page: number;
  is_pagination: boolean;
  per_page: number;
  total: number;
  total_pages: number;
}
