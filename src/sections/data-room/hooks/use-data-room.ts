import { useMemo, useState } from 'react';

import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useChart } from 'src/components/chart';

import { dataRoomMockData } from '../data';

// ----------------------------------------------------------------------

export type CountryCode = 'all' | 'egypt' | 'ksa';

export function useDataRoom() {
  const theme = useTheme();
  const router = useRouter();

  // Filters State
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('all');
  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState<string>('orders');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Q2 2026');
  const [selectedPeriodType, setSelectedPeriodType] = useState<string>('Quarter');

  const activeData = useMemo(
    () => dataRoomMockData[selectedTab] || dataRoomMockData.orders,
    [selectedTab]
  );

  // Chart configuration builder
  const buildChartOptions = (lineColor: string, hoverVal: number, hoverMonth: string) => {
    const isDark = theme.palette.mode === 'dark';

    return {
      colors: [lineColor],
      stroke: { curve: 'smooth' as any, width: 3 },
      xaxis: {
        categories: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        labels: {
          style: {
            colors: theme.palette.text.disabled,
            fontSize: '11px',
            fontWeight: 500,
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        min: 0,
        max: 100000,
        tickAmount: 5,
        labels: {
          formatter: (val: number) => {
            if (selectedTab === 'revenue' || selectedTab === 'sales') {
              return `${(val / 1000).toFixed(0)}M`;
            }
            return `${(val / 1000).toFixed(0)}K`;
          },
          style: {
            colors: theme.palette.text.disabled,
            fontSize: '11px',
          },
        },
      },
      grid: {
        strokeDashArray: 3,
        borderColor: isDark ? '#1C2430' : '#E5E8EB',
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 0,
          opacityFrom: 0.25,
          opacityTo: 0,
          stops: [0, 100],
        },
      },
      markers: {
        size: 0,
        hover: { size: 6 },
      },
      annotations: {
        points: [
          {
            x: hoverMonth,
            y: hoverVal,
            marker: {
              size: 6,
              fillColor: lineColor,
              strokeColor: '#FFFFFF',
              strokeWidth: 2,
              radius: 2,
            },
            label: {
              borderColor: lineColor,
              borderWidth: 1,
              borderRadius: 6,
              text: `${hoverMonth}: ${selectedTab === 'revenue' || selectedTab === 'sales' ? (hoverVal / 1000).toFixed(1) + 'M' : (hoverVal / 1000).toFixed(1) + 'k'}`,
              style: {
                color: '#FFFFFF',
                background: lineColor,
                fontSize: '11px',
                fontWeight: 'bold',
                cssClass: 'apexcharts-point-annotation-label',
              },
            },
          },
        ],
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: isDark ? 'dark' : 'light',
        y: {
          formatter: (value: number) => {
            if (selectedTab === 'revenue' || selectedTab === 'sales') {
              return `${(value / 1000000).toFixed(1)} M EGP`;
            }
            return `${(value / 1000).toFixed(1)}k`;
          },
        },
      },
    };
  };

  const egyptChartOptions = useChart(
    buildChartOptions(
      '#E05665',
      selectedTab === 'orders' ? 58600 : selectedTab === 'revenue' || selectedTab === 'sales' ? 85200 : 50400,
      'AUG'
    )
  );

  const saudiChartOptions = useChart(
    buildChartOptions(
      '#2EB67D',
      selectedTab === 'orders' ? 85000 : selectedTab === 'revenue' || selectedTab === 'sales' ? 20300 : 23500,
      'AUG'
    )
  );

  const egyptSeries = [
    {
      name: 'Egypt',
      data: activeData.chartData.map((d) => (selectedTab === 'revenue' || selectedTab === 'sales' ? d.egypt / 1000 : d.egypt)),
    },
  ];

  const saudiSeries = [
    {
      name: 'Saudi Arabia',
      data: activeData.chartData.map((d) => (selectedTab === 'revenue' || selectedTab === 'sales' ? d.saudiArabia / 1000 : d.saudiArabia)),
    },
  ];

  const performanceTabs = [
    { value: 'buyers', label: 'Buyers', icon: 'solar:users-group-rounded-bold-duotone' },
    { value: 'sellers', label: 'Sellers', icon: 'solar:shop-bold-duotone' },
    { value: 'orders', label: 'Orders', icon: 'solar:clipboard-list-bold-duotone' },
    { value: 'auctions', label: 'Auctions', icon: 'solar:hammer-bold-duotone' },
    { value: 'sales', label: 'Sales', icon: 'solar:chart-square-bold-duotone' },
    { value: 'revenue', label: 'Revenue', icon: 'solar:wad-of-money-bold-duotone' },
    { value: 'newusers', label: 'New User', icon: 'solar:user-plus-bold-duotone' },
  ];

  const handleViewAll = () => {
    router.push(paths.dashboard.sales);
  };

  return {
    theme,
    selectedCountry,
    setSelectedCountry,
    search,
    setSearch,
    selectedTab,
    setSelectedTab,
    selectedQuarter,
    setSelectedQuarter,
    selectedPeriodType,
    setSelectedPeriodType,
    activeData,
    egyptChartOptions,
    saudiChartOptions,
    egyptSeries,
    saudiSeries,
    performanceTabs,
    onViewAll: handleViewAll,
  };
}
