import type { TagOption, TagGroupOption, TagAnalyticsReportResponse } from 'src/api/tag-analytics';

// ----------------------------------------------------------------------
// Mock Tags and Tag Groups
// ----------------------------------------------------------------------

export const mockTags: TagOption[] = [
  { id: 3, name: { en: 'Wood', ar: 'مزادات الخشب' } },
  { id: 1, name: { en: 'Building Materials', ar: 'مواد البناء' } },
  { id: 2, name: { en: 'Scrap Metal', ar: 'خردة ومعادن' } },
  { id: 4, name: { en: 'Heavy Equipment', ar: 'معدات ثقيلة' } },
  { id: 5, name: { en: 'Electrical Cables', ar: 'كابلات كهربائية' } },
];

export const mockTagGroups: TagGroupOption[] = [
  { id: 1, name: { en: 'Raw Materials Group', ar: 'مجموعة المواد الخام' } },
  { id: 2, name: { en: 'Construction Equipment', ar: 'مجموعة معدات البناء' } },
  { id: 3, name: { en: 'Industrial Metals', ar: 'مجموعة المعادن الصناعية' } },
];

// ----------------------------------------------------------------------
// Mock Report Data for Tag #3 (Wood / مزادات الخشب)
// ----------------------------------------------------------------------

export const mockWoodReportData: TagAnalyticsReportResponse = {
  summary: {
    total_auctions: 19,
    highest_price: 13500,
    lowest_price: 750,
    period_breakdown: [
      { period_key: '2026-04', title: 'أبريل', title_ar: 'أبريل', title_en: 'April', count: 8 },
      { period_key: '2026-05', title: 'مايو', title_ar: 'مايو', title_en: 'May', count: 5 },
      { period_key: '2026-06', title: 'يونيو', title_ar: 'يونيو', title_en: 'June', count: 6 },
    ],
  },
  auctions: [
    { auction_code: 'P-1042', auction_date: '2026-04-28', start_price: 5000, highest_price: 9500, currency: 'EGP' },
    { auction_code: 'P-1041', auction_date: '2026-04-21', start_price: 3000, highest_price: 10840, currency: 'EGP' },
    { auction_code: 'P-1040', auction_date: '2026-04-28', start_price: 4000, highest_price: 6100, currency: 'EGP' },
    { auction_code: 'P-1039', auction_date: '2026-04-08', start_price: 1000, highest_price: 750, currency: 'EGP' },
    { auction_code: 'P-1038', auction_date: '2026-04-21', start_price: 3000, highest_price: 5520, currency: 'EGP' },
    { auction_code: 'P-1037', auction_date: '2026-04-21', start_price: 500, highest_price: 750, currency: 'EGP' },
    { auction_code: 'P-1036', auction_date: '2026-04-28', start_price: 3000, highest_price: 5400, currency: 'EGP' },
    { auction_code: 'P-1035', auction_date: '2026-04-22', start_price: 2500, highest_price: 4250, currency: 'EGP' },
    { auction_code: 'P-1034', auction_date: '2026-05-04', start_price: 3000, highest_price: 5000, currency: 'EGP' },
    { auction_code: 'P-1033', auction_date: '2026-05-13', start_price: 4000, highest_price: 6000, currency: 'EGP' },
    { auction_code: 'P-1032', auction_date: '2026-05-17', start_price: 5000, highest_price: 8400, currency: 'EGP' },
    { auction_code: 'P-1031', auction_date: '2026-05-14', start_price: 8000, highest_price: 13500, currency: 'EGP' },
    { auction_code: 'P-1030', auction_date: '2026-05-14', start_price: 2000, highest_price: 3000, currency: 'EGP' },
    { auction_code: 'P-1029', auction_date: '2026-06-08', start_price: 2500, highest_price: 3800, currency: 'EGP' },
    { auction_code: 'P-1028', auction_date: '2026-06-16', start_price: 2800, highest_price: 3910, currency: 'EGP' },
    { auction_code: 'P-1027', auction_date: '2026-06-24', start_price: 1200, highest_price: 1780, currency: 'EGP' },
    { auction_code: 'P-1026', auction_date: '2026-06-24', start_price: 6000, highest_price: 9800, currency: 'EGP' },
    { auction_code: 'P-1025', auction_date: '2026-06-30', start_price: 6000, highest_price: 9800, currency: 'EGP' },
    { auction_code: 'P-1024', auction_date: '2026-06-23', start_price: 1500, highest_price: 2500, currency: 'EGP' },
  ],
};
