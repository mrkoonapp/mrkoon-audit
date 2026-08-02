import { Page } from '@playwright/test';
import type {
  HomeKpiResponse,
  TransactionsChartResponse,
  TransactionTotalsResponse,
  TopSellerResponse,
  TopCategoryResponse,
  SuccessRateResponse,
} from 'src/api/audit';
import type { DataRoomCompareResponse } from 'src/api/data-room';
import type {
  TagOption,
  TagGroupOption,
  TagAnalyticsReportResponse,
  TagSuccessRateItem,
} from 'src/api/tag-analytics';

// ----------------------------------------------------------------------
// Strict TypeScript Default Mocks
// ----------------------------------------------------------------------

export const mockHomeKpiData: { data: HomeKpiResponse } = {
  data: {
    gmv: 5520000,
    total_sellers: 26,
    active_sellers: 18,
    total_inspections: {
      total: 26,
      offline: 18,
      online: 8,
    },
    total_buyers: 17,
    active_buyers: 46,
    total_products: 158,
    total_auctions: 32,
    all_clients_count: 3,
    new_clients: [
      {
        id: 1,
        name: 'علي عوض',
        image: null,
        joined_at: '2026-06-28',
        phone: '01274587458',
      },
      {
        id: 2,
        name: 'احمد عادل',
        image: null,
        joined_at: '2026-06-28',
        phone: '01555666888',
      },
      {
        id: 3,
        name: 'Test',
        image: null,
        joined_at: '2026-06-24',
        phone: '01789999999',
      },
    ],
  },
};

export const mockSuccessRateData: { data: SuccessRateResponse } = {
  data: {
    rate: 48.7,
    successful_count: 77,
    failed_count: 81,
    total: 158,
  },
};

export const mockTransactionsChartData: { data: TransactionsChartResponse } = {
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    amounts: [1200000, 1800000, 2500000, 3200000, 5520000],
    counts: [10, 15, 25, 18, 30],
    breakdown: [
      { period_key: 'Jan', title_ar: 'يناير', title_en: 'Jan', amount: 1200000, count: 10 },
      { period_key: 'Feb', title_ar: 'فبراير', title_en: 'Feb', amount: 1800000, count: 15 },
    ],
  },
};

export const mockTransactionTotalsData: { data: TransactionTotalsResponse } = {
  data: {
    total_money: 5520000,
    total_count: 98,
  },
};

export const mockTopSellersData: { data: TopSellerResponse[] } = {
  data: [
    { id: 1, name: 'عادل جروب', image: null, category: 'Scraps', gmv: 2700000, auction_count: 9 },
    { id: 2, name: 'kkk6', image: null, category: 'Vehicles', gmv: 1122000, auction_count: 3 },
    { id: 3, name: 'شركة الكوم الاحمر', image: null, category: 'Industrial', gmv: 592000, auction_count: 11 },
    { id: 4, name: 'العهد جروب', image: null, category: 'Motors', gmv: 413000, auction_count: 3 },
    { id: 5, name: 'تامر ل تجارة الامونيوم', image: null, category: 'Metals', gmv: 200000, auction_count: 1 },
  ],
};

export const mockTopCategoriesData: { data: TopCategoryResponse[] } = {
  data: [
    { id: 1, name: 'كرتون', product_count: 12, bar_percent: 80 },
    { id: 2, name: 'خرده متنوعه', product_count: 1, bar_percent: 20 },
  ],
};

export const mockCountriesResponse = {
  data: {
    data: [
      { id: 1, name: 'Egypt', name_ar: 'مصر', name_en: 'Egypt', global_code: 'EG' },
      { id: 2, name: 'Saudi Arabia', name_ar: 'السعودية', name_en: 'Saudi Arabia', global_code: 'SA' },
    ],
  },
};

export const mockDataRoomCompareData: { data: DataRoomCompareResponse } = {
  data: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    label_map: {
      'Week 1': { en: 'Week 1', ar: 'الأسبوع 1' },
      'Week 2': { en: 'Week 2', ar: 'الأسبوع 2' },
    },
    countries: [
      {
        id: 1,
        name: { en: 'Egypt', ar: 'مصر' },
        country_code: 'EG',
        val1: [100, 150, 200, 250],
        val2: [80, 120, 160, 210],
      },
      {
        id: 2,
        name: { en: 'Saudi Arabia', ar: 'السعودية' },
        country_code: 'SA',
        val1: [300, 400, 450, 500],
        val2: [250, 350, 400, 470],
      },
    ],
  },
};

