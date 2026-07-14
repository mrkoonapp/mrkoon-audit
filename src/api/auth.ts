import type { IUser } from 'src/types/user.types';
import type { UserInfo } from 'src/sections/profile/types';

import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

import { useInvalidateQueries } from 'src/hooks/use-query-hooks';

import { endpoints } from 'src/utils/endpoints';
import { queryKeys } from 'src/utils/query-keys';

import { post } from 'src/lib/axios';
import { useAppDispatch } from 'src/store';
import { userActions } from 'src/store/slices/user-slice';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface LoginRequestData {
  phone: string;
  password: string;
  country_id: string;
}

export interface VerifyLoginData {
  phone: string;
  code: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  data: IUser;
}

// Re-export UserInfo so existing imports from 'src/api/auth' keep working
export type { UserInfo } from 'src/sections/profile/types';

// ----------------------------------------------------------------------
// Standalone API Functions
// ----------------------------------------------------------------------

/**
 * Fetch user profile with an explicit token (for auth callback flow).
 * Passes the token in the Authorization header directly since Redux won't have it yet.
 */
export async function fetchUserProfile(token: string): Promise<UserInfo> {
  const BASE_URL =
    import.meta.env.VITE_HOST_API ||
    import.meta.env.VITE_BASE_URL ||
    import.meta.env.VITE_SERVER_URL;
  const newAxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await newAxiosInstance.get<{ data: UserInfo }>(endpoints.auth.getUserInfo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data;
}

// ----------------------------------------------------------------------
// Mutation Hooks
// ----------------------------------------------------------------------

/**
 * Step 1 — request login. Sends phone + password (+ country_id); the backend
 * responds by sending an OTP code to the user. No token is issued yet.
 * Mirrors mrkoon-admin `auth/login`.
 */
async function loginRequest(data: LoginRequestData) {
  const formData = new FormData();
  formData.append('phone', data.phone);
  formData.append('password', data.password);
  formData.append('country_id', data.country_id);

  const response = await post(endpoints.auth.login, formData);
  return response.data;
}

export function useLoginRequest() {
  return useMutation({ mutationFn: loginRequest });
}

/**
 * Step 2 — verify the OTP code. Sends code + phone; the backend returns the
 * authenticated user + token. Mirrors mrkoon-admin `auth/check_code_to_login`.
 */
async function verifyLoginCode(data: VerifyLoginData) {
  const formData = new FormData();
  formData.append('code', data.code);
  formData.append('phone', data.phone);

  const response = await post<AuthResponse>(endpoints.auth.checkLoginCode, formData);
  return response.data;
}

export function useVerifyLogin() {
  const { invalidate } = useInvalidateQueries();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: verifyLoginCode,
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.token);
      document.cookie = `token=${data.data.token}; path=/; max-age=${60 * 60 * 24 * 365}`;
      // Pass the IUser payload (data.data), not the whole AuthResponse wrapper —
      // the login reducer reads flat fields (payload.token, payload.id, ...), so
      // dispatching `data` would leave state.user.token undefined and bounce the
      // user back to sign-in via AuthGuard.
      dispatch(userActions.login(data.data));
      invalidate(queryKeys.auth.all);
    },
    onError: (error) => {
      console.error('Login verification failed:', error);
    },
  });
}

/**
 * Sign up mutation
 */
export function useSignUp() {
  return useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await post<AuthResponse>(endpoints.auth.signup, data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.data.token);
    },
    onError: (error) => {
      console.error('Sign up failed:', error);
    },
  });
}

/**
 * Logout mutation
 */
export function useLogout() {
  const { invalidate } = useInvalidateQueries();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async () => {
      const response = await post(endpoints.auth.logout);
      return response.data;
    },
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      dispatch(userActions.logout());
      invalidate([]);
    },
  });
}

/**
 * Forgot password mutation
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await post(endpoints.auth.forgetPassword, { email });
      return response.data;
    },
  });
}

/**
 * Reset password mutation
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (data: { code: string; password: string }) => {
      const response = await post(endpoints.auth.resetPassword, data);
      return response.data;
    },
  });
}

/**
 * Verify account mutation
 */
export function useVerifyAccount() {
  return useMutation({
    mutationFn: async (code: string) => {
      const response = await post(endpoints.auth.checkCode, { code });
      return response.data;
    },
  });
}

/**
 * Resend verification code mutation
 */
export function useResendCode() {
  return useMutation({
    mutationFn: async () => {
      const response = await post(endpoints.auth.resendCode);
      return response.data;
    },
  });
}
