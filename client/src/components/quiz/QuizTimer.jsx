import { IoTimeOutline } from 'react-icons/io5';

const QuizTimer = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLow = timeLeft < 60;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
        isLow ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-300'
      }`}
    >
      <IoTimeOutline size={18} />
      <span className="font-mono font-bold">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default QuizTimer;
