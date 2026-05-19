export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export const calculateScore = (score, total) => {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
};

export const getScoreColor = (percentage) => {
  if (percentage >= 80) return 'text-green-400';
  if (percentage >= 60) return 'text-yellow-400';
  return 'text-red-400';
};

export const getCategoryColor = (category) => {
  const colors = {
    Science: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Math: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    History: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    Language: 'bg-green-500/20 text-green-400 border-green-500/30',
    Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return colors[category] || colors.Other;
};

export const getFileTypeIcon = (fileType) => {
  const icons = {
    pdf: 'PDF',
    doc: 'DOC',
    txt: 'TXT',
    image: 'IMG',
  };
  return icons[fileType] || 'FILE';
};
