import type { UserType } from 'src/types/main.types';
import type { IMainUserInfo } from 'src/types/user.types';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const initialState: IMainUserInfo = {
  token: null,
  id: 0,
  name: '',
  phone: '',
  email: '',
  image: '',
  active_status: 2,
  country_id: '',
  timezone: '',
  apply_new_register: 0,
  is_dismiss_new_register: 0,
  country: null,
  country_code_external: '',
  city_id: '',
  address: '',
  user_tags: [],
  city: null,
  company: null,
  company_country_id: '',
  user_type: null as unknown as UserType,
  company_country: null,
  is_plus: 0,
  plus_price_permission: 0,
  roles: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    hydrateFromProfile: (state, action: PayloadAction<Partial<IMainUserInfo>>) => {
      const { ...profileData } = action.payload;
      Object.assign(state, profileData);
    },
    login: (state, action) => {
      state.token = action?.payload?.token;
      state.id = action?.payload?.id;
      state.name = action?.payload?.name;
      state.phone = action?.payload?.phone;
      state.email = action?.payload?.email;
      state.image = action?.payload?.image;
      state.country_id = action?.payload?.country?.id;
      state.country = action?.payload?.country;
      state.company = action?.payload?.company ?? null;
      state.company_country_id = action?.payload?.company?.country?.id;
      state.city_id = action?.payload?.city?.id;
      state.address = action?.payload?.address;
      state.user_tags = action?.payload?.user_tags;
      state.active_status = action?.payload?.active_status;
      state.timezone = action?.payload?.timezone;
      state.apply_new_register = action?.payload?.apply_new_register;
      state.country = action?.payload?.country;
      state.city = action?.payload?.city;
      state.country_code_external = '';
      state.user_type = action?.payload?.user_type;
      state.is_plus = action?.payload?.is_plus;
      state.plus_price_permission = action?.payload?.plus_price_permission;
      state.roles = action?.payload?.roles ?? null;
    },
    logout: (state) => {
      state.token = null;
      state.id = 0;
      state.name = '';
      state.phone = '';
      state.email = '';
      state.image = '';
      state.active_status = 2;
      state.country_id = '';
      state.timezone = '';
      state.apply_new_register = 0;
      state.is_dismiss_new_register = 0;
      state.country = null;
      state.country_code_external = state?.country_code_external || '';
      state.city_id = '';
      state.address = '';
      state.user_tags = [];
      state.city = null;
      state.company = null;
      state.company_country_id = '';
      state.user_type = null as unknown as UserType;
      state.is_plus = 0;
      state.plus_price_permission = 0;
      state.roles = null;
    },
    applyNewRegister: (state) => {
      state.apply_new_register = 1;
    },
    dismissNewRegister: (state) => {
      state.apply_new_register = 2;
    },
    setCountryCodeExternal: (state, action) => {
      state.country_code_external = action.payload;
    },
    setActiveStatus: (state, action) => {
      state.active_status = action?.payload;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
