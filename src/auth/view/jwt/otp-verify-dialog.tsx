import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCountdownSeconds } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useVerifyLogin, useLoginRequest } from 'src/api/auth';

import { Form, Field } from 'src/components/hook-form';

import { FormResendCode } from '../../components/form-resend-code';

// ----------------------------------------------------------------------

type OtpVerifyDialogProps = {
  open: boolean;
  onClose: () => void;
  phone: string;
  password: string;
  countryId: string;
};

// ----------------------------------------------------------------------

export function OtpVerifyDialog({
  open,
  onClose,
  phone,
  password,
  countryId,
}: OtpVerifyDialogProps) {
  const { t } = useTranslate();

  const OtpSchema = zod.object({
    code: zod
      .string()
      .min(1, { message: t('auth.codeRequired') })
      .min(6, { message: t('auth.codeMin') }),
  });

  type OtpSchemaType = zod.infer<typeof OtpSchema>;

  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const countdown = useCountdownSeconds(90);

  const verifyLoginMutation = useVerifyLogin();
  const loginRequestMutation = useLoginRequest();

  const methods = useForm<OtpSchemaType>({
    resolver: zodResolver(OtpSchema),
    defaultValues: { code: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMessage(null);

      // Verify the OTP code — the hook stores the token + user on success
      await verifyLoginMutation.mutateAsync({ phone, code: data.code });

      // Redirect to dashboard after successful login
      router.push(paths.dashboard.root);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      setErrorMessage(error.message || t('auth.verifyError'));
    }
  });

  const handleResendCode = useCallback(async () => {
    if (!countdown.isCounting) {
      try {
        setErrorMessage(null);
        countdown.reset();
        countdown.start();

        await loginRequestMutation.mutateAsync({ phone, password, country_id: countryId });
      } catch (error: any) {
        console.error('Resend OTP error:', error);
        setErrorMessage(error.message || t('auth.resendError'));
      }
    }
  }, [countdown, phone, password, countryId, loginRequestMutation, t]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{t('auth.verifyTitle')}</DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          {t('auth.verifyDesc')}
        </Typography>

        {!!errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Form methods={methods} onSubmit={onSubmit}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Field.Code name="code" validateChar={(val) => /^\d+$/.test(val)} />

            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting || verifyLoginMutation.isPending}
              loadingIndicator={t('auth.verifying')}
            >
              {t('auth.verify')}
            </Button>
          </Box>

          <FormResendCode
            onResendCode={handleResendCode}
            value={countdown.value}
            disabled={countdown.isCounting}
          />
        </Form>
      </DialogContent>
    </Dialog>
  );
}
