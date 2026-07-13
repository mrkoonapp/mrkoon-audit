import type { TextFieldProps } from '@mui/material/TextField';

import { Controller, useFormContext } from 'react-hook-form';
import { transformValue, transformValueOnBlur, transformValueOnChange } from 'minimal-shared/utils';

import TextField from '@mui/material/TextField';

// ----------------------------------------------------------------------

export type RHFTextFieldProps = TextFieldProps & {
  name: string;
};

export function RHFTextField({
  name,
  helperText,
  slotProps,
  type = 'text',
  variant,
  label,
  ...other
}: RHFTextFieldProps) {
  const { control } = useFormContext();

  const isNumberType = type === 'number';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const hasValue = field.value !== '' && field.value !== null && field.value !== undefined;
        const isFilled = variant === 'filled';
        const hideLabelForCenter = isFilled && (hasValue || !label);

        return (
          <TextField
            {...field}
            fullWidth
            label={hideLabelForCenter ? undefined : label}
            variant={variant}
            hiddenLabel={hideLabelForCenter}
            value={isNumberType ? transformValue(field.value) : field.value}
            onChange={(event) => {
              const transformedValue = isNumberType
                ? transformValueOnChange(event.target.value)
                : event.target.value;

              field.onChange(transformedValue);
            }}
            onBlur={(event) => {
              const transformedValue = isNumberType
                ? transformValueOnBlur(event.target.value)
                : event.target.value;

              field.onChange(transformedValue);
            }}
            type={isNumberType ? 'text' : type}
            error={!!error}
            helperText={error?.message ?? helperText}
            slotProps={{
              ...slotProps,
              htmlInput: {
                autoComplete: 'off',
                ...slotProps?.htmlInput,
                ...(isNumberType && { inputMode: 'decimal', pattern: '[0-9]*\\.?[0-9]*' }),
              },
            }}
            {...other}
          />
        );
      }}
    />
  );
}
