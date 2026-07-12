import type { ChipProps } from '@mui/material/Chip';
import type { SelectProps } from '@mui/material/Select';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { TextFieldProps } from '@mui/material/TextField';
import type { InputLabelProps } from '@mui/material/InputLabel';
import type { FormControlProps } from '@mui/material/FormControl';
import type { FormHelperTextProps } from '@mui/material/FormHelperText';

import { merge } from 'es-toolkit';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { HelperText } from './help-text';

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

type RHFSelectProps = TextFieldProps & {
  name: string;
  children: React.ReactNode;
  /** Called when user scrolls near the bottom of the dropdown — wire to `fetchNextPage`. */
  onLoadMore?: () => void;
  /** Whether more pages exist. When `false`, `onLoadMore` won't be called. */
  hasMore?: boolean;
  /** Whether the next page is already in flight. Prevents duplicate calls. */
  loadingMore?: boolean;
};

export function RHFSelect({
  name,
  children,
  helperText,
  slotProps = {},
  variant,
  label,
  onLoadMore,
  hasMore,
  loadingMore,
  ...other
}: RHFSelectProps) {
  const { control } = useFormContext();

  const labelId = `${name}-select`;

  const handlePaperScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const node = event.currentTarget;
    const distanceFromBottom = node.scrollHeight - (node.scrollTop + node.clientHeight);
    if (distanceFromBottom < 50 && hasMore && !loadingMore) {
      onLoadMore?.();
    }
  };

  const baseSlotProps: TextFieldProps['slotProps'] = {
    select: {
      sx: { textTransform: 'capitalize' },
      MenuProps: {
        slotProps: {
          paper: {
            sx: [{ maxHeight: 220 }, PREMIUM_SCROLLBAR_SX],
            ...(onLoadMore && { onScroll: handlePaperScroll }),
          },
        },
      },
    },
    htmlInput: { id: labelId },
    inputLabel: { htmlFor: labelId },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const hasValue =
          field.value !== '' && field.value !== null && field.value !== undefined;
        const isFilled = variant === 'filled';
        const hideLabelForCenter = isFilled && (hasValue || !label);

        return (
          <TextField
            {...field}
            select
            fullWidth
            label={hideLabelForCenter ? undefined : label}
            variant={variant}
            hiddenLabel={hideLabelForCenter}
            error={!!error}
            helperText={error?.message ?? helperText}
            slotProps={merge(baseSlotProps, slotProps)}
            {...other}
          >
            {children}
          </TextField>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

type RHFMultiSelectProps = FormControlProps & {
  name: string;
  label?: string;
  chip?: boolean;
  checkbox?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  options: { label: string; value: string }[];
  slotProps?: {
    chip?: ChipProps;
    select?: SelectProps;
    checkbox?: CheckboxProps;
    inputLabel?: InputLabelProps;
    helperText?: FormHelperTextProps;
  };
};

export function RHFMultiSelect({
  name,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  slotProps,
  helperText,
  ...other
}: RHFMultiSelectProps) {
  const { control } = useFormContext();

  const labelId = `${name}-multi-select`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const renderLabel = () => (
          <InputLabel htmlFor={labelId} {...slotProps?.inputLabel}>
            {label}
          </InputLabel>
        );

        const renderOptions = () =>
          options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {checkbox && (
                <Checkbox
                  size="small"
                  disableRipple
                  checked={field.value.includes(option.value)}
                  {...slotProps?.checkbox}
                />
              )}

              {option.label}
            </MenuItem>
          ));

        return (
          <FormControl error={!!error} {...other}>
            {label && renderLabel()}

            <Select
              {...field}
              multiple
              displayEmpty={!!placeholder}
              label={label}
              renderValue={(selected) => {
                const selectedItems = options.filter((item) =>
                  (selected as string[]).includes(item.value)
                );

                if (!selectedItems.length && placeholder) {
                  return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
                }

                if (chip) {
                  return (
                    <Box sx={{ gap: 0.5, display: 'flex', flexWrap: 'wrap' }}>
                      {selectedItems.map((item) => (
                        <Chip
                          key={item.value}
                          size="small"
                          variant="soft"
                          label={item.label}
                          {...slotProps?.chip}
                        />
                      ))}
                    </Box>
                  );
                }

                return selectedItems.map((item) => item.label).join(', ');
              }}
              {...slotProps?.select}
              inputProps={{
                id: labelId,
                ...slotProps?.select?.inputProps,
              }}
            >
              {renderOptions()}
            </Select>

            <HelperText
              {...slotProps?.helperText}
              errorMessage={error?.message}
              helperText={helperText}
            />
          </FormControl>
        );
      }}
    />
  );
}
