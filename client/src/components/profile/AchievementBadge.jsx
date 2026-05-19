const AchievementBadge = ({ badge, earned }) => {
  return (
    <div
      className={`p-4 rounded-xl text-center transition-all ${
        earned ? 'bg-[#6C63FF]/10 border border-[#6C63FF]/30' : 'bg-white/5 opacity-40'
      }`}
    >
      <div className="text-3xl mb-2">{badge.icon}</div>
      <div className="text-sm font-bold">{badge.name}</div>
      <div className="text-xs text-gray-400 mt-1">{badge.desc}</div>
      {earned && <div className="text-xs text-green-400 mt-2">Unlocked!</div>}
    </div>
  );
};

export default AchievementBadge;
