import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

export interface UserPreferencesState {
  language: string;
  currency: string;
  timezone: string;
  display: {
    density: 'comfortable' | 'compact' | 'standard';
    sidebarCollapsed: boolean;
    chartType: 'line' | 'bar' | 'area';
  };
}

const initialState: UserPreferencesState = {
  language: 'en',
  currency: 'USD',
  timezone: 'UTC',
  display: {
    density: 'standard',
    sidebarCollapsed: false,
    chartType: 'line',
  },
};

// ----------------------------------------------------------------------

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload;
    },
    setDisplay: (state, action: PayloadAction<Partial<UserPreferencesState['display']>>) => {
      state.display = { ...state.display, ...action.payload };
    },
    toggleSidebar: (state) => {
      state.display.sidebarCollapsed = !state.display.sidebarCollapsed;
    },
    resetPreferences: () => initialState,
  },
});

// ----------------------------------------------------------------------

export const {
  setLanguage,
  setCurrency,
  setTimezone,
  setDisplay,
  toggleSidebar,
  resetPreferences,
} = userPreferencesSlice.actions;

export default userPreferencesSlice.reducer;
