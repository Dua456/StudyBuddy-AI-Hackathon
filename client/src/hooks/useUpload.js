import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (formData) => {
    setUploading(true);
    setProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const { data } = await api.post('/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      clearInterval(progressInterval);
      setProgress(100);
      toast.success('File uploaded successfully!');
      return data.note;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      setProgress(0);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress };
};
