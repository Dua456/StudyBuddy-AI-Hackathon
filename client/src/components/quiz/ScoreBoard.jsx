import { motion } from 'framer-motion';

const ScoreBoard = ({ score, total, timeTaken }) => {
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= 60;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass p-8 text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-32 h-32 transform -rotate-90">
          <circle cx="64" cy="64" r="56" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="64"
            cy="64"
            r="56"
            stroke={passed ? '#4ECDC4' : '#FF6B6B'}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '352', strokeDashoffset: 352 }}
            animate={{ strokeDashoffset: 352 - (352 * score) / total }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold">
            {score}/{total}
          </span>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-1">{percentage}%</h2>
      <p className={`text-lg font-medium ${passed ? 'text-green-400' : 'text-red-400'}`}>
        {passed ? 'Passed!' : 'Failed'}
      </p>
      <p className="text-gray-400 text-sm mt-1">Time: {formatTime(timeTaken)}</p>
    </div>
  );
};

export default ScoreBoard;
