import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { fNumber } from 'src/utils/format-number';

export function DataRoomKpiTable({ rawKpis }: { rawKpis: any }) {
  if (!rawKpis) return null;

  // Country ID 6 = Egypt, 26 = Saudi Arabia
  const getCountryValue = (breakdown: any[], countryId: number, fieldName: string) => {
    if (!breakdown || !Array.isArray(breakdown)) return '-';
    const country = breakdown.find((c) => c.country_id === countryId);
    return country && country[fieldName] !== undefined ? country[fieldName] : '-';
  };

  const getTopTagsValue = (tags: any[], countryCode?: string) => {
    if (!tags || !Array.isArray(tags)) return '-';
    // The backend top_tags_gmv might not have country breakdown per tag, 
    // but if we are just showing the top 3 generally:
    if (countryCode) return '-'; 
    const top3 = tags.slice(0, 3).map(t => `${t.name_en || t.name_ar}: ${fNumber(t.gmv)}`);
    return top3.join(' | ') || '-';
  };

  // We will map the exact text from the image
  const rows = [
    // Group: First Products
    { isGroup: true, label: 'First Products' },
    {
      kpiName: 'Total products',
      definition: '',
      total: rawKpis.advanced_products?.total ?? rawKpis.total_products ?? 0,
      egypt: getCountryValue(rawKpis.advanced_products?.country_breakdown, 6, 'total'),
      saudi: getCountryValue(rawKpis.advanced_products?.country_breakdown, 26, 'total'),
    },
    {
      kpiName: 'New products (monthly)',
      definition: '',
      total: rawKpis.advanced_products?.new_in_period ?? rawKpis.new_products ?? 0,
      egypt: getCountryValue(rawKpis.advanced_products?.country_breakdown, 6, 'new_in_period'),
      saudi: getCountryValue(rawKpis.advanced_products?.country_breakdown, 26, 'new_in_period'),
    },
    {
      kpiName: 'Auctions (monthly)',
      definition: 'end-date',
      total: rawKpis.total_auctions ?? 0,
      egypt: '-',
      saudi: '-',
    },
    {
      kpiName: 'Done (monthly)',
      definition: 'end-date (status 22 18 68)',
      total: rawKpis.auctions_done ?? 0,
      egypt: '-',
      saudi: '-',
    },
    {
      kpiName: 'Total money (monthly)',
      definition: 'GMV transactions and mrkoon plus transactions',
      total: rawKpis.total_money ?? 0,
      egypt: '-',
      saudi: '-',
    },
    {
      kpiName: 'Top 3 tags with GMV',
      definition: '',
      total: getTopTagsValue(rawKpis.top_tags_gmv),
      egypt: '-',
      saudi: '-',
    },

    // Group: IT Traders (Buyers)
    { isGroup: true, label: 'IT Traders (Buyers)' },
    {
      kpiName: 'Total buyers',
      definition: '',
      total: rawKpis.advanced_buyers?.total ?? rawKpis.total_buyers ?? 0,
      egypt: getCountryValue(rawKpis.advanced_buyers?.country_breakdown, 6, 'total'),
      saudi: getCountryValue(rawKpis.advanced_buyers?.country_breakdown, 26, 'total'),
    },
    {
      kpiName: 'Active buyers (monthly)',
      definition: 'who made pay-requests this months',
      total: rawKpis.advanced_buyers?.active ?? rawKpis.active_buyers ?? 0,
      egypt: getCountryValue(rawKpis.advanced_buyers?.country_breakdown, 6, 'active'),
      saudi: getCountryValue(rawKpis.advanced_buyers?.country_breakdown, 26, 'active'),
    },
    {
      kpiName: 'Registred buyers (monthly)',
      definition: 'which created at with this month',
      total: rawKpis.advanced_buyers?.registered_in_period ?? rawKpis.registered_buyers ?? 0,
      egypt: getCountryValue(rawKpis.advanced_buyers?.country_breakdown, 6, 'registered_in_period'),
      saudi: getCountryValue(rawKpis.advanced_buyers?.country_breakdown, 26, 'registered_in_period'),
    },
    {
      kpiName: 'Active new buyers (monthly)',
      definition: 'who made pay-request and registered this month',
      total: rawKpis.advanced_buyers?.active_new_in_period ?? rawKpis.active_new_buyers ?? 0,
      egypt: getCountryValue(rawKpis.advanced_buyers?.country_breakdown, 6, 'active_new_in_period'),
      saudi: getCountryValue(rawKpis.advanced_buyers?.country_breakdown, 26, 'active_new_in_period'),
    },

    // Group: IT Suppliers (Sellers)
    { isGroup: true, label: 'IT Suppliers (Sellers)' },
    {
      kpiName: 'Total sellers',
      definition: '',
      total: rawKpis.advanced_sellers?.total ?? rawKpis.total_sellers ?? 0,
      egypt: getCountryValue(rawKpis.advanced_sellers?.country_breakdown, 6, 'total'),
      saudi: getCountryValue(rawKpis.advanced_sellers?.country_breakdown, 26, 'total'),
    },
    {
      kpiName: 'Active sellers (monthly)',
      definition: 'who listed one product',
      total: rawKpis.advanced_sellers?.active ?? rawKpis.active_sellers ?? 0,
      egypt: getCountryValue(rawKpis.advanced_sellers?.country_breakdown, 6, 'active'),
      saudi: getCountryValue(rawKpis.advanced_sellers?.country_breakdown, 26, 'active'),
    },
    {
      kpiName: 'Registred sellers(monthly)',
      definition: 'which created at with this month',
      total: rawKpis.advanced_sellers?.registered_in_period ?? rawKpis.registered_sellers ?? 0,
      egypt: getCountryValue(rawKpis.advanced_sellers?.country_breakdown, 6, 'registered_in_period'),
      saudi: getCountryValue(rawKpis.advanced_sellers?.country_breakdown, 26, 'registered_in_period'),
    },
    {
      kpiName: 'Active new sellers (monthly)',
      definition: 'who listed one product and registered this month',
      total: rawKpis.advanced_sellers?.active_new_in_period ?? rawKpis.active_new_sellers ?? 0,
      egypt: getCountryValue(rawKpis.advanced_sellers?.country_breakdown, 6, 'active_new_in_period'),
      saudi: getCountryValue(rawKpis.advanced_sellers?.country_breakdown, 26, 'active_new_in_period'),
    },
  ];

  const formatCell = (val: string | number) => {
    if (val === '-' || typeof val === 'string') return val;
    return fNumber(val);
  };

  return (
    <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: (theme) => theme.customShadows?.z4 || 1 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'background.neutral' }}>
            <TableCell sx={{ fontWeight: 'bold' }}>KPI Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Definition</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Country Egypt</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Saudi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => {
            if (row.isGroup) {
              return (
                <TableRow key={`group-${index}`} sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1D2734' : '#F4F6F8' }}>
                  <TableCell colSpan={5} sx={{ py: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      {row.label}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            }

            return (
              <TableRow key={`row-${index}`} hover>
                <TableCell sx={{ fontWeight: 'medium' }}>{row.kpiName}</TableCell>
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.definition}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{formatCell(row.total as string | number)}</TableCell>
                <TableCell>{formatCell(row.egypt as string | number)}</TableCell>
                <TableCell>{formatCell(row.saudi as string | number)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
