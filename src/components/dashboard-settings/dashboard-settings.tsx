import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import {
  setDisplay,
  setLanguage,
  setCurrency,
  toggleSidebar,
} from 'src/store/slices/user-preferences-slice';
import {
  setPreferences,
  setSelectedView,
  toggleCompactMode,
  toggleAutoRefresh,
  type DashboardView,
} from 'src/store/slices/dashboard-slice';

// ----------------------------------------------------------------------

export function DashboardSettings() {
  const dispatch = useAppDispatch();

  // Get state from Redux store
  const dashboard = useAppSelector((state) => state.dashboard);
  const userPreferences = useAppSelector((state) => state.userPreferences);

  const dashboardViews: DashboardView[] = [
    'ecommerce',
    'analytics',
    'banking',
    'booking',
    'file',
    'course',
  ];

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSelectedView(event.target.value as DashboardView));
  };

  const handleRefreshIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!Number.isNaN(value) && value > 0) {
      dispatch(setPreferences({ refreshInterval: value }));
    }
  };

  const handleDensityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setDisplay({
        density: event.target.value as 'comfortable' | 'compact' | 'standard',
      })
    );
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLanguage(event.target.value));
  };

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrency(event.target.value));
  };

  return (
    <Card>
      <CardHeader
        title="Dashboard Settings (Redux Demo)"
        subheader="Persisted with Redux Persist"
      />

      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Dashboard View Selection */}
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Dashboard View
          </Typography>
          <TextField select fullWidth value={dashboard.selectedView} onChange={handleViewChange}>
            {dashboardViews.map((view) => (
              <MenuItem key={view} value={view}>
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <Divider />

        {/* Dashboard Preferences */}
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Dashboard Preferences
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={dashboard.preferences.compactMode}
                onChange={() => dispatch(toggleCompactMode())}
              />
            }
            label="Compact Mode"
          />

          <FormControlLabel
            control={
              <Switch
                checked={dashboard.preferences.autoRefresh}
                onChange={() => dispatch(toggleAutoRefresh())}
              />
            }
            label="Auto Refresh"
          />

          {dashboard.preferences.autoRefresh && (
            <TextField
              fullWidth
              type="number"
              label="Refresh Interval (seconds)"
              value={dashboard.preferences.refreshInterval}
              onChange={handleRefreshIntervalChange}
              sx={{ mt: 2 }}
            />
          )}
        </div>

        <Divider />

        {/* User Display Preferences */}
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Display Settings
          </Typography>

          <TextField
            select
            fullWidth
            label="Display Density"
            value={userPreferences.display.density}
            onChange={handleDensityChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="comfortable">Comfortable</MenuItem>
            <MenuItem value="compact">Compact</MenuItem>
            <MenuItem value="standard">Standard</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Switch
                checked={userPreferences.display.sidebarCollapsed}
                onChange={() => dispatch(toggleSidebar())}
              />
            }
            label="Collapse Sidebar"
          />
        </div>

        <Divider />

        {/* Localization Settings */}
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Localization
          </Typography>

          <TextField
            select
            fullWidth
            label="Language"
            value={userPreferences.language}
            onChange={handleLanguageChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="es">Spanish</MenuItem>
            <MenuItem value="fr">French</MenuItem>
            <MenuItem value="de">German</MenuItem>
          </TextField>

          <TextField
            select
            fullWidth
            label="Currency"
            value={userPreferences.currency}
            onChange={handleCurrencyChange}
          >
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
            <MenuItem value="JPY">JPY</MenuItem>
          </TextField>
        </div>

        <Divider />

        {/* Current State Display */}
        <div>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Current Redux State (for demo)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify({ dashboard, userPreferences }, null, 2)}
          </Typography>
        </div>

        <Button variant="outlined" color="warning" onClick={() => window.location.reload()}>
          Reload Page (State will persist)
        </Button>
      </CardContent>
    </Card>
  );
}
