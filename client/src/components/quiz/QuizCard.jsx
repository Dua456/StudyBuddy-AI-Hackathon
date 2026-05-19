import { motion } from 'framer-motion';

const QuizCard = ({ question, questionIndex, selectedAnswer, onSelect }) => {
  return (
    <div className="glass p-6">
      <div className="mb-6">
        <span className="text-sm text-[#6C63FF] font-medium">
          Q{questionIndex + 1} · {question.type === 'mcq' ? 'Multiple Choice' : 'True/False'}
        </span>
        <h3 className="text-xl font-bold mt-2">{question.question}</h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(option)}
            className={`w-full text-left p-4 rounded-xl border transition-all ${
              selectedAnswer === option
                ? 'bg-[#6C63FF]/20 border-[#6C63FF] text-white'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
            }`}
          >
            {option}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuizCard;
