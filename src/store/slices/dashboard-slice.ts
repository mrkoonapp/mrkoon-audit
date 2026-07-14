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
  toggleAutoRefresh,
  resetDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
