import { formatDate } from '../../utils/helpers';

const RecentActivity = ({ notes }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note._id}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-[#6C63FF]/20 flex items-center justify-center text-[#6C63FF] font-bold text-sm">
            {note.fileType?.toUpperCase() || 'FILE'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{note.title}</div>
            <div className="text-sm text-gray-400">{formatDate(note.uploadedAt)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
