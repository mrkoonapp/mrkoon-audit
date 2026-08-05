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
  auctions: icon('ic-order'),
  inspections: icon('ic-file'),
  sales: icon('ic-analytics'),
  operations: icon('ic-settings'),
  dataRoom: icon('ic-lock'),
  tagAnalytics: icon('ic-label'),
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
        { title: t('dashboard'), path: paths.dashboard.root, icon: ICONS.dashboard },
        // { title: t('auctions'), path: paths.dashboard.auctions, icon: ICONS.auctions },
        // { title: t('inspections'), path: paths.dashboard.inspections, icon: ICONS.inspections },
        // { title: t('sales'), path: paths.dashboard.sales, icon: ICONS.sales },
        // { title: t('operations'), path: paths.dashboard.operations, icon: ICONS.operations },
        { title: t('dataRoom'), path: paths.dashboard.dataRoom, icon: ICONS.dataRoom },
        { title: t('tagAnalytics'), path: paths.dashboard.tagAnalytics, icon: ICONS.tagAnalytics },
      ],
    },
  ];
}
