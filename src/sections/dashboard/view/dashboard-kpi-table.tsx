import React from 'react';
import dayjs from 'dayjs';

import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

import { fNumber } from 'src/utils/format-number';

export function DashboardKpiTable({ rawKpis, filters }: { rawKpis: any; filters?: any }) {
  if (!rawKpis) return null;

  // Dynamically extract unique countries from all available breakdowns
  const getUniqueCountries = () => {
    const allBreakdowns = [
      ...(rawKpis?.advanced_products?.country_breakdown || []),
      ...(rawKpis?.advanced_buyers?.country_breakdown || []),
      ...(rawKpis?.advanced_sellers?.country_breakdown || []),
      ...(rawKpis?.advanced_auctions?.outcomes || []),
    ];
    
    const countriesMap = new Map();
    allBreakdowns.forEach((c) => {
      if (c.country_id) {
        let name = 'Unknown';
        if (typeof c.country_name === 'object' && c.country_name !== null) {
          name = c.country_name.en || c.country_name.ar || c.country_code || String(c.country_id);
        } else if (c.country_name) {
          name = c.country_name;
        } else if (c.country_code) {
          name = c.country_code;
        } else {
          name = `Country ${c.country_id}`;
        }
        
        // Let's ensure standard names if available
        if (c.country_id === 6 && name.toLowerCase().includes('country 6')) name = 'Egypt';
        if (c.country_id === 26 && name.toLowerCase().includes('country 26')) name = 'Saudi Arabia';
        
        countriesMap.set(c.country_id, name);
      }
    });
    
    return Array.from(countriesMap.entries()).map(([id, name]) => ({ id, name }));
  };

  const countries = getUniqueCountries();
  const showBreakdown = countries.length > 1;

  const getCountryValue = (breakdown: any[], countryId: number, fieldName: string) => {
    if (!breakdown || !Array.isArray(breakdown)) return '-';
    const country = breakdown.find((c) => c.country_id === countryId);
    return country && country[fieldName] !== undefined ? country[fieldName] : '-';
  };

  const getTopTagsValue = (tags: any[]) => {
    if (!tags || !Array.isArray(tags)) return '-';
    const top3 = tags.slice(0, 3).map((t, idx) => (
      <React.Fragment key={t.tag_id || idx}>
        {`${t.name_en || t.name_ar}: ${fNumber(t.gmv)}`}
        {idx < tags.slice(0, 3).length - 1 && <br />}
      </React.Fragment>
    ));
    return top3.length > 0 ? <>{top3}</> : '-';
  };

  // Build the period label based on filters
  let periodLabel = '';
  if (filters?.startDate && filters?.endDate) {
    periodLabel = `from ${dayjs(filters.startDate).format('D/M/YYYY')} to ${dayjs(filters.endDate).format('D/M/YYYY')}`;
    if (filters.period === 'monthly' || filters.period === 'this_month') {
      periodLabel = `this month ${periodLabel}`;
    }
  } else if (filters?.period) {
    periodLabel = `(${filters.period.replace('_', ' ')})`;
  }

  // Helper to generate a country values array for a given field
  const getCountryValuesObj = (breakdown: any[], fieldName: string) => {
    const result: Record<number, any> = {};
    countries.forEach(c => {
      result[c.id] = getCountryValue(breakdown, c.id, fieldName);
    });
    return result;
  };

  // Helper for Outcomes breakdown
  const getOutcomeStats = (matcher: (o: any) => boolean) => {
    const outcomes = rawKpis?.advanced_auctions?.outcomes || [];
    const matched = outcomes.filter((o: any) => matcher(o));
    
    const total = matched.reduce((sum: number, o: any) => sum + (o.products_count || 0), 0);
    const countryValues: Record<number, any> = {};
    countries.forEach(c => {
      const cTotal = matched.filter((o: any) => o.country_id === c.id).reduce((sum: number, o: any) => sum + (o.products_count || 0), 0);
      countryValues[c.id] = cTotal > 0 ? cTotal : '-';
    });
    return { total, countryValues };
  };

  const isSold = (o: any) => o.status_id === 68 || o.status === 68 || String(o.outcome || '').includes('68') || (String(o.outcome || '').toLowerCase().includes('sold') && !String(o.outcome || '').toLowerCase().includes('not sold'));
  const isEnded = (o: any) => o.status_id === 18 || o.status === 18 || String(o.outcome || '').includes('18') || String(o.outcome || '').toLowerCase().includes('ended');
  const isAccepted = (o: any) => o.status_id === 22 || o.status === 22 || String(o.outcome || '').includes('22') || String(o.outcome || '').toLowerCase().includes('accepted');

  const soldStats = getOutcomeStats(isSold);
  const endedStats = getOutcomeStats(isEnded);
  const acceptedStats = getOutcomeStats(isAccepted);

  const auctionsDoneTotal = soldStats.total + acceptedStats.total + endedStats.total;
  const auctionsDoneCountryValues: Record<number, any> = {};
  countries.forEach(c => {
    const s = soldStats.countryValues[c.id] !== '-' ? soldStats.countryValues[c.id] : 0;
    const a = acceptedStats.countryValues[c.id] !== '-' ? acceptedStats.countryValues[c.id] : 0;
    const e = endedStats.countryValues[c.id] !== '-' ? endedStats.countryValues[c.id] : 0;
    const sum = s + a + e;
    auctionsDoneCountryValues[c.id] = sum > 0 ? sum : '-';
  });

  const rows = [
    // Group: Products
    { isGroup: true, label: `PRODUCTS KPIS ${periodLabel}`.trim() },
    {
      kpiName: 'Total products',
      definition: 'The total number of products currently in the system',
      total: rawKpis.advanced_products?.total ?? rawKpis.total_products ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_products?.country_breakdown, 'total_count'),
    },
    {
      kpiName: 'New products',
      definition: 'Number of new products added during the selected period',
      total: rawKpis.advanced_products?.new_in_period ?? rawKpis.new_products ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_products?.country_breakdown, 'new_count'),
    },
    {
      kpiName: 'Auctions',
      definition: 'end-date',
      total: rawKpis.total_auctions ?? 0,
      countryValues: getCountryValuesObj([], 'total'), // no breakdown available usually
    },
    {
      kpiName: 'Auctions Done',
      definition: 'end-date (status 22 18 68)',
      total: auctionsDoneTotal,
      countryValues: auctionsDoneCountryValues,
    },
    {
      kpiName: '',
      definition: '↳ Sold (68)',
      total: soldStats.total,
      countryValues: soldStats.countryValues,
    },
    {
      kpiName: '',
      definition: '↳ Ended (18)',
      total: endedStats.total,
      countryValues: endedStats.countryValues,
    },
    {
      kpiName: '',
      definition: '↳ Accepted (22)',
      total: acceptedStats.total,
      countryValues: acceptedStats.countryValues,
    },
    {
      kpiName: 'Total money',
      definition: 'GMV transactions and mrkoon plus transactions',
      total: rawKpis.gmv ?? rawKpis.total_money ?? 0,
      countryValues: getCountryValuesObj([], 'total'),
    },
    {
      kpiName: 'Top 3 tags with GMV',
      definition: 'Top 3 tags driving the most GMV',
      total: getTopTagsValue(rawKpis.top_tags_gmv),
      countryValues: getCountryValuesObj([], 'total'),
    },

    // Group: Traders (Buyers)
    { isGroup: true, label: `Traders (Buyers) ${periodLabel}`.trim() },
    {
      kpiName: 'Total buyers',
      definition: 'Total registered buyers in the system',
      total: rawKpis.advanced_buyers?.total ?? rawKpis.total_buyers ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_buyers?.country_breakdown, 'total_count'),
    },
    {
      kpiName: 'Active buyers',
      definition: 'who made pay-requests this months',
      total: rawKpis.advanced_buyers?.active ?? rawKpis.active_buyers ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_buyers?.country_breakdown, 'active_count'),
    },
    {
      kpiName: 'Registred buyers',
      definition: 'which created at with this month',
      total: rawKpis.advanced_buyers?.registered_in_period ?? rawKpis.registered_buyers ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_buyers?.country_breakdown, 'new_count'),
    },
    {
      kpiName: 'Active new buyers',
      definition: 'who made pay-request and registered this month',
      total: rawKpis.advanced_buyers?.active_new_in_period ?? rawKpis.active_new_buyers ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_buyers?.country_breakdown, 'active_new_count'),
    },

    // Group: Suppliers (Sellers)
    { isGroup: true, label: `Suppliers (Sellers) ${periodLabel}`.trim() },
    {
      kpiName: 'Total sellers',
      definition: 'Total registered sellers in the system',
      total: rawKpis.advanced_sellers?.total ?? rawKpis.total_sellers ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_sellers?.country_breakdown, 'total_count'),
    },
    {
      kpiName: 'Active sellers',
      definition: 'who listed one product',
      total: rawKpis.advanced_sellers?.active ?? rawKpis.active_sellers ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_sellers?.country_breakdown, 'active_count'),
    },
    {
      kpiName: 'Registred sellers',
      definition: 'which created at with this month',
      total: rawKpis.advanced_sellers?.registered_in_period ?? rawKpis.registered_sellers ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_sellers?.country_breakdown, 'new_count'),
    },
    {
      kpiName: 'Active new sellers',
      definition: 'who listed one product and registered this month',
      total: rawKpis.advanced_sellers?.active_new_in_period ?? rawKpis.active_new_sellers ?? 0,
      countryValues: getCountryValuesObj(rawKpis.advanced_sellers?.country_breakdown, 'active_new_count'),
    },
  ];

  const formatCell = (val: any) => {
    if (val === '-' || React.isValidElement(val)) return val;
    const num = Number(val);
    if (!isNaN(num) && typeof val !== 'boolean' && val !== '') return fNumber(num);
    return val;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        mb: 4,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: (theme) => theme.customShadows?.z4 || 1,
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'background.neutral' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>KPI Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Definition</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
            {showBreakdown &&
              countries.map((c) => (
                <TableCell key={c.id} sx={{ fontWeight: 'bold' }}>
                  {c.name}
                </TableCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            if (row.isGroup) {
              return (
                <TableRow
                  key={`group-${index}`}
                  sx={{ bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1D2734' : '#F4F6F8') }}
                >
                  <TableCell colSpan={3 + (showBreakdown ? countries.length : 0)} sx={{ py: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase' }}>
                      {row.label}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow key={`row-${index}`} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{row.kpiName}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  {row.definition}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{formatCell(row.total)}</TableCell>
                
                {showBreakdown &&
                  countries.map((c) => (
                    <TableCell key={c.id}>{formatCell(row.countryValues?.[c.id])}</TableCell>
                  ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
