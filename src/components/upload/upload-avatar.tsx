import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { varAlpha, mergeClasses } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';

import { Image } from '../image';
import { Iconify } from '../iconify';
import { uploadClasses } from './classes';
import { RejectionFiles } from './components/rejection-files';

import type { UploadProps } from './types';

// ----------------------------------------------------------------------

export function UploadAvatar({
  sx,
  error,
  value,
  disabled,
  loading,
  progress,
  helperText,
  className,
  ...other
}: UploadProps) {
  const { t } = useTranslate();

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    disabled: disabled || loading,
    accept: { 'image/*': [] },
    ...other,
  });

  const hasFile = !!value;

  const hasError = isDragReject || !!error;

  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (typeof value === 'string') {
      setPreview(value);
    } else if (value instanceof File) {
      setPreview(URL.createObjectURL(value));
    }
  }, [value]);

  const renderPreview = () =>
    hasFile && (
      <Image alt="Avatar" src={preview} sx={{ width: 1, height: 1, borderRadius: '50%' }} />
    );

  const renderPlaceholder = () => (
    <Box
      className="upload-placeholder"
      sx={(theme) => ({
        top: 0,
        gap: 1,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 9,
        display: 'flex',
        borderRadius: '50%',
        position: 'absolute',
        alignItems: 'center',
        color: 'text.disabled',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
        transition: theme.transitions.create(['opacity'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': { opacity: 0.72 },
        ...(hasError && {
          color: 'error.main',
          bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
        }),
        ...(hasFile && {
          zIndex: 9,
          opacity: 0,
          color: 'common.white',
          bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.64),
        }),
      })}
    >
      <Iconify icon="solar:camera-add-bold" width={32} />

      <Typography variant="caption">{hasFile ? t('profile.update_photo') : t('profile.upload_photo')}</Typography>
    </Box>
  );

  const renderLoadingOverlay = () => (
    <Box
      sx={(theme) => ({
        top: 0,
        left: 0,
        width: 1,
        height: 1,
        zIndex: 10,
        display: 'flex',
        borderRadius: '50%',
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        bgcolor: varAlpha(theme.vars.palette.grey['900Channel'], 0.64),
      })}
    >
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={progress ?? 0}
          size={48}
          thickness={4}
          sx={{ color: 'common.white' }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'common.white', fontWeight: 'bold' }}>
            {`${Math.round(progress ?? 0)}%`}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderContent = () => (
    <Box
      sx={{
        width: 1,
        height: 1,
        overflow: 'hidden',
        borderRadius: '50%',
        position: 'relative',
      }}
    >
      {renderPreview()}
      {loading ? renderLoadingOverlay() : renderPlaceholder()}
    </Box>
  );

  return (
    <>
      <Box
        {...getRootProps()}
        className={mergeClasses([uploadClasses.uploadBox, className])}
        sx={[
          (theme) => ({
            p: 1,
            m: 'auto',
            width: 144,
            height: 144,
            cursor: 'pointer',
            overflow: 'hidden',
            borderRadius: '50%',
            border: `1px dashed ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
            ...(isDragActive && { opacity: 0.72 }),
            ...((disabled || loading) && { opacity: 0.48, pointerEvents: 'none' }),
            ...(hasError && { borderColor: 'error.main' }),
            ...(hasFile && {
              ...(hasError && { bgcolor: varAlpha(theme.vars.palette.error.mainChannel, 0.08) }),
              '&:hover .upload-placeholder': { opacity: 1 },
            }),
            ...(loading && { opacity: 1 }),
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <input {...getInputProps()} />

        {renderContent()}
      </Box>

      {helperText && helperText}

      {!!fileRejections.length && <RejectionFiles files={fileRejections} />}
    </>
  );
}
