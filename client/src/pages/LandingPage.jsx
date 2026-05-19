import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { IoCloudUploadOutline, IoSparklesOutline, IoHelpCircleOutline, IoStatsChartOutline } from 'react-icons/io5';

const features = [
  { icon: IoCloudUploadOutline, title: 'Upload Notes', desc: 'Upload PDFs, docs, and images to your personal library', color: 'from-blue-500 to-blue-600' },
  { icon: IoSparklesOutline, title: 'AI Summaries', desc: 'Get instant AI-powered summaries and key points', color: 'from-purple-500 to-purple-600' },
  { icon: IoHelpCircleOutline, title: 'Auto Quizzes', desc: 'Generate quizzes automatically from your study material', color: 'from-green-500 to-green-600' },
  { icon: IoStatsChartOutline, title: 'Track Progress', desc: 'Monitor your study progress with detailed analytics', color: 'from-amber-500 to-amber-600' },
];

const stats = [
  { value: '500+', label: 'Students' },
  { value: '10,000+', label: 'Notes Uploaded' },
  { value: '50,000+', label: 'Quizzes Generated' },
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen animated-bg">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center font-bold text-lg">
            S
          </div>
          <span className="text-xl font-bold">StudyBuddy AI</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-5 py-2.5 font-semibold transition-all duration-200 hover:scale-[1.02]"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors font-medium">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-5 py-2.5 font-semibold transition-all duration-200 hover:scale-[1.02]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 text-[#6C63FF] text-sm font-medium mb-6">
            AI-Powered Learning Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Study Smarter
            <br />
            <span className="gradient-text">with AI</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Upload your notes, get AI-powered summaries, auto-generate quizzes, and track your
            learning progress — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-200 hover:scale-[1.02]"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/10 rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-200"
            >
              Login
            </Link>
          </div>
        </motion.div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-[#6C63FF]/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 hover:scale-[1.02] transition-transform duration-200"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
              >
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="glass p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>&copy; 2026 StudyBuddy AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
