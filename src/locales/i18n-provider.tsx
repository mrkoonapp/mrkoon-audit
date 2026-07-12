import { Suspense } from 'react';
import { getStorage } from 'minimal-shared/utils';
import { type Resource, createInstance } from 'i18next';
import { initReactI18next, I18nextProvider as Provider } from 'react-i18next';

import enCommon from './langs/en/common.json';
import enNavbar from './langs/en/navbar.json';
import arEGCommon from './langs/ar-eg/common.json';
import arEGNavbar from './langs/ar-eg/navbar.json';
import arSACommon from './langs/ar-sa/common.json';
import arSANavbar from './langs/ar-sa/navbar.json';
import enDashboard from './langs/en/dashboard.json';
import arEGDashboard from './langs/ar-eg/dashboard.json';
import arSADashboard from './langs/ar-sa/dashboard.json';
import { fallbackLng, i18nOptions, normalizeLanguage } from './locales-config';

// ----------------------------------------------------------------------

const lng = normalizeLanguage(getStorage('i18nextLng', fallbackLng) as string | undefined);

const canonicalResources = {
  en: { common: enCommon, navbar: enNavbar, dashboard: enDashboard },
  'ar-SA': { common: arSACommon, navbar: arSANavbar, dashboard: arSADashboard },
  'ar-EG': { common: arEGCommon, navbar: arEGNavbar, dashboard: arEGDashboard },
} as const;

const resources: Resource = {
  ...canonicalResources,
  ar: canonicalResources['ar-SA'],
  'ar-sa': canonicalResources['ar-SA'],
  'ar-eg': canonicalResources['ar-EG'],
  'en-us': canonicalResources.en,
};

export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  ...i18nOptions(lng),
  initImmediate: false,
  resources,
});

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function I18nProvider({ children }: Props) {
  return (
    <Provider i18n={i18n}>
      <Suspense fallback={null}>{children}</Suspense>
    </Provider>
  );
}
