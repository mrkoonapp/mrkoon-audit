// ----------------------------------------------------------------------
// API Endpoints Configuration
// ----------------------------------------------------------------------

export const endpoints = {
  // Authentication (mirrors mrkoon-admin: login with password -> OTP code verify)
  auth: {
    login: 'auth/login',
    checkLoginCode: 'auth/check_code_to_login',
    logout: 'auth/logout',
    forgetPassword: 'auth/forget_password',
    resetPassword: 'auth/reset_password',
    signup: 'auth/register',
    checkCode: 'auth/check_active_code',
    resendCode: 'auth/resend_code',
    getUserInfo: 'auth/my_info',
  },

  // General
  countries: {
    list: 'home/get_countries', // Website API endpoint for login/register screens
  },

  // Images Bucket
  imagesBucket: {
    upload: 'aws/saveImageInBucket',
    deleteFromAws: 'aws/delete_image_from_aws_using_link',
  },

  // Audit Module
  audit: {
    home: {
      kpis: 'audit/home/kpis',
      transactionsChart: 'audit/home/transactions-chart',
      transactionTotals: 'audit/home/transaction-totals',
      topSellers: 'audit/home/top-sellers',
      topCategories: 'audit/home/top-categories',
      topTags: 'audit/home/top-tags',
      successRate: 'audit/home/success-rate',
    },
    auctions: {
      kpis: 'audit/auctions/kpis',
      byCategory: 'audit/auctions/by-category',
      participatedClients: 'audit/auctions/participated-clients',
      list: 'audit/auctions/list',
    },
    inspections: {
      kpis: 'audit/inspections/kpis',
      byCategory: 'audit/inspections/by-category',
      byPaymentMethod: 'audit/inspections/by-payment-method',
      list: 'audit/inspections/list',
      perAuction: 'audit/inspections/per-auction',
    },
    sales: {
      kpis: 'audit/sales/kpis',
      merchantUpdates: 'audit/sales/merchant-updates',
      newMerchants: 'audit/sales/new-merchants',
      topMerchants: 'audit/sales/top-merchants',
      topSuccess: 'audit/sales/top-success',
    },
    operations: {
      kpis: 'audit/operations/kpis',
    },
    onboarding: {
      kpis: 'audit/onboarding/kpis',
    },
  },
};
