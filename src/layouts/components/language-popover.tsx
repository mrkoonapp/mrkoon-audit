import type { LanguageValue } from 'src/locales';
import type { IconButtonProps } from '@mui/material/IconButton';

import { m } from 'framer-motion';
import { usePopover } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useAppSelector } from 'src/store';
import { useTranslate, resolveArabicLocale } from 'src/locales';

import { FlagIcon } from 'src/components/flag-icon';
import { CustomPopover } from 'src/components/custom-popover';
import { varTap, varHover, transitionTap } from 'src/components/animate';

// ----------------------------------------------------------------------

type DisplayOption = {
  value: 'en' | 'ar';
  label: string;
  countryCode: string;
  iconUrl?: string;
};

export function LanguagePopover({ sx, ...other }: IconButtonProps) {
  const { open, anchorEl, onClose, onOpen } = usePopover();

  const { onChangeLang, currentLang } = useTranslate();

  const userCountry = useAppSelector((state) => state.user.country);
  const countryCode = userCountry?.global_code;
  const countryIcon = userCountry?.icon;

  // Auto-correct Arabic locale when user's country doesn't match the stored variant
  // e.g. user is Egyptian but language is ar-SA → silently switch to ar-EG
  useEffect(() => {
    if (!countryCode || !currentLang.value.startsWith('ar')) return;

    const correctLocale = resolveArabicLocale(countryCode);
    if (currentLang.value !== correctLocale) {
      onChangeLang(correctLocale, { silent: true });
    }
  }, [countryCode, currentLang.value, onChangeLang]);

  const options: DisplayOption[] = useMemo(
    () => [
      { value: 'en', label: 'English', countryCode: 'US' },
      {
        value: 'ar',
        label: 'العربية',
        countryCode: countryCode || 'SA',
        iconUrl: countryIcon,
      },
    ],
    [countryCode, countryIcon]
  );

  const handleChangeLang = useCallback(
    (option: DisplayOption) => {
      const lang: LanguageValue =
        option.value === 'ar' ? resolveArabicLocale(countryCode) : 'en';

      onChangeLang(lang);
      onClose();
    },
    [onChangeLang, onClose, countryCode]
  );

  const renderFlag = (option: DisplayOption) =>
    option.iconUrl ? (
      <img
        src={option.iconUrl}
        alt={option.label}
        style={{ width: 26, height: 20, objectFit: 'cover', borderRadius: 5 }}
      />
    ) : (
      <FlagIcon code={option.countryCode} />
    );

  const headerOption = currentLang.value.startsWith('ar') ? options[1] : options[0];

  const renderMenuList = () => (
    <CustomPopover open={open} anchorEl={anchorEl} onClose={onClose}>
      <MenuList sx={{ width: 160, minHeight: 72 }}>
        {options.map((option) => (
          <MenuItem
            key={option.value}
            selected={
              option.value === 'en'
                ? currentLang.value === 'en'
                : currentLang.value.startsWith('ar')
            }
            onClick={() => handleChangeLang(option)}
          >
            {renderFlag(option)}
            {option.label}
          </MenuItem>
        ))}
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap={varTap(0.96)}
        whileHover={varHover(1.04)}
        transition={transitionTap()}
        aria-label="Languages button"
        onClick={onOpen}
        sx={[
          (theme) => ({
            p: 0,
            width: 40,
            height: 40,
            ...(open && { bgcolor: theme.vars.palette.action.selected }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        {renderFlag(headerOption)}
      </IconButton>

      {renderMenuList()}
    </>
  );
}