export const mockTagsListData: { data: TagOption[] } = {
  data: [
    { id: 1, name: { en: 'Toyota', ar: 'تويوتا' } },
    { id: 2, name: { en: 'Hyundai', ar: 'هيونداي' } },
    { id: 3, name: { en: 'Mercedes', ar: 'مرسيدس' } },
  ],
};

export const mockTagGroupsListData: { data: TagGroupOption[] } = {
  data: [
    { id: 1, name: { en: 'SUV Cars', ar: 'سيارات SUV' } },
    { id: 2, name: { en: 'Sedan Cars', ar: 'سيارات سيدان' } },
  ],
};

export const mockTagAnalyticsReportData: { data: TagAnalyticsReportResponse } = {
  data: {
    summary: {
      total_auctions: 45,
      highest_price: 950000,
      lowest_price: 120000,
      period_breakdown: [
        { period_key: '2026-01', title: 'Jan 2026', title_ar: 'يناير 2026', title_en: 'Jan 2026', count: 20 },
        { period_key: '2026-02', title: 'Feb 2026', title_ar: 'فبراير 2026', title_en: 'Feb 2026', count: 25 },
      ],
    },
    auctions: [
      {
        auction_code: 'AUC-1001',
        auction_date: '2026-01-10',
        start_price: 150000,
        highest_price: 220000,
        currency: 'EGP',
      },
    ],
  },
};

export const mockTagsSuccessRateData: { data: TagSuccessRateItem[] } = {
  data: [
    {
      id: 1,
      name: { en: 'Toyota Corolla', ar: 'تويوتا كورولا' },
      total_products: 50,
      successful_auctions: 42,
      failed_auctions: 8,
      success_rate: 84.0,
    },
  ],
};

// ----------------------------------------------------------------------
// Dynamic Generator Logic based on Request Parameters
// ----------------------------------------------------------------------

export function generateDynamicKpiData(urlParams: URLSearchParams): { data: HomeKpiResponse } {
  const countryId = urlParams.get('country_id');

  if (countryId === '1') {
    // Egypt Country Filter Active
    return {
      data: {
        ...mockHomeKpiData.data,
        total_products: 250,
        total_auctions: 50,
        total_sellers: 35,
        total_buyers: 80,
      },
    };
  }

  if (countryId === '2') {
    // Saudi Arabia Country Filter Active
    return {
      data: {
        ...mockHomeKpiData.data,
        total_products: 420,
        total_auctions: 90,
        total_sellers: 60,
        total_buyers: 150,
      },
    };
  }

  return mockHomeKpiData;
}

export function generateDynamicCompareData(urlParams: URLSearchParams): { data: DataRoomCompareResponse } {
  const type = urlParams.get('type') || 'transactions';

  if (type === 'buyers') {
    return {
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        label_map: { 'Week 1': { en: 'Week 1', ar: 'الأسبوع 1' } },
        countries: [
          { id: 1, name: { en: 'Egypt', ar: 'مصر' }, country_code: 'EG', val1: [10, 20, 30, 40], val2: [5, 15, 25, 35] },
          { id: 2, name: { en: 'Saudi Arabia', ar: 'السعودية' }, country_code: 'SA', val1: [50, 60, 70, 80], val2: [45, 55, 65, 75] },
        ],
      },
    };
  }

  if (type === 'sellers') {
    return {
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        label_map: { 'Week 1': { en: 'Week 1', ar: 'الأسبوع 1' } },
        countries: [
          { id: 1, name: { en: 'Egypt', ar: 'مصر' }, country_code: 'EG', val1: [15, 25, 35, 45], val2: [10, 20, 30, 40] },
          { id: 2, name: { en: 'Saudi Arabia', ar: 'السعودية' }, country_code: 'SA', val1: [60, 70, 80, 90], val2: [50, 60, 70, 80] },
        ],
      },
    };
  }

  if (type === 'auctions') {
    return {
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        label_map: { 'Week 1': { en: 'Week 1', ar: 'الأسبوع 1' } },
        countries: [
          { id: 1, name: { en: 'Egypt', ar: 'مصر' }, country_code: 'EG', val1: [100, 200, 300, 400], val2: [90, 190, 290, 390] },
          { id: 2, name: { en: 'Saudi Arabia', ar: 'السعودية' }, country_code: 'SA', val1: [500, 600, 700, 800], val2: [400, 500, 600, 700] },
        ],
      },
    };
  }

  // Default: Orders / Transactions
  return mockDataRoomCompareData;
}

