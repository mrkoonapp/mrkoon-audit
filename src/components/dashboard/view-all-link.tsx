import Link from '@mui/material/Link';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ViewAllLinkProps = {
  href: string;
  label: string;
};

/**
 * Small "View all →" link used as a widget `headerAction` to route from a
 * dashboard summary card to its full listing page (Products / Clients / …).
 */
export function ViewAllLink({ href, label }: ViewAllLinkProps) {
  return (
    <Link
      component={RouterLink}
      href={href}
      color="inherit"
      variant="subtitle2"
      sx={{
        gap: 0.5,
        display: 'inline-flex',
        alignItems: 'center',
        color: 'text.secondary',
        '&:hover': { color: 'text.primary' },
      }}
    >
      {label}
      <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
    </Link>
  );
}
