import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Modal from '../components/common/Modal';
import {
  IoCameraOutline,
  IoSaveOutline,
  IoLockClosedOutline,
  IoTrashOutline,
  IoCloudUploadOutline,
  IoSparklesOutline,
  IoHelpCircleOutline,
  IoTrophyOutline,
  IoCheckmarkCircleOutline,
  IoLockOpenOutline,
} from 'react-icons/io5';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [stats, setStats] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/user/stats');
        setStats(data.stats);
      } catch (error) {
        console.error('Stats load error:', error);
      }
    };
    fetchStats();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch('/user/profile', { name, bio });
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const { data } = await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser({ ...user, avatar: data.avatar });
      toast.success('Avatar updated!');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwords.newPass.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      toast.success('Password changed!');
      setShowPasswordModal(false);
      setPasswords({ current: '', newPass: '', confirm: '' });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password';
      toast.error(msg);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/user/account');
      toast.success('Account deleted');
      logout();
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const statItems = [
    { label: 'Total Uploads', value: stats?.totalUploads || 0, icon: IoCloudUploadOutline, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'Summaries', value: stats?.totalSummaries || 0, icon: IoSparklesOutline, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'Quizzes', value: stats?.totalQuizzes || 0, icon: IoHelpCircleOutline, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Avg Score', value: `${stats?.avgQuizScore || 0}%`, icon: IoTrophyOutline, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ];

  const allBadges = [
    { name: 'First Upload', icon: '📤', desc: 'Upload your first note' },
    { name: 'Quiz Master', icon: '🧠', desc: 'Achieve 80%+ avg score' },
    { name: 'Summary Expert', icon: '✨', desc: 'Generate 3+ summaries' },
    { name: 'Consistent Learner', icon: '🔥', desc: '7-day study streak' },
  ];

  const earnedBadges = stats?.badges?.map((b) => b.name) || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account and achievements</p>
      </div>

      {/* Top Section: Avatar + Edit Form */}
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* Avatar Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6"
        >
          <div className="flex flex-col items-center text-center">
            {/* Avatar - Round, clickable */}
            <div className="relative mb-5">
              <label className="cursor-pointer block">
                <div className="w-36 h-36 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#4ECDC4] p-[3px]">
                  <div className="w-full h-full rounded-full bg-[#16213E] flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <span className="text-5xl font-bold bg-gradient-to-br from-[#6C63FF] to-[#4ECDC4] bg-clip-text text-transparent">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                </div>
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 rounded-full bg-black/0 hover:bg-black/40 flex items-center justify-center transition-all group">
                  <IoCameraOutline size={32} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              {/* Camera badge */}
              <div className="absolute -bottom-1 -right-1 w-9 h-9 bg-[#6C63FF] rounded-full flex items-center justify-center shadow-lg shadow-[#6C63FF]/30 border-2 border-[#16213E] pointer-events-none">
                <IoCameraOutline size={16} className="text-white" />
              </div>
              {uploadingAvatar && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
            {user?.bio && (
              <p className="text-gray-300 text-sm mt-3 px-2 italic">"{user.bio}"</p>
            )}

            {/* Member since */}
            <div className="mt-4 pt-4 border-t border-white/10 w-full">
              <p className="text-xs text-gray-500">
                Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass p-6 space-y-5"
        >
          <h3 className="font-bold text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center">
              <IoSaveOutline size={16} className="text-[#6C63FF]" />
            </div>
            Edit Profile
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 opacity-50 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 outline-none transition-all resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-[#6C63FF] to-[#5A52D5] hover:from-[#5A52D5] hover:to-[#4A44C5] rounded-xl px-8 py-3 font-semibold transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#6C63FF]/20"
            >
              <IoSaveOutline size={18} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass p-5 border ${item.border}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                <item.icon size={20} className={item.color} />
              </div>
            </div>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm text-gray-400 mt-1">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass p-6"
      >
        <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <IoTrophyOutline size={16} className="text-amber-400" />
          </div>
          Achievements
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {allBadges.map((badge, i) => {
            const earned = earnedBadges.includes(badge.name);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`p-5 rounded-2xl text-center transition-all ${
                  earned
                    ? 'bg-gradient-to-br from-[#6C63FF]/10 to-[#4ECDC4]/10 border border-[#6C63FF]/30 shadow-lg shadow-[#6C63FF]/10'
                    : 'bg-white/5 border border-white/5 opacity-50'
                }`}
              >
                <div className="text-4xl mb-3">{badge.icon}</div>
                <div className="text-sm font-bold">{badge.name}</div>
                <div className="text-xs text-gray-400 mt-1">{badge.desc}</div>
                {earned ? (
                  <div className="flex items-center justify-center gap-1 text-xs text-green-400 mt-3">
                    <IoCheckmarkCircleOutline size={14} />
                    Unlocked!
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mt-3">
                    <IoLockOpenOutline size={14} />
                    Locked
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass p-6"
      >
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-500/20 flex items-center justify-center">
            <IoLockClosedOutline size={16} className="text-gray-400" />
          </div>
          Account Settings
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left border border-white/5"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <IoLockClosedOutline size={20} className="text-blue-400" />
            </div>
            <div>
              <div className="font-medium">Change Password</div>
              <div className="text-sm text-gray-400">Update your password</div>
            </div>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 transition-colors text-left border border-red-500/10"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <IoTrashOutline size={20} className="text-red-400" />
            </div>
            <div>
              <div className="font-medium text-red-400">Delete Account</div>
              <div className="text-sm text-gray-400">Permanently delete your account</div>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <input
            type="password"
            value={passwords.current}
            onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] outline-none transition-all"
            placeholder="Current password"
          />
          <input
            type="password"
            value={passwords.newPass}
            onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] outline-none transition-all"
            placeholder="New password"
          />
          <input
            type="password"
            value={passwords.confirm}
            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-[#6C63FF] outline-none transition-all"
            placeholder="Confirm new password"
          />
          <button
            onClick={handleChangePassword}
            className="w-full bg-gradient-to-r from-[#6C63FF] to-[#5A52D5] hover:from-[#5A52D5] hover:to-[#4A44C5] rounded-xl px-6 py-3 font-semibold transition-all"
          >
            Update Password
          </button>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            Are you sure you want to delete your account? This action cannot be undone and all your
            data will be permanently removed.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 border border-white/10 text-gray-300 hover:bg-white/5 rounded-xl px-4 py-3 font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              className="flex-1 bg-red-500 hover:bg-red-600 rounded-xl px-4 py-3 font-medium transition-all"
            >
              Delete Account
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
