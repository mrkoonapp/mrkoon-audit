import type { AutocompleteProps } from '@mui/material/Autocomplete';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

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

type FilterAutocompleteBaseProps = Omit<
  AutocompleteProps<any, boolean, boolean, boolean>,
  'renderInput'
>;

export type FilterAutocompleteProps = FilterAutocompleteBaseProps & {
  placeholder?: string;
  /** Called when user scrolls near the bottom of the dropdown — wire to `fetchNextPage`. */
  onLoadMore?: () => void;
  /** Whether more pages exist. When `false`, `onLoadMore` won't be called. */
  hasMore?: boolean;
  /** Whether the next page is already in flight. Prevents duplicate calls and shows a spinner. */
  loadingMore?: boolean;
};

export function FilterAutocomplete({
  placeholder,
  loading,
  onLoadMore,
  hasMore,
  loadingMore,
  ...other
}: FilterAutocompleteProps) {
  const handleListboxScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const node = event.currentTarget;
    const distanceFromBottom = node.scrollHeight - (node.scrollTop + node.clientHeight);
    if (distanceFromBottom < 50 && hasMore && !loadingMore) {
      onLoadMore?.();
    }
  };

  return (
    <Autocomplete
      fullWidth
      loading={loading || loadingMore}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading || loadingMore ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      ListboxProps={{
        sx: PREMIUM_SCROLLBAR_SX,
        ...(onLoadMore && { onScroll: handleListboxScroll }),
      }}
      {...other}
    />
  );
}
