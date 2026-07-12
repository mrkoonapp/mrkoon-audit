import type { Theme, SxProps } from '@mui/material/styles';
import type { SelectChangeEvent } from '@mui/material/Select';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

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

export type FilterSelectOption = {
  value: string;
  label: string;
};

export type FilterSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: FilterSelectOption[];
  label?: string;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  /** Called when user scrolls near the bottom of the dropdown — wire to `fetchNextPage`. */
  onLoadMore?: () => void;
  /** Whether more pages exist. When `false`, `onLoadMore` won't be called. */
  hasMore?: boolean;
  /** Whether the next page is already in flight. Prevents duplicate calls. */
  loadingMore?: boolean;
};

export function FilterSelect({
  value,
  onChange,
  options,
  label,
  fullWidth = true,
  sx,
  onLoadMore,
  hasMore,
  loadingMore,
}: FilterSelectProps) {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  const handlePaperScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const node = event.currentTarget;
    const distanceFromBottom = node.scrollHeight - (node.scrollTop + node.clientHeight);
    if (distanceFromBottom < 50 && hasMore && !loadingMore) {
      onLoadMore?.();
    }
  };

  return (
    <FormControl fullWidth={fullWidth} sx={sx}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        onChange={handleChange}
        label={label}
        MenuProps={{
          slotProps: {
            paper: {
              sx: [{ maxHeight: 220 }, PREMIUM_SCROLLBAR_SX],
              ...(onLoadMore && { onScroll: handlePaperScroll }),
            },
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
