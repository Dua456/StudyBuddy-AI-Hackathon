import { Link } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';

const QuickActions = ({ actions }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <Link
          key={index}
          to={action.path}
          className="glass p-5 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-200 group"
        >
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
            <action.icon size={24} className="text-white" />
          </div>
          <span className="font-semibold flex-1">{action.label}</span>
          <IoArrowForward
            size={20}
            className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all"
          />
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
