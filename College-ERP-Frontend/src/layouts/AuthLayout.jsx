import React from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight } from 'lucide-react';

const AuthLayout = () => {
    const { token, user } = useAuth();
    
    // IMAGE CONFIGURATION:
    // To use your college photo, place 'college-view.jpg' in the 'public/' folder.
    const collegeImgPath = "/college-view.jpg";
    const fallbackImg = "https://images.unsplash.com/photo-1498243639159-414ccead8c51?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

    if (token && user) {
        if (user.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
        if (user.role === 'ADMISSION_OFFICER') return <Navigate to="/admin/dashboard" replace />;
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-slate-50 font-display flex flex-col">
            {/* Top Navigation Bar */}
            <header className="w-full flex items-center justify-between border-b border-slate-200 bg-white px-6 lg:px-10 py-4 z-50">
                <div className="flex items-center gap-3">
                    <div className="text-primary-600">
                        <GraduationCap size={32} />
                    </div>
                    <h2 className="text-slate-900 text-xl font-bold tracking-tight">JCER ERP Portal</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button className="hidden sm:flex text-slate-600 text-sm font-medium hover:text-primary-600 transition-colors">Admission Guide</button>
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary-600/20 transition-all">
                        Support
                    </button>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-3xl overflow-hidden border border-slate-200 min-h-[650px] animate-fade-in text-slate-900">
                    
                    {/* Left Side: Visual/Branding Section (HIDDEN ON MOBILE) */}
                    <div className="hidden lg:block relative overflow-hidden bg-slate-900 border-r border-slate-200">
                        {/* Background Layer with Dual Fallback Logic */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center animate-background-zoom transition-all duration-700" 
                            style={{ 
                                backgroundImage: `url(${collegeImgPath}), url(${fallbackImg})`,
                            }}
                        ></div>

                        {/* Dark Gradient Overlay for Readability */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/70 pointer-events-none"></div>
                        
                        {/* Content Overlay */}
                        <div className="relative h-full flex flex-col justify-end p-12 text-white">
                            <div className="mb-10 space-y-4">
                                <span className="bg-white/20 backdrop-blur-lg px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.2em] mb-6 inline-block border border-white/20">
                                    Welcome Back
                                </span>
                                <h1 className="text-5xl font-extrabold leading-[1.1] mb-5 text-shadow-premium">
                                    Empowering Your <br />
                                    <span className="text-primary-300">Academic Journey.</span>
                                </h1>
                                <p className="text-white/80 text-lg leading-relaxed max-w-md font-medium">
                                    Access your academic records, course registrations, and institutional resources in one secure portal.
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="size-11 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden ring-4 ring-white/5">
                                            <img 
                                                src={`https://i.pravatar.cc/100?u=${i}`} 
                                                alt={`Student ${i}`} 
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-extrabold">Join 50,000+ students today</p>
                                    <p className="text-[11px] text-white/50 font-medium">Trusted by leading academic institutions</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form Content (Outlet) */}
                    <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-white relative z-10">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 px-10 border-t border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-500 font-medium">© 2024 BGS CET ERP Systems. All academic rights reserved.</p>
                <div className="flex items-center gap-8">
                    <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">Terms</a>
                    <a href="#" className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-primary-600 transition-colors">Support</a>
                </div>
            </footer>
        </div>
    );
};

export default AuthLayout;
