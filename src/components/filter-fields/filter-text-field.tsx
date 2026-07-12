import type { TextFieldProps } from '@mui/material/TextField';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type FilterTextFieldProps = Omit<TextFieldProps, 'onChange'> & {
  onChange?: (value: string) => void;
};

export function FilterTextField({ onChange, ...other }: FilterTextFieldProps) {
  return (
    <TextField
      fullWidth
      onChange={(e) => onChange?.(e.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        },
      }}
      {...other}
    />
  );
}