export function generateDynamicTransactionsChart(urlParams: URLSearchParams): { data: TransactionsChartResponse } {
  const period = urlParams.get('period');
  const dateFrom = urlParams.get('date_from');
  const dateTo = urlParams.get('date_to');

  let labels: string[] = [];

  if (period === 'weekly') {
    // Weekly -> 7 days
    labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
  } else if (period === 'monthly') {
    // Monthly -> 4-5 weeks
    labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  } else if (period === 'quarterly') {
    // Quarterly -> 3 months
    labels = ['Month 1', 'Month 2', 'Month 3'];
  } else if (period === 'yearly') {
    // Yearly -> 12 months
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  } else if (period === 'custom' || (dateFrom && dateTo)) {
    // Calculate difference in days between date_from and date_to
    const fromTime = new Date(dateFrom || '2026-01-01').getTime();
    const toTime = new Date(dateTo || '2026-01-10').getTime();
    const diffDays = Math.max(1, Math.ceil((toTime - fromTime) / (1000 * 60 * 60 * 24)));

    if (diffDays < 7) {
      // Less than 7 days -> 7 days
      labels = Array.from({ length: 7 }, (_, i) => `Day ${i + 1}`);
    } else if (diffDays <= 60) {
      // 7 to 60 days -> weeks
      const weeks = Math.ceil(diffDays / 7);
      labels = Array.from({ length: weeks }, (_, i) => `Week ${i + 1}`);
    } else if (diffDays <= 365) {
      // More than 2 months up to 12 months -> months
      const months = Math.min(12, Math.ceil(diffDays / 30));
      labels = Array.from({ length: months }, (_, i) => `Month ${i + 1}`);
    } else {
      // More than 1 year -> years
      const years = Math.ceil(diffDays / 365);
      labels = Array.from({ length: years }, (_, i) => `Year ${i + 1}`);
    }
  } else {
    labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
  }

  const amounts = labels.map((_, i) => (i + 1) * 100000);
  const counts = labels.map((_, i) => (i + 1) * 5);

  return {
    data: {
      labels,
      amounts,
      counts,
      breakdown: labels.map((lbl, i) => ({
        period_key: lbl,
        title_ar: lbl,
        title_en: lbl,
        amount: amounts[i],
        count: counts[i],
      })),
    },
  };
}

// ----------------------------------------------------------------------
// Setup Function to Intercept API Routes in Playwright
// ----------------------------------------------------------------------

export async function setupApiMocks(page: Page) {
  // Public Countries Endpoint
  await page.route('**/*get_countries*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: mockCountriesResponse });
  });

  // Home Dashboard KPIs (Dynamic based on parameters)
  await page.route('**/*audit/home/kpis*', async (route) => {
    const url = new URL(route.request().url());
    const dynamicData = generateDynamicKpiData(url.searchParams);
    await route.fulfill({ status: 200, contentType: 'application/json', json: dynamicData });
  });

  await page.route('**/*audit/home/success-rate*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: mockSuccessRateData });
  });

  // Home Dashboard Transactions Chart (Dynamic based on period & custom date range)
  await page.route('**/*audit/home/transactions-chart*', async (route) => {
    const url = new URL(route.request().url());
    const dynamicChart = generateDynamicTransactionsChart(url.searchParams);
    await route.fulfill({ status: 200, contentType: 'application/json', json: dynamicChart });
  });

  await page.route('**/*audit/home/transaction-totals*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: mockTransactionTotalsData });
  });

  await page.route('**/*audit/home/top-sellers*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: mockTopSellersData });
  });

  await page.route('**/*audit/home/top-categories*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: mockTopCategoriesData });
  });

  // Data Room Compare APIs (Dynamic based on tab type parameter)
  await page.route('**/*audit/home/compare*', async (route) => {
    const url = new URL(route.request().url());
    const dynamicCompare = generateDynamicCompareData(url.searchParams);
    await route.fulfill({ status: 200, contentType: 'application/json', json: dynamicCompare });
  });

  // Tags & Tag Groups APIs
  await page.route('**/*audit/tags*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: mockTagsListData });
  });

  await page.route('**/*audit/tag-groups*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: mockTagGroupsListData });
  });

  // Tag Analytics Report & Success Rate APIs
  await page.route('**/*audit/auctions/report-by-tag*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: mockTagAnalyticsReportData });
  });

  await page.route('**/*audit/auctions/tags-success-rate*', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', json: mockTagsSuccessRateData });
  });
}
