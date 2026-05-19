import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { aiService } from '../services/aiService';
import { formatDate, getCategoryColor } from '../utils/helpers';
import {
  IoSearchOutline,
  IoSparklesOutline,
  IoCopyOutline,
  IoDownloadOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoDocumentTextOutline,
} from 'react-icons/io5';

const SummaryPage = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get('/notes?limit=50');
        setNotes(data.notes);
      } catch (error) {
        toast.error('Failed to load notes');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleGenerate = async () => {
    if (!selectedNote) {
      toast.error('Please select a note');
      return;
    }

    setGenerating(true);
    setSummary(null);
    try {
      const { data } = await aiService.summarize(selectedNote._id);
      setSummary(data.summary);
      toast.success('Summary generated!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate summary');
    } finally {
      setGenerating(false);
    }
  };

  const copySummary = () => {
    if (!summary) return;
    const text = `Summary: ${summary.shortSummary}\n\nDetailed: ${summary.detailedSummary}\n\nKey Points:\n${summary.keyPoints.map((p) => `- ${p}`).join('\n')}\n\nKeywords: ${summary.keywords.join(', ')}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">AI Summary</h1>
        <p className="text-gray-400 mt-1">Generate AI-powered summaries from your notes</p>
      </div>

      <div className="grid lg:grid-cols-[350px_1fr] gap-6">
        {/* Left Panel - Note Selector */}
        <div className="glass p-5">
          <div className="relative mb-4">
            <IoSearchOutline
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 focus:border-[#6C63FF] outline-none transition-all text-sm"
              placeholder="Search notes..."
            />
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <IoDocumentTextOutline size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notes found</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <button
                  key={note._id}
                  onClick={() => {
                    setSelectedNote(note);
                    setSummary(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedNote?._id === note._id
                      ? 'bg-[#6C63FF]/20 border border-[#6C63FF]/30'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="font-medium text-sm truncate">{note.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(note.category)}`}>
                      {note.category}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(note.uploadedAt)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Summary View */}
        <div className="space-y-4">
          {selectedNote ? (
            <>
              <div className="glass p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold">{selectedNote.title}</h2>
                    <p className="text-sm text-gray-400">
                      {selectedNote.category} · {formatDate(selectedNote.uploadedAt)}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-white/10 text-gray-300">
                    {selectedNote.fileType?.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="w-full bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <IoSparklesOutline size={20} />
                  {generating ? 'Generating Summary...' : 'Generate Summary'}
                </button>
              </div>

              {/* Loading state */}
              {generating && (
                <div className="glass p-8 text-center">
                  <div className="w-12 h-12 border-4 border-[#6C63FF]/30 border-t-[#6C63FF] rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-400">AI is analyzing your notes...</p>
                </div>
              )}

              {/* Summary Display */}
              {summary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
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
                  <div className="glass p-5">
                    <h3 className="text-sm font-semibold text-green-400 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {summary.keyPoints?.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-200 text-sm">
                          <span className="text-green-400 mt-0.5">✓</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Keywords */}
                  <div className="glass p-5">
                    <h3 className="text-sm font-semibold text-amber-400 mb-3">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {summary.keywords?.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={copySummary}
                      className="flex items-center gap-2 border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl px-5 py-2.5 font-medium transition-all text-sm"
                    >
                      <IoCopyOutline size={18} /> Copy Summary
                    </button>
                    <button
                      onClick={() => navigate('/quiz')}
                      className="flex items-center gap-2 bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-5 py-2.5 font-medium transition-all text-sm"
                    >
                      <IoSparklesOutline size={18} /> Create Quiz from This
                    </button>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="glass p-12 text-center">
              <IoSparklesOutline size={48} className="text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Select a note to generate a summary</p>
              <p className="text-gray-500 text-sm mt-1">
                Choose from your uploaded notes on the left
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;
