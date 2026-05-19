import { motion } from 'framer-motion';

const UploadProgress = ({ progress }) => {
  const getStatusText = () => {
    if (progress < 30) return 'Uploading to cloud...';
    if (progress < 80) return 'Extracting text...';
    if (progress < 100) return 'Almost done...';
    return 'Done!';
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-400">{getStatusText()}</span>
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
  );
};

export default UploadProgress;
