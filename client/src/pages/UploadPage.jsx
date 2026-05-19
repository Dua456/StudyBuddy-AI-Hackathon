import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatFileSize } from '../utils/helpers';
import {
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
} from 'react-icons/io5';

const UploadPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0];
      if (f.size > 10 * 1024 * 1024) {
        toast.error('File size cannot exceed 10MB');
        return;
      }
      setFile(f);
      setTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);

    try {
      // Simulate progress
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

      setUploaded(data.note);
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('Other');
    setProgress(0);
    setUploaded(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Upload Notes</h1>
        <p className="text-gray-400 mt-1">Upload your study materials for AI processing</p>
      </div>

      <AnimatePresence mode="wait">
        {uploaded ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass p-8 text-center"
          >
            <IoCheckmarkCircleOutline size={64} className="text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Upload Successful!</h2>
            <p className="text-gray-400 mb-6">Your note has been uploaded and processed.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/summary')}
                className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-6 py-3 font-semibold transition-all"
              >
                Generate Summary
              </button>
              <button
                onClick={() => navigate('/quiz')}
                className="border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/10 rounded-xl px-6 py-3 font-semibold transition-all"
              >
                Create Quiz
              </button>
              <button
                onClick={resetUpload}
                className="border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl px-6 py-3 font-semibold transition-all"
              >
                Upload Another
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Drop Zone */}
            <div
              {...getRootProps()}
              className={`glass p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragActive
                  ? 'border-[#6C63FF] bg-[#6C63FF]/5'
                  : 'hover:border-[#6C63FF]/50'
              }`}
            >
              <input {...getInputProps()} />
              <IoCloudUploadOutline size={48} className="text-gray-400 mx-auto mb-4" />
              {file ? (
                <div>
                  <p className="font-semibold text-lg mb-1">{file.name}</p>
                  <p className="text-gray-400 text-sm">{formatFileSize(file.size)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-3 text-red-400 hover:text-red-300 text-sm flex items-center gap-1 mx-auto"
                  >
                    <IoCloseOutline size={16} /> Remove
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-semibold mb-1">
                    Drop your files here or click to browse
                  </p>
                  <p className="text-gray-400 text-sm">PDF, DOC, DOCX, TXT, PNG, JPG (max 10MB)</p>
                </div>
              )}
            </div>

            {/* File Details Form */}
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 outline-none transition-all"
                    placeholder="Note title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 outline-none transition-all resize-none"
                    placeholder="Add a description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 outline-none transition-all"
                  >
                    <option value="Science">Science</option>
                    <option value="Math">Math</option>
                    <option value="History">History</option>
                    <option value="Language">Language</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Upload Progress */}
                {uploading && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">
                        {progress < 50
                          ? 'Uploading to cloud...'
                          : progress < 90
                          ? 'Extracting text...'
                          : 'Almost done...'}
                      </span>
                      <span className="text-[#6C63FF]">{progress}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4] h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadPage;
