import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import SignupForm from '../components/auth/SignupForm';

const SignupPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (name, email, password) => {
    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-400">Start your learning journey</p>
        </div>

        <SignupForm onSubmit={handleRegister} isLoading={isLoading} />

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#6C63FF] hover:text-[#5A52D5] font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
