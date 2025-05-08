
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Database, 
  TableProperties, 
  FileText, 
  Settings,
  DatabaseBackup
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <Database className="h-5 w-5" /> },
  { name: 'Connections', path: '/connections', icon: <DatabaseBackup className="h-5 w-5" /> },
  { name: 'Database Explorer', path: '/explorer', icon: <TableProperties className="h-5 w-5" /> },
  { name: 'Query Editor', path: '/query', icon: <FileText className="h-5 w-5" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> }
];

export function Sidebar() {
  const location = useLocation();
  
  return (
    <div className="h-full flex flex-col bg-dbforge-dark text-white">
      <div className="p-4 border-b border-slate-700">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <Database className="h-6 w-6 text-dbforge-teal" />
          <span>Data<span className="text-dbforge-teal">Forge</span></span>
        </h1>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-700 transition-colors',
              location.pathname === item.path ? 'bg-slate-700 text-dbforge-teal' : 'text-slate-300'
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 text-xs text-slate-400">
        <p>DataForge v1.0.0</p>
      </div>
    </div>
  );
}

export default Sidebar;
