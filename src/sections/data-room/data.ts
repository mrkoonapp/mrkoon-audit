export interface DataRoomKpi {
  id: string;
  label: string;
  value: string;
  trend: {
    value: number;
    direction: 'up' | 'down';
  };
  distribution: {
    eg: string;
    sa: string;
  };
}

export interface ChartDataPoint {
  month: string;
  egypt: number;
  saudiArabia: number;
}

export interface DataRoomTabDetails {
  kpis: DataRoomKpi[];
  egyptTotal: string;
  egyptTrend: string;
  egyptTrendDirection: 'up' | 'down';
  saudiTotal: string;
  saudiTrend: string;
  saudiTrendDirection: 'up' | 'down';
  chartData: ChartDataPoint[];
}

export const dataRoomMockData: Record<string, DataRoomTabDetails> = {
  orders: {
    egyptTotal: '73.9k',
    egyptTrend: '12%',
    egyptTrendDirection: 'up',
    saudiTotal: '120.5k',
    saudiTrend: '7%',
    saudiTrendDirection: 'down',
    kpis: [
      {
        id: 'buyers',
        label: 'Total Buyers',
        value: '73.9k',
        trend: { value: 12, direction: 'up' },
        distribution: { eg: '50.4K', sa: '23.5K' },
      },
      {
        id: 'sellers',
        label: 'Total Sellers',
        value: '73.9k',
        trend: { value: 10, direction: 'up' },
        distribution: { eg: '50.4K', sa: '23.5K' },
      },
      {
        id: 'auctions',
        label: 'Total Auctions',
        value: '73.9k',
        trend: { value: 5, direction: 'down' },
        distribution: { eg: '50.4K', sa: '23.5K' },
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: '120.8 M EGP',
        trend: { value: 8, direction: 'up' },
        distribution: { eg: '100.5M', sa: '20.3M' },
      },
    ],
    chartData: [
      { month: 'JAN', egypt: 92000, saudiArabia: 95000 },
      { month: 'FEB', egypt: 30000, saudiArabia: 35000 },
      { month: 'MAR', egypt: 60000, saudiArabia: 65000 },
      { month: 'APR', egypt: 22000, saudiArabia: 30000 },
      { month: 'MAY', egypt: 65000, saudiArabia: 62000 },
      { month: 'JUN', egypt: 90000, saudiArabia: 88000 },
      { month: 'JUL', egypt: 85000, saudiArabia: 70000 },
      { month: 'AUG', egypt: 58600, saudiArabia: 85000 },
      { month: 'SEP', egypt: 75000, saudiArabia: 68000 },
      { month: 'OCT', egypt: 38000, saudiArabia: 58000 },
      { month: 'NOV', egypt: 50000, saudiArabia: 35000 },
      { month: 'DEC', egypt: 92000, saudiArabia: 82000 },
    ],
  },
  buyers: {
    egyptTotal: '50.4k',
    egyptTrend: '8%',
    egyptTrendDirection: 'up',
    saudiTotal: '23.5k',
    saudiTrend: '15%',
    saudiTrendDirection: 'up',
    kpis: [
      {
        id: 'buyers',
        label: 'Total Buyers',
        value: '73.9k',
        trend: { value: 8, direction: 'up' },
        distribution: { eg: '50.4K', sa: '23.5K' },
      },
      {
        id: 'sellers',
        label: 'Total Sellers',
        value: '45.2k',
        trend: { value: 6, direction: 'up' },
        distribution: { eg: '30.1K', sa: '15.1K' },
      },
      {
        id: 'auctions',
        label: 'Total Auctions',
        value: '52.1k',
        trend: { value: 3, direction: 'down' },
        distribution: { eg: '32.1K', sa: '20.0K' },
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: '95.4 M EGP',
        trend: { value: 12, direction: 'up' },
        distribution: { eg: '75.2M', sa: '20.2M' },
      },
    ],
    chartData: [
      { month: 'JAN', egypt: 40000, saudiArabia: 20000 },
      { month: 'FEB', egypt: 42000, saudiArabia: 21000 },
      { month: 'MAR', egypt: 45000, saudiArabia: 22000 },
      { month: 'APR', egypt: 41000, saudiArabia: 19000 },
      { month: 'MAY', egypt: 48000, saudiArabia: 24000 },
      { month: 'JUN', egypt: 52000, saudiArabia: 26000 },
      { month: 'JUL', egypt: 51000, saudiArabia: 25000 },
      { month: 'AUG', egypt: 50400, saudiArabia: 23500 },
      { month: 'SEP', egypt: 53000, saudiArabia: 27000 },
      { month: 'OCT', egypt: 55000, saudiArabia: 28000 },
      { month: 'NOV', egypt: 56000, saudiArabia: 29000 },
      { month: 'DEC', egypt: 58000, saudiArabia: 30000 },
    ],
  },
  sellers: {
    egyptTotal: '24.1k',
    egyptTrend: '14%',
    egyptTrendDirection: 'up',
    saudiTotal: '18.9k',
    saudiTrend: '4%',
    saudiTrendDirection: 'down',
    kpis: [
      {
        id: 'buyers',
        label: 'Total Buyers',
        value: '62.0k',
        trend: { value: 10, direction: 'up' },
        distribution: { eg: '40.0K', sa: '22.0K' },
      },
      {
        id: 'sellers',
        label: 'Total Sellers',
        value: '43.0k',
        trend: { value: 14, direction: 'up' },
        distribution: { eg: '24.1K', sa: '18.9K' },
      },
      {
        id: 'auctions',
        label: 'Total Auctions',
        value: '35.0k',
        trend: { value: 7, direction: 'down' },
        distribution: { eg: '20.0K', sa: '15.0K' },
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: '80.0 M EGP',
        trend: { value: 9, direction: 'up' },
        distribution: { eg: '60.0M', sa: '20.0M' },
      },
    ],
    chartData: [
      { month: 'JAN', egypt: 15000, saudiArabia: 12000 },
      { month: 'FEB', egypt: 16000, saudiArabia: 13000 },
      { month: 'MAR', egypt: 18000, saudiArabia: 14000 },
      { month: 'APR', egypt: 17000, saudiArabia: 13500 },
      { month: 'MAY', egypt: 20000, saudiArabia: 15000 },
      { month: 'JUN', egypt: 22000, saudiArabia: 17000 },
      { month: 'JUL', egypt: 23000, saudiArabia: 18000 },
      { month: 'AUG', egypt: 24100, saudiArabia: 18900 },
      { month: 'SEP', egypt: 25000, saudiArabia: 19500 },
      { month: 'OCT', egypt: 26000, saudiArabia: 20000 },
      { month: 'NOV', egypt: 27000, saudiArabia: 21000 },
      { month: 'DEC', egypt: 28000, saudiArabia: 22000 },
    ],
  },
  auctions: {
    egyptTotal: '55.3k',
    egyptTrend: '2%',
    egyptTrendDirection: 'down',
    saudiTotal: '18.2k',
    saudiTrend: '12%',
    saudiTrendDirection: 'up',
    kpis: [
      {
        id: 'buyers',
        label: 'Total Buyers',
        value: '70.2k',
        trend: { value: 6, direction: 'up' },
        distribution: { eg: '48.2K', sa: '22.0K' },
      },
      {
        id: 'sellers',
        label: 'Total Sellers',
        value: '39.8k',
        trend: { value: 11, direction: 'up' },
        distribution: { eg: '25.0K', sa: '14.8K' },
      },
      {
        id: 'auctions',
        label: 'Total Auctions',
        value: '73.5k',
        trend: { value: 2, direction: 'down' },
        distribution: { eg: '55.3K', sa: '18.2K' },
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: '110.0 M EGP',
        trend: { value: 15, direction: 'up' },
        distribution: { eg: '90.0M', sa: '20.0M' },
      },
    ],
    chartData: [
      { month: 'JAN', egypt: 50000, saudiArabia: 10000 },
      { month: 'FEB', egypt: 48000, saudiArabia: 11000 },
      { month: 'MAR', egypt: 52000, saudiArabia: 12000 },
      { month: 'APR', egypt: 46000, saudiArabia: 10500 },
      { month: 'MAY', egypt: 53000, saudiArabia: 13000 },
      { month: 'JUN', egypt: 55000, saudiArabia: 15000 },
      { month: 'JUL', egypt: 54000, saudiArabia: 16000 },
      { month: 'AUG', egypt: 55300, saudiArabia: 18200 },
      { month: 'SEP', egypt: 56000, saudiArabia: 19000 },
      { month: 'OCT', egypt: 54000, saudiArabia: 20000 },
      { month: 'NOV', egypt: 53000, saudiArabia: 21000 },
      { month: 'DEC', egypt: 52000, saudiArabia: 22000 },
    ],
  },
  sales: {
    egyptTotal: '85.2M',
    egyptTrend: '16%',
    egyptTrendDirection: 'up',
    saudiTotal: '35.6M',
    saudiTrend: '9%',
    saudiTrendDirection: 'up',
    kpis: [
      {
        id: 'buyers',
        label: 'Total Buyers',
        value: '80.0k',
        trend: { value: 14, direction: 'up' },
        distribution: { eg: '55.0K', sa: '25.0K' },
      },
      {
        id: 'sellers',
        label: 'Total Sellers',
        value: '50.0k',
        trend: { value: 8, direction: 'up' },
        distribution: { eg: '32.0K', sa: '18.0K' },
      },
      {
        id: 'auctions',
        label: 'Total Auctions',
        value: '68.0k',
        trend: { value: 4, direction: 'up' },
        distribution: { eg: '48.0K', sa: '20.0K' },
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: '120.8 M EGP',
        trend: { value: 16, direction: 'up' },
        distribution: { eg: '85.2M', sa: '35.6M' },
      },
    ],
    chartData: [
      { month: 'JAN', egypt: 60000000, saudiArabia: 20000000 },
      { month: 'FEB', egypt: 62000000, saudiArabia: 22000000 },
      { month: 'MAR', egypt: 68000000, saudiArabia: 25000000 },
      { month: 'APR', egypt: 55000000, saudiArabia: 18000000 },
      { month: 'MAY', egypt: 72000000, saudiArabia: 28000000 },
      { month: 'JUN', egypt: 80000000, saudiArabia: 32000000 },
      { month: 'JUL', egypt: 82000000, saudiArabia: 33000000 },
      { month: 'AUG', egypt: 85200000, saudiArabia: 35600000 },
      { month: 'SEP', egypt: 87000000, saudiArabia: 37000000 },
      { month: 'OCT', egypt: 89000000, saudiArabia: 38000000 },
      { month: 'NOV', egypt: 92000000, saudiArabia: 40000000 },
      { month: 'DEC', egypt: 95000000, saudiArabia: 42000000 },
    ],
  },
  revenue: {
    egyptTotal: '100.5M',
    egyptTrend: '22%',
    egyptTrendDirection: 'up',
    saudiTotal: '20.3M',
    saudiTrend: '1%',
    saudiTrendDirection: 'down',
    kpis: [
      {
        id: 'buyers',
        label: 'Total Buyers',
        value: '78.5k',
        trend: { value: 11, direction: 'up' },
        distribution: { eg: '52.0K', sa: '26.5K' },
      },
      {
        id: 'sellers',
        label: 'Total Sellers',
        value: '48.0k',
        trend: { value: 13, direction: 'up' },
        distribution: { eg: '30.0K', sa: '18.0K' },
      },
      {
        id: 'auctions',
        label: 'Total Auctions',
        value: '72.0k',
        trend: { value: 6, direction: 'down' },
        distribution: { eg: '50.0K', sa: '22.0K' },
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: '120.8 M EGP',
        trend: { value: 18, direction: 'up' },
        distribution: { eg: '100.5M', sa: '20.3M' },
      },
    ],
    chartData: [
      { month: 'JAN', egypt: 70000000, saudiArabia: 15000000 },
      { month: 'FEB', egypt: 75000000, saudiArabia: 16000000 },
      { month: 'MAR', egypt: 80000000, saudiArabia: 17000000 },
      { month: 'APR', egypt: 68000000, saudiArabia: 14000000 },
      { month: 'MAY', egypt: 85000000, saudiArabia: 18000000 },
      { month: 'JUN', egypt: 92000000, saudiArabia: 19000000 },
      { month: 'JUL', egypt: 98000000, saudiArabia: 20000000 },
      { month: 'AUG', egypt: 100500000, saudiArabia: 20300000 },
      { month: 'SEP', egypt: 102000000, saudiArabia: 21000000 },
      { month: 'OCT', egypt: 105000000, saudiArabia: 22000000 },
      { month: 'NOV', egypt: 108000000, saudiArabia: 23000000 },
      { month: 'DEC', egypt: 112000000, saudiArabia: 24000000 },
    ],
  },
  newusers: {
    egyptTotal: '12.4k',
    egyptTrend: '25%',
    egyptTrendDirection: 'up',
    saudiTotal: '8.2k',
    saudiTrend: '14%',
    saudiTrendDirection: 'up',
    kpis: [
      {
        id: 'buyers',
        label: 'Total Buyers',
        value: '20.6k',
        trend: { value: 20, direction: 'up' },
        distribution: { eg: '12.4K', sa: '8.2K' },
      },
      {
        id: 'sellers',
        label: 'Total Sellers',
        value: '5.2k',
        trend: { value: 15, direction: 'up' },
        distribution: { eg: '3.1K', sa: '2.1K' },
      },
      {
        id: 'auctions',
        label: 'Total Auctions',
        value: '10.5k',
        trend: { value: 8, direction: 'up' },
        distribution: { eg: '6.5K', sa: '4.0K' },
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: '15.0 M EGP',
        trend: { value: 30, direction: 'up' },
        distribution: { eg: '10.0M', sa: '5.0M' },
      },
    ],
    chartData: [
      { month: 'JAN', egypt: 8000, saudiArabia: 5000 },
      { month: 'FEB', egypt: 8500, saudiArabia: 5300 },
      { month: 'MAR', egypt: 9200, saudiArabia: 5800 },
      { month: 'APR', egypt: 7800, saudiArabia: 4900 },
      { month: 'MAY', egypt: 10000, saudiArabia: 6500 },
      { month: 'JUN', egypt: 11000, saudiArabia: 7200 },
      { month: 'JUL', egypt: 11800, saudiArabia: 7800 },
      { month: 'AUG', egypt: 12400, saudiArabia: 8200 },
      { month: 'SEP', egypt: 13000, saudiArabia: 8600 },
      { month: 'OCT', egypt: 13800, saudiArabia: 9200 },
      { month: 'NOV', egypt: 14500, saudiArabia: 9800 },
      { month: 'DEC', egypt: 15200, saudiArabia: 10500 },
    ],
  },
};
