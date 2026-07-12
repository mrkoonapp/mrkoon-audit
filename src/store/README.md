# Redux Store Documentation

This directory contains the Redux store configuration with Redux Persist for state management across the dashboard application.

## Structure

```
src/store/
├── slices/
│   ├── dashboard-slice.ts          # Dashboard settings and preferences
│   └── user-preferences-slice.ts   # User-specific preferences
├── root-reducer.ts                 # Combines all reducers with persist config
├── store.ts                        # Store configuration
├── hooks.ts                        # Typed hooks for Redux
└── index.ts                        # Barrel exports
```

## Features

### Redux Toolkit
- Modern Redux with simplified configuration
- Built-in support for immutable updates
- TypeScript support out of the box

### Redux Persist
- Automatically persists state to localStorage
- Rehydrates state on app reload
- Configurable per-slice persistence

## Usage

### 1. Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { setSelectedView, toggleCompactMode } from 'src/store/slices/dashboard-slice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const dashboard = useAppSelector((state) => state.dashboard);

  const handleViewChange = (view: DashboardView) => {
    dispatch(setSelectedView(view));
  };

  return (
    <div>
      <p>Current view: {dashboard.selectedView}</p>
      <button onClick={() => dispatch(toggleCompactMode())}>
        Toggle Compact Mode
      </button>
    </div>
  );
}
```

### 2. Available Slices

#### Dashboard Slice
Manages dashboard-specific settings:
- Selected dashboard view
- Date range filters
- Filter preferences
- UI preferences (compact mode, notifications, auto-refresh)

**Actions:**
- `setSelectedView(view)` - Change dashboard view
- `setDateRange({ start, end })` - Set date range
- `setFilters(filters)` - Update filters
- `setPreferences(prefs)` - Update preferences
- `toggleCompactMode()` - Toggle compact mode
- `toggleNotifications()` - Toggle notifications
- `toggleAutoRefresh()` - Toggle auto-refresh
- `resetDashboard()` - Reset to initial state

#### User Preferences Slice
Manages user-specific settings:
- Language and localization
- Currency settings
- Notification preferences
- Display settings (density, sidebar state, chart type)

**Actions:**
- `setLanguage(lang)` - Set language
- `setCurrency(currency)` - Set currency
- `setTimezone(timezone)` - Set timezone
- `setNotifications(notifPrefs)` - Update notification preferences
- `setDisplay(displayPrefs)` - Update display preferences
- `toggleSidebar()` - Toggle sidebar collapsed state
- `resetPreferences()` - Reset to initial state

### 3. TypeScript Support

The store is fully typed:

```typescript
import type { RootState, AppDispatch } from 'src/store';

// Get the entire state type
type State = RootState;

// Get a specific slice type
type DashboardState = RootState['dashboard'];
```

### 4. Persistence Configuration

State is automatically persisted to localStorage:

**Dashboard Slice:**
- Persists: `selectedView`, `preferences`
- Does not persist: `dateRange`, `filters` (session-specific)

**User Preferences Slice:**
- Persists: All fields (language, currency, timezone, notifications, display)

To customize persistence, edit the persist configs in `root-reducer.ts`.

## Adding New Slices

1. Create a new slice file in `slices/`:

```typescript
// slices/my-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MyState {
  value: string;
}

const initialState: MyState = {
  value: '',
};

const mySlice = createSlice({
  name: 'mySlice',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setValue } = mySlice.actions;
export default mySlice.reducer;
```

2. Add to `root-reducer.ts`:

```typescript
import myReducer from './slices/my-slice';

const rootReducer = combineReducers({
  dashboard: persistReducer(dashboardPersistConfig, dashboardReducer),
  userPreferences: persistReducer(userPreferencesPersistConfig, userPreferencesReducer),
  mySlice: myReducer, // Add your reducer
});
```

3. Export from `index.ts`:

```typescript
export * from './slices/my-slice';
```

## Demo Component

See `src/components/dashboard-settings/dashboard-settings.tsx` for a complete example of using Redux in a component.

The component is integrated into the e-commerce dashboard view at `/dashboard/ecommerce`.

## Best Practices

1. **Use typed hooks**: Always use `useAppDispatch` and `useAppSelector` instead of the plain React-Redux hooks
2. **Keep slices focused**: Each slice should manage a specific domain of state
3. **Use Redux for shared state**: Local component state should use `useState`
4. **Avoid storing derived data**: Compute derived values in selectors or components
5. **Be selective with persistence**: Only persist data that should survive page reloads

## Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Redux Persist Documentation](https://github.com/rt2zz/redux-persist)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
