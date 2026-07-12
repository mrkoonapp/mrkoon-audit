import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

export type DashboardView = 'ecommerce' | 'analytics' | 'banking' | 'booking' | 'file' | 'course';

export interface DashboardState {
  selectedView: DashboardView;
  dateRange: {
    start: string | null;
    end: string | null;
  };
  filters: {
    showOnlyActive: boolean;
    sortBy: 'newest' | 'oldest' | 'popular';
  };
  preferences: {
    compactMode: boolean;
    showNotifications: boolean;
    autoRefresh: boolean;
    refreshInterval: number; // in seconds
  };
}

const initialState: DashboardState = {
  selectedView: 'ecommerce',
  dateRange: {
    start: null,
    end: null,
  },
  filters: {
    showOnlyActive: true,
    sortBy: 'newest',
  },
  preferences: {
    compactMode: false,
    showNotifications: true,
    autoRefresh: false,
    refreshInterval: 30,
  },
};

// ----------------------------------------------------------------------

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedView: (state, action: PayloadAction<DashboardView>) => {
      state.selectedView = action.payload;
    },
    setDateRange: (state, action: PayloadAction<{ start: string | null; end: string | null }>) => {
      state.dateRange = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<DashboardState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPreferences: (state, action: PayloadAction<Partial<DashboardState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    toggleCompactMode: (state) => {
      state.preferences.compactMode = !state.preferences.compactMode;
    },
    toggleNotifications: (state) => {
      state.preferences.showNotifications = !state.preferences.showNotifications;
    },
    toggleAutoRefresh: (state) => {
      state.preferences.autoRefresh = !state.preferences.autoRefresh;
    },
    resetDashboard: () => initialState,
  },
});

// ----------------------------------------------------------------------

export const {
  setSelectedView,
  setDateRange,
  setFilters,
  setPreferences,
  toggleCompactMode,
  toggleNotifications,
  toggleAutoRefresh,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
