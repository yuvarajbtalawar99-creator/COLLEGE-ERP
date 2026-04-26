import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserCheck, Clock, CheckCircle, XCircle, TrendingUp, Calendar, ShieldCheck, Eye, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentStudents, setRecentStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, studentsRes] = await Promise.all([
                api.get('/admin/dashboard'),
                api.get('/admin/students')
            ]);
            if (statsRes.data.success) {
                setStats(statsRes.data.data);
            }
            if (studentsRes.data.success) {
                setRecentStudents(studentsRes.data.data.slice(0, 6));
            }
        } catch (error) {
            toast.error('Failed to load dashboard statistics');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-600"></div>
                    <p className="text-slate-500 font-medium text-sm">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    const statConfig = [
        { title: 'Total Applications', value: stats?.total || 0, icon: Users, colorClass: 'bg-blue-600' },
        { title: 'Pending Review', value: stats?.submitted || 0, icon: UserCheck, colorClass: 'bg-amber-600' },
        { title: 'Under Review', value: stats?.review || 0, icon: Clock, colorClass: 'bg-orange-600' },
        { title: 'Docs Verified', value: stats?.documentVerified || 0, icon: ShieldCheck, colorClass: 'bg-teal-600' },
        { title: 'Approved', value: stats?.confirmed || 0, icon: CheckCircle, colorClass: 'bg-emerald-600' },
        { title: 'Rejected', value: stats?.rejected || 0, icon: XCircle, colorClass: 'bg-rose-600' }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-primary-600 font-semibold text-xs">
                        <TrendingUp size={14} />
                        Analytics Overview
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500 text-sm">Central hub for admission throughput and system metrics.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                    <div className="w-9 h-9 bg-primary-50 rounded-lg text-primary-600 flex items-center justify-center">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Current Date</p>
                        <p className="text-sm font-semibold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statConfig.map((stat, i) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        colorClass={stat.colorClass}
                        delay={i * 80}
                    />
                ))}
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                            <Users size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900">Recent Applications</h3>
                            <p className="text-xs text-slate-400">Latest admission submissions requiring action</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/admin/students')}
                        className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
                    >
                        View All <ArrowRight size={14} />
                    </button>
                </div>

                {recentStudents.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-sm text-slate-400 font-medium">No applications found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Course</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Status</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                                        onClick={() => navigate(`/admin/students/${student.id}`)}
                                    >
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-xs group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                    {student.studentpersonaldetails?.fullName?.[0] || student.user?.email?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 text-sm">{student.studentpersonaldetails?.fullName || 'Untitled'}</div>
                                                    <div className="text-xs text-slate-400">{student.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="text-sm font-medium text-slate-700">{student.branch?.code || '—'}</div>
                                        </td>
                                        <td className="py-3.5 px-5 text-center">
                                            <StatusBadge status={student.status} />
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className="text-xs text-slate-500">{new Date(student.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="py-3.5 px-5 text-right">
                                            <div className="flex justify-end">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors">
                                                    <Eye size={14} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
