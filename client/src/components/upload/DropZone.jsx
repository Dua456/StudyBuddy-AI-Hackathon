import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline, IoCloseOutline } from 'react-icons/io5';
import { formatFileSize } from '../../utils/helpers';

const DropZone = ({ file, onFileSelect, onFileRemove }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

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
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`glass p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragActive ? 'border-[#6C63FF] bg-[#6C63FF]/5' : 'hover:border-[#6C63FF]/50'
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
              onFileRemove();
            }}
            className="mt-3 text-red-400 hover:text-red-300 text-sm flex items-center gap-1 mx-auto"
          >
            <IoCloseOutline size={16} /> Remove
          </button>
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold mb-1">Drop your files here or click to browse</p>
          <p className="text-gray-400 text-sm">PDF, DOC, DOCX, TXT, PNG, JPG (max 10MB)</p>
        </div>
      )}
    </div>
  );
};

export default DropZone;
