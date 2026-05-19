import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatDate, getCategoryColor } from '../utils/helpers';
import {
  IoCloudUploadOutline,
  IoSparklesOutline,
  IoHelpCircleOutline,
  IoTrophyOutline,
  IoDocumentTextOutline,
  IoArrowForward,
  IoTimeOutline,
} from 'react-icons/io5';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const DashboardPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [notesRes, statsRes] = await Promise.all([
          api.get('/notes?limit=5'),
          api.get('/user/stats'),
        ]);
        setNotes(notesRes.data.notes);
        setStats(statsRes.data.stats);
      } catch (error) {
        console.error('Dashboard load error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Mock chart data (last 7 days)
  const chartData = [
    { day: 'Mon', uploads: 2, quizzes: 1 },
    { day: 'Tue', uploads: 1, quizzes: 3 },
    { day: 'Wed', uploads: 3, quizzes: 2 },
    { day: 'Thu', uploads: 0, quizzes: 1 },
    { day: 'Fri', uploads: 2, quizzes: 4 },
    { day: 'Sat', uploads: 1, quizzes: 2 },
    { day: 'Sun', uploads: 0, quizzes: 0 },
  ];

  const statCards = [
    {
      label: 'Total Uploads',
      value: stats?.totalUploads || 0,
      icon: IoCloudUploadOutline,
      color: 'from-blue-500 to-blue-600',
      border: 'border-blue-500/20',
    },
    {
      label: 'Summaries Generated',
      value: stats?.totalSummaries || 0,
      icon: IoSparklesOutline,
      color: 'from-purple-500 to-purple-600',
      border: 'border-purple-500/20',
    },
    {
      label: 'Quizzes Taken',
      value: stats?.totalQuizzes || 0,
      icon: IoHelpCircleOutline,
      color: 'from-green-500 to-green-600',
      border: 'border-green-500/20',
    },
    {
      label: 'Avg Quiz Score',
      value: `${stats?.avgQuizScore || 0}%`,
      icon: IoTrophyOutline,
      color: 'from-amber-500 to-amber-600',
      border: 'border-amber-500/20',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/5 rounded w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold">
          {getGreeting()}, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-400 mt-1">{today}</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass p-5 border ${card.border}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon size={20} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
            <div className="text-sm text-gray-400">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Upload New Notes', path: '/upload', icon: IoCloudUploadOutline, color: 'from-blue-500 to-blue-600', desc: 'Add your study materials' },
          { label: 'Generate Summary', path: '/summary', icon: IoSparklesOutline, color: 'from-purple-500 to-purple-600', desc: 'AI-powered summaries' },
          { label: 'Take a Quiz', path: '/quiz', icon: IoHelpCircleOutline, color: 'from-green-500 to-green-600', desc: 'Test your knowledge' },
        ].map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Link
              to={action.path}
              className="glass p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-200 group border border-white/5"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                <action.icon size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold block">{action.label}</span>
                <span className="text-xs text-gray-400">{action.desc}</span>
              </div>
              <IoArrowForward
                size={20}
                className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0"
              />
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Uploads */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-5 border border-white/5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <IoTimeOutline size={20} className="text-[#6C63FF]" />
              Recent Uploads
            </h2>
            {notes.length > 0 && (
              <Link to="/history" className="text-xs text-[#6C63FF] hover:underline">
                View All
              </Link>
            )}
          </div>
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <IoDocumentTextOutline size={40} className="mx-auto mb-3 opacity-50" />
              <p>No notes uploaded yet</p>
              <Link to="/upload" className="text-[#6C63FF] text-sm mt-2 inline-block hover:underline">
                Upload your first note
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF] font-bold text-sm flex-shrink-0">
                    {note.fileType?.toUpperCase() || 'FILE'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{note.title}</div>
                    <div className="text-sm text-gray-400">{formatDate(note.uploadedAt)}</div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(note.category)} flex-shrink-0`}
                  >
                    {note.category}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="glass p-5 border border-white/5"
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <IoSparklesOutline size={20} className="text-[#4ECDC4]" />
            Weekly Activity
          </h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: '#1A1A2E',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="uploads" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="quizzes" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
