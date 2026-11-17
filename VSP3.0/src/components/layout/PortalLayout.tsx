import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getRoleLabel, getRoleBadgeColor } from '../../utils/helpers';
import { Badge } from '../ui';
import {
  Zap, Bell, LogOut, User, Menu, X, ChevronDown,
  LayoutDashboard, Map, Lightbulb, Activity, FileText,
  CheckSquare, BarChart2, Users, Shield, Settings,
  AlertCircle
} from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationCount] = useState(3);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // Build role-specific navigation items
  const getNavItems = () => {
    const common = [
      { label: 'GIS Map', path: '/map', icon: <Map className="w-4 h-4" /> },
    ];

    if (!user) return common;

    switch (user.role) {
      case 'admin':
        return [
          { label: 'System Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'GIS Infrastructure', path: '/map', icon: <Map className="w-4 h-4" /> },
          { label: 'Streetlights', path: '/streetlights', icon: <Lightbulb className="w-4 h-4" /> },
          { label: 'Transformers', path: '/transformers', icon: <Zap className="w-4 h-4" /> },
          { label: 'Feeders', path: '/feeders', icon: <Activity className="w-4 h-4" /> },
          { label: 'Work Orders', path: '/work-orders', icon: <FileText className="w-4 h-4" /> },
          { label: 'User Management', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
          { label: 'Audit Logs', path: '/admin/audit', icon: <Shield className="w-4 h-4" /> },
          { label: 'Reports & Analytics', path: '/reports', icon: <BarChart2 className="w-4 h-4" /> },
        ];
      case 'officer':
        return [
          { label: 'Officer Dashboard', path: '/officer', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'GIS Infrastructure', path: '/map', icon: <Map className="w-4 h-4" /> },
          { label: 'Streetlights', path: '/streetlights', icon: <Lightbulb className="w-4 h-4" /> },
          { label: 'Transformers', path: '/transformers', icon: <Zap className="w-4 h-4" /> },
          { label: 'Feeders', path: '/feeders', icon: <Activity className="w-4 h-4" /> },
          { label: 'Work Orders', path: '/work-orders', icon: <FileText className="w-4 h-4" /> },
          { label: 'Fault Reports', path: '/officer/faults', icon: <AlertCircle className="w-4 h-4" /> },
          { label: 'Reports & Analytics', path: '/reports', icon: <BarChart2 className="w-4 h-4" /> },
        ];
      case 'worker':
        return [
          { label: 'My Assigned Work', path: '/worker', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Task Map', path: '/map', icon: <Map className="w-4 h-4" /> },
          { label: 'Work Orders', path: '/work-orders', icon: <FileText className="w-4 h-4" /> },
        ];
      case 'supervisor':
        return [
          { label: 'Supervisor Dashboard', path: '/supervisor', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'GIS Infrastructure', path: '/map', icon: <Map className="w-4 h-4" /> },
          { label: 'Verification Queue', path: '/supervisor/verification', icon: <CheckSquare className="w-4 h-4" /> },
          { label: 'Work Orders', path: '/work-orders', icon: <FileText className="w-4 h-4" /> },
          { label: 'Team Performance', path: '/reports', icon: <BarChart2 className="w-4 h-4" /> },
        ];
      default:
        return common;
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col">
      {/* Top Header */}
      <header className="h-14 bg-[#0d1526] border-b border-[#1e2d55] flex items-center justify-between px-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Vidyut Spandan Logo" 
              className="w-8 h-8 rounded object-contain bg-amber-500/10 border border-amber-500/30 p-0.5" 
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <span className="font-semibold text-sm text-white tracking-wide">VIDYUT SPANDAN</span>
              <span className="text-[10px] text-amber-400 font-mono ml-2 hidden sm:inline">ವಿದ್ಯುತ್ ಸ್ಪಂದನ</span>
            </div>
          </Link>

          <span className="text-xs text-slate-500 hidden lg:inline">| BESCOM Distribution Operations</span>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="text-slate-400 hover:text-white p-1 rounded-full relative">
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full" />
              )}
            </button>
          </div>

          {user && (
            <div className="flex items-center gap-2 pl-3 border-l border-[#1e2d55]">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-white">{user.full_name}</p>
                <p className="text-[10px] text-slate-400">{getRoleLabel(user.role)}</p>
              </div>
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role.toUpperCase()}
              </Badge>
              <button
                onClick={handleSignOut}
                title="Sign Out"
                className="text-slate-400 hover:text-red-400 p-1 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:static inset-y-0 left-0 z-30 w-56 bg-[#0d1526] border-r border-[#1e2d55]
            flex flex-col transform transition-transform duration-200 ease-in-out pt-14 md:pt-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          {/* Role Indicator in Sidebar */}
          {user && (
            <div className="p-3 border-b border-[#1e2d55] bg-[#111d35]/50">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Portal</p>
              <p className="text-xs font-semibold text-cyan-400 mt-0.5">{getRoleLabel(user.role)}</p>
              {user.employee_id && (
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">{user.employee_id}</p>
              )}
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors
                    ${isActive
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#111d35]'
                    }
                  `}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-[#1e2d55] text-[10px] text-slate-500">
            <p className="font-semibold text-slate-400">BESCOM Operations</p>
            <p>Bengaluru, Karnataka</p>
            <p className="text-amber-500/70 mt-1">Prototype Demo v1.0</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
