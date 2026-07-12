import type { AxiosProgressEvent } from 'axios';

import axios from 'axios';

import { endpoints } from 'src/utils/endpoints';

import { post } from 'src/lib/axios';

// ----------------------------------------------------------------------

/**
 * Get a presigned URL for uploading a file to cloud storage
 */
export async function uploadImage(image: File, folderName: string): Promise<string> {
  const formData = new FormData();
  formData.append('folder', folderName);
  formData.append('file_name', image.name);
  const response = await post<{ data: string }>(endpoints.imagesBucket.upload, formData);
  return response.data.data;
}

/**
 * Upload a file to cloud storage using a presigned URL
 */
export async function uploadImageToBucket(
  presignedUrl: string,
  image: File,
  options: { onUploadProgress: (progressEvent: AxiosProgressEvent) => void }
) {
  return axios.put(presignedUrl, image, {
    headers: {
      'Content-Type': image.type,
      'Content-Disposition': 'inline',
    },
    onUploadProgress: options.onUploadProgress,
  });
}

/**
 * Delete an image from cloud storage
 */
export async function deleteImageFromAws(imageLink: string) {
  const formData = new FormData();
  formData.append('link', imageLink);
  const response = await post(endpoints.imagesBucket.deleteFromAws, formData);
  return response.data;
}
