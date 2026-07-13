import type { AxiosProgressEvent } from 'axios';
import type { Path, PathValue, FieldValues, UseFormReturn } from 'react-hook-form';

import { useRef, useState, useCallback } from 'react';

import { uploadImage, uploadImageToBucket } from 'src/lib/image-upload';

import { useWatermark } from './use-watermark';

// ----------------------------------------------------------------------

interface UploadState {
  loading: boolean;
  progress: number;
}

/** A single upload tile — either in-flight (`uploading`) or failed (`error`). */
export interface UploadingItem {
  id: string;
  file: File;
  preview: string;
  progress: number;
  isVideo: boolean;
  status: 'uploading' | 'error';
  /** A retry is in flight — the tile stays in its `error` state but shows a spinner. */
  retrying?: boolean;
}

const isVideoFile = (file: File): boolean => file.type.startsWith('video/');

/**
 * Custom hook for handling multiple file uploads with presigned URL flow
 */
export function useUploadMultiple<T extends FieldValues>(
  methods: UseFormReturn<T>,
  name: Path<T>,
  folderName: string,
  withWatermark = false,
  onUploadComplete?: (uploadedUrls: string[]) => void
) {
  const [uploadingItems, setUploadingItems] = useState<UploadingItem[]>([]);
  const idCounter = useRef(0);

  const { addWatermark } = useWatermark();

  // Upload a single file. On success its tile is removed and the URL appended to
  // the form value; on failure the tile is kept as `error` so it can be retried.
  // A retry keeps the tile in its `error` state (just flagged `retrying`) so the
  // error UI/alert never flashes away — it clears only on success.
  const uploadOne = useCallback(
    async (
      { id, file, preview }: { id: string; file: File; preview: string },
      { retry = false }: { retry?: boolean } = {}
    ) => {
      setUploadingItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          return retry
            ? { ...item, retrying: true }
            : { ...item, status: 'uploading', progress: 0, retrying: false };
        })
      );

      try {
        const fileToUpload = withWatermark && !isVideoFile(file) ? await addWatermark(file) : file;

        const presignedUrl = await uploadImage(fileToUpload, folderName);

        await uploadImageToBucket(presignedUrl, fileToUpload, {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const progress = Math.round((progressEvent.loaded / (progressEvent.total ?? 1)) * 100);
            setUploadingItems((prev) =>
              prev.map((item) => (item.id === id ? { ...item, progress } : item))
            );
          },
        });

        const url = presignedUrl?.split('?')[0] ?? '';
        setUploadingItems((prev) => prev.filter((item) => item.id !== id));
        URL.revokeObjectURL(preview);

        const oldValues = methods.getValues(name) as PathValue<T, Path<T>>;
        methods.setValue(name, [...(oldValues as string[]), url] as PathValue<T, Path<T>>, {
          shouldValidate: true,
        });

        if (onUploadComplete) onUploadComplete([url]);
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadingItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: 'error', progress: 0, retrying: false } : item
          )
        );
      }
    },
    [methods, name, folderName, withWatermark, onUploadComplete, addWatermark]
  );

  const handleDropMultiple = useCallback(
    async (acceptedFiles: File[]) => {
      // One tile per dropped file, each tracking its own progress / failure state.
      const entries = acceptedFiles.map((file) => {
        idCounter.current += 1;
        return {
          id: `upload-${idCounter.current}`,
          file,
          preview: URL.createObjectURL(file),
          isVideo: isVideoFile(file),
        };
      });

      setUploadingItems((prev) => [
        ...prev,
        ...entries.map((entry) => ({ ...entry, progress: 0, status: 'uploading' as const })),
      ]);

      await Promise.all(entries.map((entry) => uploadOne(entry)));
    },
    [uploadOne]
  );

  // Retry a previously failed upload (same file). Keeps the error state visible
  // (with a spinner) until it succeeds or is removed — never flashes back to ok.
  const retryUpload = useCallback(
    (item: UploadingItem) => {
      if (item.retrying) return;
      uploadOne({ id: item.id, file: item.file, preview: item.preview }, { retry: true });
    },
    [uploadOne]
  );

  // Discard a failed (or pending) tile and release its preview URL.
  const removeUploadingItem = useCallback((id: string) => {
    setUploadingItems((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const handleRemoveFile = useCallback(
    (fileToRemove: string | File) => {
      const currentFiles = methods.getValues(name) as string[];
      const updatedFiles = currentFiles.filter((file) => file !== fileToRemove);
      methods.setValue(name, updatedFiles as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });
    },
    [methods, name]
  );

  const isUploading = uploadingItems.some((item) => item.status === 'uploading');
  const hasFailedUploads = uploadingItems.some((item) => item.status === 'error');

  return {
    handleDropMultiple,
    handleRemoveFile,
    uploadingItems,
    retryUpload,
    removeUploadingItem,
    isUploading,
    hasFailedUploads,
  };
}

/**
 * Custom hook for handling single file upload with presigned URL flow
 */
export function useUploadSingleImage<T extends FieldValues>(
  setValue: UseFormReturn<T>['setValue'],
  name: Path<T>,
  folderName = 'user',
  withWatermark = false,
  onUploadComplete?: (url: string) => void
) {
  const [uploadState, setUploadState] = useState<UploadState>({
    loading: false,
    progress: 0,
  });

  const { addWatermark } = useWatermark();

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      let file = acceptedFiles[0];

      try {
        setUploadState({ loading: true, progress: 10 });

        if (withWatermark && file.type.startsWith('image/')) {
          file = await addWatermark(file);
        }
        setUploadState((prev) => ({ ...prev, progress: 20 }));

        const presignedUrl = await uploadImage(file, folderName);
        setUploadState((prev) => ({ ...prev, progress: 40 }));

        await uploadImageToBucket(presignedUrl, file, {
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 60) / (progressEvent.total ?? 1)
            );
            setUploadState((prev) => ({ ...prev, progress: 40 + percentCompleted }));
          },
        });

        const newFileUrl = presignedUrl?.split('?')[0] ?? '';
        setValue(name, newFileUrl as PathValue<T, Path<T>>, { shouldValidate: true });
        setUploadState({ loading: false, progress: 100 });

        if (onUploadComplete && newFileUrl) {
          onUploadComplete(newFileUrl);
        }
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadState({ loading: false, progress: 0 });
      }
    },
    [setValue, name, folderName, withWatermark, addWatermark, onUploadComplete]
  );

  const handleRemoveSingle = useCallback(() => {
    setValue(name, '' as PathValue<T, Path<T>>, { shouldValidate: true });
    setUploadState({ loading: false, progress: 0 });
  }, [setValue, name]);

  return { handleDrop, handleRemoveSingle, uploadState };
}
