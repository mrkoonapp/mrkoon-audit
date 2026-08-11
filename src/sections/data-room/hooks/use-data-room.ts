import type { DashboardFilters } from 'src/components/dashboard';

import { useMemo, useState, useEffect } from 'react';

import { useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useCustomFilter } from 'src/hooks/use-custom-filters';

import { fShortenNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';
import { buildQueryParams, useGetDataRoomCompare, useGetHomeDashboardData } from 'src/api/audit';

import { useChart } from 'src/components/chart';
import { countActiveFilters, defaultDashboardFilters } from 'src/components/dashboard';

// ----------------------------------------------------------------------

export type CountryCode = 'all' | 'egypt' | 'ksa';

export function useDataRoom() {
  const theme = useTheme();
  const router = useRouter();
  const { i18n } = useTranslate();
  const currentLang = i18n.language || 'en';

  // Selected tab visual state
  const [selectedTab, setSelectedTab] = useState<string>('orders');
  const [search, setSearch] = useState('');

  // Shared Filters State Drawer
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { filters, setFiltersHandler, clearFilters } = useCustomFilter<
    DashboardFilters & { group_by?: string }
  >(defaultDashboardFilters);

  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);

  // Map filters.country (which matches DB IDs 6 or 26) to visual selectedCountry code
  const selectedCountry = useMemo(() => {
    if (!filters.country) return 'all';
    if (String(filters.country) === '6') return 'egypt';
    if (String(filters.country) === '26') return 'ksa';
    return 'all';
  }, [filters.country]);

  // 1. Fetch general KPIs to populate the 4 stat cards in a single lightweight query
  const homeDataQuery = useGetHomeDashboardData(filters);

  // 2. Map selected visual Tab to backend compare type
  const selectedTabType = useMemo(() => {
    if (selectedTab === 'buyers' || selectedTab === 'newusers') return 'buyers';
    if (selectedTab === 'sellers') return 'sellers';
    if (selectedTab === 'auctions') return 'auctions';
    return 'transactions';
  }, [selectedTab]);

  // Interactive Chart Mode state (Bar BI Chart by default, with Pie/Donut & Line options)
  const [chartMode, setChartMode] = useState<'bar' | 'pie' | 'area'>('bar');
  const chartType = useMemo<'bar' | 'donut' | 'area'>(
    () => (chartMode === 'pie' ? 'donut' : chartMode),
    [chartMode]
  );

  const queryParams = useMemo(
    () => ({
      ...buildQueryParams(filters),
      type: selectedTabType,
      group_by: filters.group_by || 'date',
    }),
    [filters, selectedTabType]
  );

  // 3. Fetch detailed comparison values ONLY for the selected tab and grouping mode
  const compareQuery = useGetDataRoomCompare(queryParams);

  // Local cache to store loaded compare data per tab type & grouping mode
  const [compareCache, setCompareCache] = useState<Record<string, any>>({});
  const cacheKey = `${selectedTabType}_${filters.group_by || 'date'}`;

  useEffect(() => {
    if (compareQuery.data) {
      setCompareCache((prev) => ({
        ...prev,
        [cacheKey]: compareQuery.data,
      }));
    }
  }, [compareQuery.data, cacheKey]);

  // Helper to calculate totals and month-over-month trend
  const calculateStats = (data: number[]) => {
    const total = data.reduce((sum, val) => sum + val, 0);
    let trendValue = 0;
    let trendDirection: 'up' | 'down' = 'up';

    if (data.length >= 2) {
      const last = data[data.length - 1];
      const prev = data[data.length - 2];
      if (prev > 0) {
        trendValue = ((last - prev) / prev) * 100;
      } else if (last > 0) {
        trendValue = 100;
      }
    } else if (data.length === 1 && data[0] > 0) {
      trendValue = 100;
    }

    trendDirection = trendValue >= 0 ? 'up' : 'down';
    const trendText = `${trendValue >= 0 ? '+' : ''}${Math.round(trendValue)}%`;

    return { total, trendText, trendValue: Math.round(trendValue), trendDirection };
  };

  // Process data for rendering
  const processedData = useMemo(() => {
    const activeTabCompareData = compareCache[cacheKey] || compareQuery.data;
    const defaultLabels = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];

    // labelMap may come as array [] from backend — normalize to plain object
    const rawLabelMap = activeTabCompareData?.label_map;
    let labelMap: Record<string | number, any> =
      rawLabelMap && !Array.isArray(rawLabelMap) ? rawLabelMap : {};

    const formatLabel = (label: string | number) => {
      if (labelMap && labelMap[label]) {
        const trans = labelMap[label];
        if (typeof trans === 'string') return trans;
        return trans[currentLang] || trans['en'] || String(label);
      }

      const labelStr = String(label);
      if (labelStr.includes('-')) {
        const parts = labelStr.split('-');
        const monthIndex = parseInt(parts[1], 10) - 1;
        const months = [
          'JAN',
          'FEB',
          'MAR',
          'APR',
          'MAY',
          'JUN',
          'JUL',
          'AUG',
          'SEP',
          'OCT',
          'NOV',
          'DEC',
        ];
        return months[monthIndex] || labelStr;
      }
      return labelStr;
    };

    // Resolve labels
    const rawLabels = activeTabCompareData?.labels || defaultLabels;

    // Smart helper to resolve countries by ID, code suffix, or name
    const findCountry = (countries: any[], code: string) =>
      countries?.find((c: any) => {
        const cCode = String(c.country_code).trim();
        const cNameEn = String(c.name?.en || c.name || '').toLowerCase();
        if (code === 'EG') {
          return c.id === 6 || cCode === '2+' || cCode === '+2' || cNameEn === 'egypt';
        }
        if (code === 'SA') {
          return (
            c.id === 26 ||
            cCode === '966+' ||
            cCode === '+966' ||
            cNameEn === 'saudi' ||
            cNameEn === 'saudi arabia'
          );
        }
        return false;
      });

    const getCountryData = (queryData: any, code: string) => {
      const country = findCountry(queryData?.countries, code);
      const defaultVals = new Array(rawLabels.length).fill(0);
      return {
        val1: country?.val1 || defaultVals,
        val2: country?.val2 || defaultVals,
      };
    };

    // Active tab series selections
    const egData = getCountryData(activeTabCompareData, 'EG');
    const saData = getCountryData(activeTabCompareData, 'SA');

    const egSeriesRaw = selectedTab === 'revenue' ? egData.val2 : egData.val1;
    const saSeriesRaw = selectedTab === 'revenue' ? saData.val2 : saData.val1;

    let finalLabels = rawLabels;
    let activeEG = egSeriesRaw;
    let activeSA = saSeriesRaw;

    // Typed helper for tag items
    type TagItem = { label: string | number; egVal: number; saVal: number; totalVal: number };
    let otherTagsBreakdown: TagItem[] = [];

    // Tag grouping: filter zeros, sort desc, keep top N, group rest into Others
    if (filters.group_by === 'tag' || filters.group_by === 'tags_group') {
      const MAX_VISIBLE = 9;

      // Build tag items and filter out completely zero entries
      const tagItems: TagItem[] = rawLabels
        .map((label: string | number, idx: number) => {
          const egVal = egSeriesRaw[idx] || 0;
          const saVal = saSeriesRaw[idx] || 0;
          const totalVal = egVal + saVal;
          return { label, egVal, saVal, totalVal };
        })
        .filter((item: TagItem) => item.totalVal > 0);

      // Sort descending by combined value
      tagItems.sort((a: TagItem, b: TagItem) => b.totalVal - a.totalVal);

      if (tagItems.length <= MAX_VISIBLE) {
        // No grouping needed — show all non-zero tags
        finalLabels = tagItems.map((item: TagItem) => item.label);
        activeEG = tagItems.map((item: TagItem) => item.egVal);
        activeSA = tagItems.map((item: TagItem) => item.saVal);
      } else {
        // Keep top N, group the rest into "Others"
        const topTags = tagItems.slice(0, MAX_VISIBLE);
        otherTagsBreakdown = tagItems.slice(MAX_VISIBLE);

        const otherEgVal = otherTagsBreakdown.reduce(
          (sum: number, item: TagItem) => sum + item.egVal,
          0
        );
        const otherSaVal = otherTagsBreakdown.reduce(
          (sum: number, item: TagItem) => sum + item.saVal,
          0
        );

        finalLabels = [...topTags.map((item: TagItem) => item.label), 'other'];
        activeEG = [...topTags.map((item: TagItem) => item.egVal), otherEgVal];
        activeSA = [...topTags.map((item: TagItem) => item.saVal), otherSaVal];

        labelMap = {
          ...labelMap,
          other: { en: 'Other', ar: 'أخرى' },
        };
      }
    }

    const formattedLabels = finalLabels.map(formatLabel);

    // Debug: verify sort order in dev
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DataRoom] sorted labels:', formattedLabels);
      console.log('[DataRoom] EG data:', activeEG);
      console.log('[DataRoom] otherTagsBreakdown:', otherTagsBreakdown);
    }

    const statsEG = calculateStats(activeEG);
    const statsSA = calculateStats(activeSA);

    // Resolve KPI Card values from general dashboard data
    const buyersStat = homeDataQuery.data?.stats?.find((s: any) => s.id === 'buyers');
    const sellersStat = homeDataQuery.data?.stats?.find((s: any) => s.id === 'sellers');
    const productsStat = homeDataQuery.data?.stats?.find((s: any) => s.id === 'products');
    const totalRevenueVal = homeDataQuery.data?.transactions?.totalAmount || 0;
    const totalOrdersVal = homeDataQuery.data?.transactions?.totalCount || 0;

    // Helper to calculate cached country total
    const getCachedCountryTotal = (compareData: any, code: string, useVal2 = false) => {
      if (!compareData) return null;
      const country = findCountry(compareData.countries, code);
      const vals = useVal2 ? country?.val2 : country?.val1;
      return vals ? vals.reduce((a: number, b: number) => a + b, 0) : 0;
    };

    // Calculate dynamic values for each KPI
    // Buyers KPI
    const buyersCompare = compareCache[`buyers_${filters.group_by || 'date'}`];
    const egBuyers = getCachedCountryTotal(buyersCompare, 'EG');
    const saBuyers = getCachedCountryTotal(buyersCompare, 'SA');
    const buyersTrend = buyersCompare
      ? calculateStats([
          ...(findCountry(buyersCompare.countries, 'EG')?.val1 || []),
          ...(findCountry(buyersCompare.countries, 'SA')?.val1 || []),
        ])
      : {
          trendValue: Math.round(((buyersStat?.activeValue || 0) / (buyersStat?.value || 1)) * 100),
          trendDirection: 'up' as const,
        };

    // Sellers KPI
    const sellersCompare = compareCache[`sellers_${filters.group_by || 'date'}`];
    const egSellers = getCachedCountryTotal(sellersCompare, 'EG');
    const saSellers = getCachedCountryTotal(sellersCompare, 'SA');
    const sellersTrend = sellersCompare
      ? calculateStats([
          ...(findCountry(sellersCompare.countries, 'EG')?.val1 || []),
          ...(findCountry(sellersCompare.countries, 'SA')?.val1 || []),
        ])
      : {
          trendValue: Math.round(
            ((sellersStat?.activeValue || 0) / (sellersStat?.value || 1)) * 100
          ),
          trendDirection: 'up' as const,
        };

    // Auctions KPI
    const auctionsCompare = compareCache[`auctions_${filters.group_by || 'date'}`];
    const egAuctions = getCachedCountryTotal(auctionsCompare, 'EG');
    const saAuctions = getCachedCountryTotal(auctionsCompare, 'SA');
    const auctionsTrend = auctionsCompare
      ? calculateStats([
          ...(findCountry(auctionsCompare.countries, 'EG')?.val1 || []),
          ...(findCountry(auctionsCompare.countries, 'SA')?.val1 || []),
        ])
      : { trendValue: 12, trendDirection: 'up' as const };

    // Revenue KPI
    const transactionsCompare = compareCache[`transactions_${filters.group_by || 'date'}`];
    const egRevenue = getCachedCountryTotal(transactionsCompare, 'EG', true);
    const saRevenue = getCachedCountryTotal(transactionsCompare, 'SA', true);
    const revenueTrend = transactionsCompare
      ? calculateStats([
          ...(findCountry(transactionsCompare.countries, 'EG')?.val2 || []),
          ...(findCountry(transactionsCompare.countries, 'SA')?.val2 || []),
        ])
      : {
          trendValue: Math.round(
            totalRevenueVal > 0 ? totalRevenueVal / (totalOrdersVal || 1) / 100 : 8
          ),
          trendDirection: 'up' as const,
        };

    const kpis = [
      {
        id: 'buyers',
        label: 'Total Buyers',
        value: fShortenNumber(buyersStat?.value || 0),
        trend: { value: buyersTrend.trendValue, direction: buyersTrend.trendDirection },
        distribution: {
          eg: egBuyers !== null ? fShortenNumber(egBuyers) : '-',
          sa: saBuyers !== null ? fShortenNumber(saBuyers) : '-',
        },
      },
      {
        id: 'sellers',
        label: 'Total Sellers',
        value: fShortenNumber(sellersStat?.value || 0),
        trend: { value: sellersTrend.trendValue, direction: sellersTrend.trendDirection },
        distribution: {
          eg: egSellers !== null ? fShortenNumber(egSellers) : '-',
          sa: saSellers !== null ? fShortenNumber(saSellers) : '-',
        },
      },
      {
        id: 'auctions',
        label: 'Total Auctions',
        value: fShortenNumber(productsStat?.auctionsValue || 0),
        trend: { value: auctionsTrend.trendValue, direction: auctionsTrend.trendDirection },
        distribution: {
          eg: egAuctions !== null ? fShortenNumber(egAuctions) : '-',
          sa: saAuctions !== null ? fShortenNumber(saAuctions) : '-',
        },
      },
      {
        id: 'revenue',
        label: 'Revenue',
        value: fShortenNumber(totalRevenueVal),
        trend: { value: revenueTrend.trendValue, direction: revenueTrend.trendDirection },
        distribution: {
          eg: egRevenue !== null ? fShortenNumber(egRevenue) : '-',
          sa: saRevenue !== null ? fShortenNumber(saRevenue) : '-',
        },
      },
    ];

    return {
      labels: formattedLabels,
      egyptSeriesData: activeEG,
      saudiSeriesData: activeSA,
      egyptTotal: fShortenNumber(statsEG.total),
      egyptTrend: statsEG.trendText,
      egyptTrendDirection: statsEG.trendDirection,
      saudiTotal: fShortenNumber(statsSA.total),
      saudiTrend: statsSA.trendText,
      saudiTrendDirection: statsSA.trendDirection,
      kpis,
      // Breakdown of tags grouped into "Others" for rich tooltip display
      otherTagsBreakdown: otherTagsBreakdown.map((item) => ({
        label: String(
          labelMap?.[item.label]?.[currentLang] || labelMap?.[item.label]?.en || item.label
        ),
        egVal: item.egVal,
        saVal: item.saVal,
      })),
    };
  }, [
    compareQuery.data,
    compareCache,
    selectedTab,
    homeDataQuery.data,
    cacheKey,
    currentLang,
    filters.group_by,
  ]);

  // Smart number abbreviation helper shared by annotation labels and tooltips
  const formatAxisValue = (val: number): string => {
    const sign = val < 0 ? '-' : '';
    const abs = Math.abs(val);
    if (abs >= 1_000_000_000)
      return `${sign}${(abs / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
    if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    return `${sign}${abs}`;
  };

  // Chart configuration builder
  const buildChartOptions = (
    lineColor: string,
    hoverVal: number,
    hoverMonth: string,
    labels: string[]
  ) => {
    const isDark = theme.palette.mode === 'dark';

    const pieColors = [
      lineColor,
      '#00A76F',
      '#FFAB00',
      '#00B8D9',
      '#FF5630',
      '#8E33FF',
      '#FFC107',
      '#007B55',
    ];

    return {
      colors: chartType === 'donut' ? pieColors : [lineColor],
      labels,
      stroke: {
        show: true,
        width: chartType === 'bar' ? 2 : chartType === 'donut' ? 2 : 3,
        colors:
          chartType === 'bar'
            ? ['transparent']
            : chartType === 'donut'
              ? [isDark ? '#11161D' : '#ffffff']
              : [lineColor],
        curve: 'smooth' as any,
      },
      legend: {
        show: chartType === 'donut',
        position: 'bottom' as const,
        horizontalAlign: 'center' as const,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',
          borderRadius: 6,
        },
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              value: {
                offsetY: 8,
                color: theme.palette.text.primary,
                fontSize: theme.typography.h4.fontSize as string,
                fontWeight: theme.typography.h4.fontWeight,
                formatter: (val: string | number) => formatAxisValue(Number(val)),
              },
              total: {
                show: true,
                label: 'Total',
                color: theme.palette.text.secondary,
                fontSize: theme.typography.subtitle2.fontSize as string,
                fontWeight: theme.typography.subtitle2.fontWeight,
                formatter: (w: any) => {
                  const sum = (w.globals?.seriesTotals || []).reduce(
                    (a: number, b: number) => a + b,
                    0
                  );
                  return formatAxisValue(sum);
                },
              },
            },
          },
        },
      },
      xaxis: {
        categories: labels,
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
        tickAmount: 5,
        labels: {
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
      fill:
        chartType === 'bar' || chartType === 'donut'
          ? {
              type: 'solid',
              opacity: 0.85,
            }
          : {
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
      annotations:
        chartType === 'area'
          ? {
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
                    text: `${hoverMonth}: ${formatAxisValue(hoverVal)}`,
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
            }
          : undefined,
      tooltip: {
        shared: false,
        intersect: true,
        theme: isDark ? 'dark' : 'light',
        custom: ({
          seriesIndex,
          dataPointIndex,
          w,
        }: {
          seriesIndex: number;
          dataPointIndex: number;
          w: any;
        }) => {
          if (chartType === 'donut') {
            const idx =
              seriesIndex !== undefined && seriesIndex !== -1 ? seriesIndex : dataPointIndex;
            const label = labels[idx] ?? '';
            const val = w.globals?.series?.[idx] ?? 0;
            const colorsList = w.config?.colors ?? pieColors;
            const sliceColor = colorsList[idx % colorsList.length] ?? lineColor;

            const isOther =
              label === 'Other' ||
              label === 'أخرى' ||
              (idx === processedData.labels.length - 1 &&
                processedData.otherTagsBreakdown.length > 0);
            const breakdown = processedData.otherTagsBreakdown;

            if (isOther && breakdown && breakdown.length > 0) {
              const rows = breakdown
                .map(
                  (item: { label: string; egVal: number; saVal: number }) =>
                    `<div style="display:flex;justify-content:space-between;gap:12px;padding:2px 0;font-size:11px;">
                      <span style="opacity:0.75">${item.label}</span>
                      <span style="font-weight:600">${formatAxisValue(lineColor === '#E05665' ? item.egVal : item.saVal)}</span>
                    </div>`
                )
                .join('');

              return `<div style="padding:10px 14px;min-width:180px;background:${isDark ? '#1C2430' : '#fff'};border-radius:8px;border:1px solid ${sliceColor}33;font-family:inherit">
                <div style="font-weight:700;margin-bottom:6px;color:${sliceColor};font-size:12px">Other Tags</div>
                ${rows}
              </div>`;
            }

            return `<div style="padding:8px 12px;background:${isDark ? '#1C2430' : '#fff'};border-radius:8px;border:1px solid ${sliceColor}33;font-size:12px;font-family:inherit">
              <span style="color:${sliceColor};font-weight:600">${label}: </span>
              <span>${formatAxisValue(val)}</span>
            </div>`;
          }

          const label =
            w.config?.xaxis?.categories?.[dataPointIndex] ?? labels[dataPointIndex] ?? '';
          // Detect the Others bar — last index when grouping, or by label text
          const isOther =
            label === 'Other' ||
            label === 'أخرى' ||
            (dataPointIndex === processedData.labels.length - 1 &&
              processedData.otherTagsBreakdown.length > 0);
          const breakdown = processedData.otherTagsBreakdown;
          const color = w.config?.colors?.[0] ?? lineColor;

          if (isOther && breakdown && breakdown.length > 0) {
            const rows = breakdown
              .map(
                (item: { label: string; egVal: number; saVal: number }) =>
                  `<div style="display:flex;justify-content:space-between;gap:12px;padding:2px 0;font-size:11px;">
                    <span style="opacity:0.75">${item.label}</span>
                    <span style="font-weight:600">${formatAxisValue(item.egVal + item.saVal)}</span>
                  </div>`
              )
              .join('');

            return `<div style="padding:10px 14px;min-width:180px;background:${isDark ? '#1C2430' : '#fff'};border-radius:8px;border:1px solid ${color}33;font-family:inherit">
              <div style="font-weight:700;margin-bottom:6px;color:${color};font-size:12px">Other Tags</div>
              ${rows}
            </div>`;
          }

          // Default single-value tooltip
          const egVal = processedData.egyptSeriesData[dataPointIndex] ?? 0;
          const saVal = processedData.saudiSeriesData[dataPointIndex] ?? 0;
          const val = lineColor === '#E05665' ? egVal : saVal;
          return `<div style="padding:8px 12px;background:${isDark ? '#1C2430' : '#fff'};border-radius:8px;border:1px solid ${color}33;font-size:12px;font-family:inherit">
            <span style="color:${color};font-weight:600">${label}: </span>
            <span>${formatAxisValue(val)}</span>
          </div>`;
        },
      },
    };
  };

  const hoverMonth = processedData.labels[processedData.labels.length - 1] || 'AUG';
  const egyptHoverVal =
    processedData.egyptSeriesData[processedData.egyptSeriesData.length - 1] || 0;
  const saudiHoverVal =
    processedData.saudiSeriesData[processedData.saudiSeriesData.length - 1] || 0;

  const egyptChartOptions = useChart(
    buildChartOptions('#E05665', egyptHoverVal, hoverMonth, processedData.labels)
  );

  const saudiChartOptions = useChart(
    buildChartOptions('#2EB67D', saudiHoverVal, hoverMonth, processedData.labels)
  );

  const egyptSeries =
    chartType === 'donut'
      ? processedData.egyptSeriesData
      : [
          {
            name: 'Egypt',
            data: processedData.egyptSeriesData,
          },
        ];

  const saudiSeries =
    chartType === 'donut'
      ? processedData.saudiSeriesData
      : [
          {
            name: 'Saudi Arabia',
            data: processedData.saudiSeriesData,
          },
        ];

  const performanceTabs = [
    { value: 'buyers', label: 'Buyers', icon: 'solar:users-group-rounded-bold-duotone' },
    { value: 'sellers', label: 'Sellers', icon: 'solar:shop-bold-duotone' },
    { value: 'orders', label: 'Orders', icon: 'solar:clipboard-list-bold-duotone' },
    { value: 'auctions', label: 'Auctions', icon: 'solar:hammer-bold-duotone' },
    // { value: 'sales', label: 'Sales', icon: 'solar:chart-square-bold-duotone' },
    // { value: 'revenue', label: 'Revenue', icon: 'solar:wad-of-money-bold-duotone' },
    // { value: 'newusers', label: 'New User', icon: 'solar:user-plus-bold-duotone' },
  ];

  const handleViewAll = () => {
    router.push(paths.dashboard.sales);
  };

  return {
    theme,
    selectedCountry,
    search,
    setSearch,
    selectedTab,
    setSelectedTab,
    filters,
    filtersOpen,
    setFiltersOpen,
    setFiltersHandler,
    clearFilters,
    activeFilterCount,
    activeData: processedData,
    egyptChartOptions,
    saudiChartOptions,
    egyptSeries,
    saudiSeries,
    performanceTabs,
    chartType,
    chartMode,
    setChartMode,
    onViewAll: handleViewAll,
  };
}
