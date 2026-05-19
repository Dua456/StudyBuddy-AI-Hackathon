import { IoDocumentTextOutline, IoImageOutline, IoFileTrayOutline } from 'react-icons/io5';

const FilePreview = ({ file }) => {
  if (!file) return null;

  const isImage = file.type?.startsWith('image/');
  const isPDF = file.type === 'application/pdf';
  const isText = file.type === 'text/plain';

  return (
    <div className="glass p-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-xl bg-[#6C63FF]/20 flex items-center justify-center">
          {isImage ? (
            <IoImageOutline size={28} className="text-[#6C63FF]" />
          ) : isPDF ? (
            <IoDocumentTextOutline size={28} className="text-[#6C63FF]" />
          ) : (
            <IoFileTrayOutline size={28} className="text-[#6C63FF]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{file.name}</p>
          <p className="text-sm text-gray-400">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>

      {isImage && (
        <div className="mt-4 rounded-xl overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default FilePreview;
