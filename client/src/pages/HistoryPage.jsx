import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';
import { formatDate, getCategoryColor, formatFileSize } from '../utils/helpers';
import {
  IoDocumentTextOutline,
  IoSparklesOutline,
  IoHelpCircleOutline,
  IoTrashOutline,
  IoEyeOutline,
  IoCopyOutline,
  IoSearchOutline,
  IoChevronDownOutline,
} from 'react-icons/io5';

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [notes, setNotes] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [expandedSummary, setExpandedSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, summariesRes, quizzesRes] = await Promise.all([
          api.get('/notes?limit=50'),
          api.get('/ai/summaries?limit=50'),
          api.get('/quiz?limit=50'),
        ]);
        setNotes(notesRes.data.notes);
        setSummaries(summariesRes.data.summaries);
        setQuizzes(quizzesRes.data.quizzes);
      } catch (error) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const deleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      toast.success('Note deleted');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const copySummary = (summary) => {
    const text = `${summary.shortSummary}\n\n${summary.detailedSummary}\n\nKey Points:\n${summary.keyPoints?.map((p) => `- ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const filteredNotes = notes
    .filter((n) => {
      const matchSearch = n.title.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'All' || n.category === categoryFilter;
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      return new Date(a.uploadedAt) - new Date(b.uploadedAt);
    });

  const tabs = [
    { key: 'notes', label: 'My Notes', icon: IoDocumentTextOutline, count: notes.length },
    { key: 'summaries', label: 'Summaries', icon: IoSparklesOutline, count: summaries.length },
    { key: 'quizzes', label: 'Quiz Attempts', icon: IoHelpCircleOutline, count: quizzes.length },
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">History</h1>
        <p className="text-gray-400 mt-1">View your notes, summaries, and quiz history</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-[#6C63FF] text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* My Notes Tab */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
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
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:border-[#6C63FF] outline-none text-sm"
            >
              <option value="All">All Categories</option>
              <option value="Science">Science</option>
              <option value="Math">Math</option>
              <option value="History">History</option>
              <option value="Language">Language</option>
              <option value="Other">Other</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus:border-[#6C63FF] outline-none text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Notes Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-40 bg-white/5 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="glass p-12 text-center">
              <IoDocumentTextOutline size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No notes found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass p-5 hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF] font-bold text-xs">
                      {note.fileType?.toUpperCase() || 'FILE'}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(note.category)}`}
                    >
                      {note.category}
                    </span>
                  </div>
                  <h3 className="font-bold mb-1 truncate">{note.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">
                    {formatDate(note.uploadedAt)} · {formatFileSize(note.fileSize || 0)}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`http://localhost:5000/api/notes/${note._id}/view?token=${localStorage.getItem('token') || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center text-xs py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <IoEyeOutline className="inline mr-1" /> View
                    </a>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="text-xs py-2 px-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summaries Tab */}
      {activeTab === 'summaries' && (
        <div className="space-y-4">
          {summaries.length === 0 ? (
            <div className="glass p-12 text-center">
              <IoSparklesOutline size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No summaries generated yet</p>
              <a href="/summary" className="text-[#6C63FF] text-sm mt-2 inline-block">
                Generate your first summary
              </a>
            </div>
          ) : (
            summaries.map((s) => (
              <div key={s._id} className="glass p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold">{s.note?.title || 'Untitled'}</h3>
                  <span className="text-xs text-gray-400">{formatDate(s.generatedAt)}</span>
                </div>
                <p className="text-sm text-gray-300">{s.shortSummary}</p>
                <button
                  onClick={() => setExpandedSummary(expandedSummary === s._id ? null : s._id)}
                  className="text-[#6C63FF] text-sm mt-2 flex items-center gap-1"
                >
                  {expandedSummary === s._id ? 'Show less' : 'Show more'}{' '}
                  <IoChevronDownOutline
                    className={`transition-transform ${expandedSummary === s._id ? 'rotate-180' : ''}`}
                  />
                </button>
                {expandedSummary === s._id && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-sm text-gray-300 mb-3">{s.detailedSummary}</p>
                    <button
                      onClick={() => copySummary(s)}
                      className="text-xs text-[#6C63FF] flex items-center gap-1"
                    >
                      <IoCopyOutline /> Copy
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Quiz Attempts Tab */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <div className="glass p-12 text-center">
              <IoHelpCircleOutline size={48} className="text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No quizzes taken yet</p>
              <a href="/quiz" className="text-[#6C63FF] text-sm mt-2 inline-block">
                Take your first quiz
              </a>
            </div>
          ) : (
            <div className="glass overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Quiz</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Questions</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-400">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((q) => (
                      <tr key={q._id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4 font-medium text-sm">{q.title}</td>
                        <td className="p-4 text-sm text-gray-400">{q.questions?.length || 0}</td>
                        <td className="p-4 text-sm text-gray-400">{formatDate(q.createdAt)}</td>
                        <td className="p-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              q.difficulty === 'easy'
                                ? 'bg-green-500/20 text-green-400'
                                : q.difficulty === 'medium'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
