import type { TFunction } from 'i18next';
import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  dashboard: icon('ic-dashboard'),
  blank: icon('ic-blank'),
};

// ----------------------------------------------------------------------

/**
 * Input nav data is an array of navigation section items used to define the structure and content of a navigation bar.
 * Each section contains a subheader and an array of items, which can include nested children items.
 */
export function navData(t: TFunction<any, any>): NavSectionProps['data'] {
  return [
    /**
     * Overview
     */
    {
      subheader: t('overview'),
      items: [
        { title: t('app'), path: paths.dashboard.root, icon: ICONS.dashboard },
        { title: t('blank'), path: paths.dashboard.blank, icon: ICONS.blank },
      ],
    },
  ];
}
