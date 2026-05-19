import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';

const SummaryCard = ({ summary }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      {/* Short Summary */}
      <div className="glass p-5 border-l-4 border-[#6C63FF]">
        <h3 className="text-sm font-semibold text-[#6C63FF] mb-2">Short Summary</h3>
        <p className="text-gray-200">{summary.shortSummary}</p>
      </div>

      {/* Detailed Summary */}
      <div className="glass p-5">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="text-sm font-semibold text-[#4ECDC4]">Detailed Summary</h3>
          {expanded ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <p className="text-gray-200 mt-3">{summary.detailedSummary}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Key Points */}
      {summary.keyPoints && summary.keyPoints.length > 0 && (
        <div className="glass p-5">
          <h3 className="text-sm font-semibold text-green-400 mb-3">Key Points</h3>
          <ul className="space-y-2">
            {summary.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-200 text-sm">
                <span className="text-green-400 mt-0.5">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keywords */}
      {summary.keywords && summary.keywords.length > 0 && (
        <div className="glass p-5">
          <h3 className="text-sm font-semibold text-amber-400 mb-3">Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {summary.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
