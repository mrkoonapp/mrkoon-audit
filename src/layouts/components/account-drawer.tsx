import type { RootState } from 'src/store';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { NavSectionProps } from 'src/components/nav-section';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import Drawer from '@mui/material/Drawer';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { AnimateBorder } from 'src/components/animate';

import { AccountButton } from './account-button';
import { SignOutButton } from './sign-out-button';

// ----------------------------------------------------------------------

export type AccountDrawerProps = IconButtonProps & {
  data?: NavSectionProps['data'];
};

export function AccountDrawer({ data = [], sx, ...other }: AccountDrawerProps) {
  const pathname = usePathname();
  const { name, image, email } = useSelector((state: RootState) => state.user);

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const navItems = useMemo(() => data.flatMap((section) => section.items), [data]);

  const renderAvatar = () => (
    <AnimateBorder
      sx={{ mb: 2, p: '6px', width: 96, height: 96, borderRadius: '50%' }}
      slotProps={{
        primaryBorder: { size: 120, sx: { color: 'primary.main' } },
      }}
    >
      <Avatar src={image} alt={name} sx={{ width: 1, height: 1 }}>
        {name?.charAt(0).toUpperCase()}
      </Avatar>
    </AnimateBorder>
  );

  const renderList = () => (
    <MenuList
      disablePadding
      sx={[
        (theme) => ({
          py: 3,
          px: 2.5,
          borderTop: `dashed 1px ${theme.vars.palette.divider}`,
          borderBottom: `dashed 1px ${theme.vars.palette.divider}`,
          '& li': { p: 0 },
        }),
      ]}
    >
      {navItems.map((item) => (
        <MenuItem key={item.path}>
          <Link
            component={RouterLink}
            href={item.path}
            color="inherit"
            underline="none"
            onClick={onClose}
            sx={{
              p: 1,
              width: 1,
              display: 'flex',
              typography: 'body2',
              alignItems: 'center',
              color: pathname === item.path ? 'text.primary' : 'text.secondary',
              fontWeight: pathname === item.path ? 'fontWeightSemiBold' : 'fontWeightRegular',
              '& svg': { width: 24, height: 24 },
              '&:hover': { color: 'text.primary' },
            }}
          >
            {item.icon}

            <Box component="span" sx={{ ml: 2 }}>
              {item.title}
            </Box>
          </Link>
        </MenuItem>
      ))}
    </MenuList>
  );

  return (
    <>
      <AccountButton onClick={onOpen} photoURL={image} displayName={name} sx={sx} {...other} />

      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
          paper: { sx: { width: 320 } },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            top: 12,
            left: 12,
            zIndex: 9,
            position: 'absolute',
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>

        <Scrollbar>
          <Box
            sx={{
              pt: 8,
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            {renderAvatar()}

            <Typography variant="subtitle1" noWrap sx={{ mt: 2 }}>
              {name}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }} noWrap>
              {email}
            </Typography>
          </Box>

          <Box sx={{ p: 3 }} />

          {renderList()}
        </Scrollbar>

        <Box sx={{ p: 2.5 }}>
          <SignOutButton onClose={onClose} />
        </Box>
      </Drawer>
    </>
  );
}
