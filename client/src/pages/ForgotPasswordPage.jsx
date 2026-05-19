import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../services/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center p-4 relative">
      {/* Home Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-10"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center font-bold text-sm">
          S
        </div>
        <span className="text-sm font-medium hidden sm:inline">StudyBuddy AI</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#4ECDC4] flex items-center justify-center font-bold text-2xl mx-auto mb-4">
            S
          </div>
          <h1 className="text-2xl font-bold mb-2">Forgot Password</h1>
          <p className="text-gray-400">Enter your email to reset your password</p>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-6">
              <p className="text-green-400 font-medium">Reset link sent!</p>
              <p className="text-gray-400 text-sm mt-2">Check your email for the reset link.</p>
            </div>
            <Link to="/login" className="text-[#6C63FF] hover:text-[#5A52D5] font-medium">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 outline-none transition-all placeholder-gray-500"
                placeholder="your@email.com"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#6C63FF] hover:bg-[#5A52D5] rounded-xl px-6 py-3 font-semibold transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-center text-gray-400">
              <Link to="/login" className="text-[#6C63FF] hover:text-[#5A52D5] font-medium">
                Back to Login
              </Link>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
