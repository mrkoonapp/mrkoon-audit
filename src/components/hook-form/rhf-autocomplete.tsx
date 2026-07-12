import type { TextFieldProps } from '@mui/material/TextField';
import type { AutocompleteProps } from '@mui/material/Autocomplete';

import { Controller, useFormContext } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

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

export type AutocompleteBaseProps = Omit<
  AutocompleteProps<any, boolean, boolean, boolean>,
  'renderInput'
>;

export type RHFAutocompleteProps = AutocompleteBaseProps & {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
  /** Called when user scrolls near the bottom of the dropdown — wire to `fetchNextPage`. */
  onLoadMore?: () => void;
  /** Whether more pages exist. When `false`, `onLoadMore` won't be called. */
  hasMore?: boolean;
  /** Whether the next page is already in flight. Prevents duplicate calls and shows the spinner. */
  loadingMore?: boolean;
  slotProps?: AutocompleteBaseProps['slotProps'] & {
    textfield?: TextFieldProps;
  };
};

export function RHFAutocomplete({
  name,
  label,
  slotProps,
  helperText,
  placeholder,
  loading,
  onLoadMore,
  hasMore,
  loadingMore,
  ...other
}: RHFAutocompleteProps) {
  const { control, setValue } = useFormContext();

  const { textfield, ...otherSlotProps } = slotProps ?? {};

  const handleListboxScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const node = event.currentTarget;
    const distanceFromBottom = node.scrollHeight - (node.scrollTop + node.clientHeight);
    if (distanceFromBottom < 50 && hasMore && !loadingMore) {
      onLoadMore?.();
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const hasValue = Array.isArray(field.value)
          ? field.value.length > 0
          : field.value !== null && field.value !== undefined && field.value !== '';
        const isFilled = textfield?.variant === 'filled';
        const hideLabelForCenter = isFilled && (hasValue || !label);

        return (
          <Autocomplete
            {...field}
            id={`rhf-autocomplete-${name}`}
            loading={loading || loadingMore}
            onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
            renderInput={(params) => (
              <TextField
                {...params}
                {...textfield}
                label={hideLabelForCenter ? undefined : label}
                placeholder={placeholder}
                hiddenLabel={hideLabelForCenter}
                error={!!error}
                helperText={error?.message ?? helperText}
                slotProps={{
                  ...textfield?.slotProps,
                  htmlInput: {
                    ...params.inputProps,
                    autoComplete: 'new-password',
                    ...textfield?.slotProps?.htmlInput,
                  },
                }}
              />
            )}
            {...other}
            {...otherSlotProps}
            ListboxProps={{
              sx: PREMIUM_SCROLLBAR_SX,
              ...(onLoadMore && { onScroll: handleListboxScroll }),
            }}
          />
        );
      }}
    />
  );
}
