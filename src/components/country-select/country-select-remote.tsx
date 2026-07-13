import type { ReactNode } from 'react';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { getLocalizedText } from 'src/utils/format-string';

import { useTranslate } from 'src/locales';
import { useGetCountries } from 'src/api/countries';

// ----------------------------------------------------------------------

/** Sentinel value for the "All countries" option — an empty id means unfiltered. */
export const ALL_COUNTRIES_VALUE = '';

type CountryOption = {
  /** Backend country id as a string; `''` for the synthetic "All" option. */
  value: string;
  label: string;
  /** Flag image URL from the backend (empty for the "All" option). */
  icon: string;
};

export type CountrySelectRemoteProps = {
  id?: string;
  /** Selected backend country id (as string); `''` means "All". */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Label for the leading "All" option. */
  allLabel?: string;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: ReactNode;
};

/**
 * Country picker backed by the live backend list (`useGetCountries`) — the same
 * source the login screen uses. Prepends an explicit "All" option and returns
 * the selected country id as a string (`''` for "All"). Localizes each country
 * name to the active locale.
 */
export function CountrySelectRemote({
  id = 'country-select-remote',
  value,
  onChange,
  placeholder,
  allLabel,
  fullWidth,
  error,
  helperText,
}: CountrySelectRemoteProps) {
  const { currentLang } = useTranslate();
  const { data: countries, isLoading } = useGetCountries();

  const options = useMemo<CountryOption[]>(() => {
    const list = (countries ?? []).map((country) => ({
      value: String(country.id),
      label: getLocalizedText(country.name, currentLang.value),
      icon: country.icon,
    }));

    return [{ value: ALL_COUNTRIES_VALUE, label: allLabel ?? 'All', icon: '' }, ...list];
  }, [countries, currentLang.value, allLabel]);

  // The value is always a valid option — fall back to "All" (first option) when unset.
  const selected = options.find((option) => option.value === value) ?? options[0] ?? null;

  return (
    <Autocomplete<CountryOption, false, true, false>
      id={id}
      fullWidth={fullWidth}
      disableClearable
      loading={isLoading}
      options={options}
      value={selected ?? undefined}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      getOptionLabel={(option) => option.label}
      onChange={(_event, newValue) => onChange(newValue?.value ?? ALL_COUNTRIES_VALUE)}
      renderOption={(props, option) => (
        <Box component="li" {...props} key={option.value}>
          {option.icon ? (
            <Box
              component="img"
              alt={option.label}
              src={option.icon}
              sx={{ mr: 1, width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : null}
          {option.label}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: selected?.icon ? (
                <InputAdornment position="start">
                  <Box
                    component="img"
                    alt={selected.label}
                    src={selected.icon}
                    sx={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}
                  />
                </InputAdornment>
              ) : (
                params.InputProps.startAdornment
              ),
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={18} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
