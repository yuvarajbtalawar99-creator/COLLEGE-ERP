import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    GraduationCap,
    User,
    HelpCircle
} from 'lucide-react';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const displayName = user?.name || user?.email || "Student User";
    const displayId = user?.id !== undefined && user?.id !== null
        ? String(user.id).slice(0, 8)
        : "ADM-2024";

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const getNavItems = () => {
        if (user?.role === 'STUDENT') {
            return [
                { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
                { name: 'Admission Form', path: '/student/application', icon: FileText },
            ];
        } else {
            return [
                { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
                { name: 'Student Directory', path: '/admin/students', icon: Users },
            ];
        }
    };

    const navItems = getNavItems();

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-[260px] bg-white border-r border-slate-200
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col
            `}>
                <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-100">
                    <div className="size-8 flex items-center justify-center bg-primary-600 rounded-lg text-white shadow-lg shadow-primary-600/20">
                        <GraduationCap size={20} />
                    </div>
                    <span className="font-bold text-lg text-slate-900 tracking-tight">EduPortal ERP</span>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                ${isActive
                                    ? 'bg-primary-50 text-primary-700 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                            `}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon size={18} className="text-current" />
                            {item.name}
                        </NavLink>
                    ))}

                    <div className="pt-6 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        System
                    </div>
                    <NavLink
                        to="/settings"
                        className={({ isActive }) => `
                            flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                            ${isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                    >
                        <Settings size={18} className="text-current" />
                        Settings
                    </NavLink>
                    <NavLink
                        to="/support"
                        className={({ isActive }) => `
                            flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                            ${isActive ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                        `}
                    >
                        <HelpCircle size={18} className="text-current" />
                        Support
                    </NavLink>
                </nav>

                <div className="p-3 mt-auto mb-3 mx-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center">
                        <User size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">ID: {displayId}</p>
                    </div>
                </div>

                <div className="px-3 pb-4">
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#f3f4f6]">
                {/* Top Header — Clean, minimal per Stitch design */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden text-slate-500 hover:text-slate-900 p-1.5 hover:bg-slate-50 rounded-lg"
                            onClick={toggleSidebar}
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="hidden sm:block text-sm font-semibold text-slate-700">
                            Admission Services Portal
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2">
                            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                <FileText size={18} />
                            </button>
                            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                <HelpCircle size={18} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900">{displayName}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">ID: {displayId}</p>
                            </div>
                            <div className="bg-primary-600/10 rounded-full p-1 border-2 border-primary-600">
                                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold">
                                    {displayName?.[0]?.toUpperCase() || 'S'}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8 relative z-10">
                    <div className="max-w-[1200px] mx-auto w-full animate-fade-in pb-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
