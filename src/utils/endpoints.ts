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
};
