import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from 'src/locales';
import { useLoginRequest } from 'src/api/auth';
import { useGetCountries } from 'src/api/countries';

import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';

import { OtpVerifyDialog } from './otp-verify-dialog';

// ----------------------------------------------------------------------

export function SignInView() {
  const { t } = useTranslate();
  const showPassword = useBoolean();

  const SignInPhoneSchema = zod.object({
    phone: zod.string().min(1, { message: t('auth.phoneRequired') }),
    password: zod.string().min(1, { message: t('auth.passwordRequired') }),
    country_id: zod.string().min(1, { message: t('auth.countryRequired') }),
  });

  type SignInPhoneSchemaType = zod.infer<typeof SignInPhoneSchema>;

  const otpDialog = useBoolean();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpPayload, setOtpPayload] = useState<{
    phone: string;
    password: string;
    countryId: string;
  } | null>(null);

  // Get countries
  const { data: countriesData, isLoading: countriesLoading } = useGetCountries({ limit: 270 });

  const defaultValues: SignInPhoneSchemaType = {
    phone: '',
    password: '',
    country_id: '',
  };

  const methods = useForm<SignInPhoneSchemaType>({
    resolver: zodResolver(SignInPhoneSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Step 1 — login request (sends OTP)
  const loginRequestMutation = useLoginRequest();

  useEffect(() => {
    if (countriesData?.length) {
      const firstCountryId = String(countriesData[0].id);
      setValue('country_id', firstCountryId);
    }
  }, [countriesData, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage(null);

      await loginRequestMutation.mutateAsync({
        phone: data.phone,
        password: data.password,
        country_id: data.country_id,
      });
      setOtpPayload({ phone: data.phone, password: data.password, countryId: data.country_id });
      otpDialog.onTrue();
    } catch (error: any) {
      const message = error.message || t('auth.otpError');
      setErrorMessage(message);
    }
  });

  const handleCloseOtpDialog = useCallback(() => {
    otpDialog.onFalse();
  }, [otpDialog]);

  const renderHead = (
    <Stack spacing={1.5} sx={{ mb: 5 }}>
      <Typography variant="h5">{t('auth.signInTitle')}</Typography>
    </Stack>
  );

  const renderForm = () => (
    <Stack spacing={3}>
      {/* Phone Number Input */}
      <Field.Phone
        name="phone"
        label={t('auth.phoneNumber')}
        countryFieldName="country_id"
        countries={countriesData || []}
      />

      {/* Password Field with Show/Hide Toggle */}
      <Stack spacing={1.5}>
        <Field.Text
          name="password"
          label={t('auth.password')}
          type={showPassword.value ? 'text' : 'password'}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {/* Send OTP Button */}
      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting || loginRequestMutation.isPending}
        loadingIndicator={t('auth.sendingOtp')}
        disabled={countriesLoading}
      >
        {t('auth.sendOtp')}
      </Button>
    </Stack>
  );

  if (countriesLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {renderHead}

      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      {otpPayload && (
        <OtpVerifyDialog
          open={otpDialog.value}
          onClose={handleCloseOtpDialog}
          phone={otpPayload.phone}
          password={otpPayload.password}
          countryId={otpPayload.countryId}
        />
      )}
    </>
  );
}
