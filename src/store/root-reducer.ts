import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { combineReducers } from '@reduxjs/toolkit';

import userSlice from './slices/user-slice';
import dashboardReducer from './slices/dashboard-slice';
import userPreferencesReducer from './slices/user-preferences-slice';

// ----------------------------------------------------------------------

// Redux persist configurations for different slices
const dashboardPersistConfig = {
  key: 'dashboard',
  storage,
  whitelist: ['selectedView', 'preferences'], // Only persist these fields
};

const userPreferencesPersistConfig = {
  key: 'userPreferences',
  storage,
  whitelist: ['language', 'currency', 'timezone', 'notifications', 'display'], // Persist all fields
};

const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['unread_notification_count'], // Don't persist notification count (fetch fresh)
};

// ----------------------------------------------------------------------

// Combine reducers with persistence
const rootReducer = combineReducers({
  dashboard: persistReducer(dashboardPersistConfig, dashboardReducer),
  userPreferences: persistReducer(userPreferencesPersistConfig, userPreferencesReducer),
  user: persistReducer(userPersistConfig, userSlice.reducer),
});

export default rootReducer;
