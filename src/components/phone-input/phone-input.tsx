import type { ICountry } from 'src/types/main.types';

import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

const PREMIUM_SCROLLBAR_SX = {
  scrollbarWidth: 'thin' as const,
  scrollbarColor: 'rgba(145, 158, 171, 0.4) transparent',
  '&::-webkit-scrollbar': { width: 6, height: 6 },
  '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
  '&::-webkit-scrollbar-thumb': {
    borderRadius: 3,
    backgroundColor: 'rgba(145, 158, 171, 0.4)',
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(145, 158, 171, 0.6)',
  },
};

// ----------------------------------------------------------------------

export type PhoneInputProps = {
  name: string;
  countryFieldName: string;
  label?: string;
  placeholder?: string;
  countries: ICountry[];
  helperText?: React.ReactNode;
  fullWidth?: boolean;
  error?: boolean;
  variant?: 'standard' | 'outlined' | 'filled';
  sx?: any;
};

export function PhoneInput({
  name,
  countryFieldName,
  label,
  placeholder,
  countries,
  helperText,
  fullWidth,
  error,
  variant = 'outlined',
  sx,
}: PhoneInputProps) {
  const { t } = useTranslate();
  const resolvedLabel = label ?? t('auth.phoneNumber');
  const resolvedPlaceholder = placeholder ?? t('auth.phoneNumberPlaceholder');
  const { control } = useFormContext();

  return (
    <Box sx={[{ display: 'flex', gap: 1 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {/* Country Selector */}
      <Controller
        name={countryFieldName}
        control={control}
        render={({ field, fieldState: { error: fieldError } }) => {
          const selectedCountry = countries?.find(
            (c) => c.id.toString() === field.value?.toString()
          );
          const hasValue = field.value !== '' && field.value !== null && field.value !== undefined;
          const hideLabelForCenter = variant === 'filled' && hasValue;

          return (
            <TextField
              {...field}
              select
              label={hideLabelForCenter ? undefined : t('auth.country')}
              hiddenLabel={hideLabelForCenter}
              error={!!fieldError}
              helperText={fieldError?.message}
              sx={{ minWidth: 120 }}
              variant={variant}
              SelectProps={{
                renderValue: () =>
                  selectedCountry ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {selectedCountry.icon && (
                        <img
                          src={selectedCountry.icon}
                          alt=""
                          style={{
                            width: 20,
                            height: 14,
                            objectFit: 'cover',
                            borderRadius: 2,
                            display: 'block',
                          }}
                        />
                      )}
                      <Box component="span" sx={{ fontSize: '0.875rem' }}>
                        {selectedCountry.country_code}
                      </Box>
                    </Box>
                  ) : (
                    ''
                  ),
                MenuProps: {
                  PaperProps: {
                    sx: [{ maxHeight: 300 }, PREMIUM_SCROLLBAR_SX],
                  },
                },
              }}
            >
              {countries?.map((country) => (
                <MenuItem
                  key={country.id}
                  value={country.id.toString()}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  {country.icon && (
                    <img
                      src={country.icon}
                      alt="country"
                      style={{
                        width: 24,
                        height: 16,
                        objectFit: 'cover',
                        borderRadius: 2,
                        display: 'block',
                      }}
                    />
                  )}
                  <span style={{ lineHeight: 1 }}>{country.country_code}</span>
                </MenuItem>
              ))}
            </TextField>
          );
        }}
      />

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error: fieldError } }) => {
          const hasValue = field.value !== '' && field.value !== null && field.value !== undefined;
          const hideLabelForCenter = variant === 'filled' && (hasValue || !resolvedLabel);

          return (
            <TextField
              {...field}
              fullWidth
              label={hideLabelForCenter ? undefined : resolvedLabel}
              hiddenLabel={hideLabelForCenter}
              placeholder={resolvedPlaceholder}
              error={!!fieldError}
              helperText={fieldError?.message || helperText}
              variant={variant}
              inputMode="numeric"
              onChange={(e) => {
                field.onChange(e.target.value.replace(/\D/g, ''));
              }}
            />
          );
        }}
      />
    </Box>
  );
}
