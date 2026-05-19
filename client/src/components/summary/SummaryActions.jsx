import { IoCopyOutline, IoDownloadOutline, IoSparklesOutline } from 'react-icons/io5';

const SummaryActions = ({ onCopy, onDownload, onCreateQuiz }) => {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onCopy}
        className="flex items-center gap-2 border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl px-5 py-2.5 font-medium transition-all text-sm"
      >
        <IoCopyOutline size={18} /> Copy Summary
      </button>
      <button
        onClick={onDownload}
        className="flex items-center gap-2 border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl px-5 py-2.5 font-medium transition-all text-sm"
      >
        <IoDownloadOutline size={18} /> Download PDF
      </button>
      <button
        onClick={onCreateQuiz}
        className="flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-5 py-2.5 font-medium transition-all text-sm"
      >
        <IoSparklesOutline size={18} /> Create Quiz from This
      </button>
    </div>
  );
};

export default SummaryActions;
