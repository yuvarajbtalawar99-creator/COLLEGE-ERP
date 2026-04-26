import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Eye, Users, Download, Calendar, Hash } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import StatusBadge from '../../components/StatusBadge';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const STATUS_OPTIONS = [
        { value: '', label: 'All Status' },
        { value: 'REGISTERED', label: 'Draft' },
        { value: 'SUBMITTED', label: 'Submitted' },
        { value: 'RESUBMITTED', label: 'Resubmitted' },
        { value: 'UNDER_REVIEW', label: 'Under Review' },
        { value: 'DOCUMENT_VERIFIED', label: 'Docs Verified' },
        { value: 'CORRECTION_REQUIRED', label: 'Needs Correction' },
        { value: 'ADMISSION_CONFIRMED', label: 'Approved' },
        { value: 'USN_ASSIGNED', label: 'USN Assigned' },
        { value: 'REJECTED', label: 'Rejected' },
    ];

    useEffect(() => {
        fetchBranches();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [statusFilter, branchFilter, dateFrom, dateTo]);

    const fetchBranches = async () => {
        try {
            const res = await api.get('/branches');
            if (res.data.success) {
                setBranches(res.data.data || []);
            }
        } catch (e) {
            // Branches are optional for filtering
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter) params.append('status', statusFilter);
            if (branchFilter) params.append('branchId', branchFilter);
            if (dateFrom) params.append('dateFrom', dateFrom);
            if (dateTo) params.append('dateTo', dateTo);
            if (searchQuery.trim()) params.append('search', searchQuery.trim());

            const url = `/admin/students${params.toString() ? `?${params}` : ''}`;
            const response = await api.get(url);
            if (response.data.success) {
                setStudents(response.data.data);
            }
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    // Client-side name search (since backend search may not support partial matching for all fields)
    const filteredStudents = students.filter(student => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const name = student.studentpersonaldetails?.fullName?.toLowerCase() || '';
        const email = student.user?.email?.toLowerCase() || '';
        const mobile = student.user?.mobile || '';
        const branch = student.branch?.name?.toLowerCase() || '';
        const tempId = student.tempCollegeId?.toLowerCase() || '';
        const usn = student.vtuUsn?.toLowerCase() || '';
        const appId = String(student.id);

        return name.includes(query) || email.includes(query) || mobile.includes(query) ||
               branch.includes(query) || tempId.includes(query) || usn.includes(query) || appId.includes(query);
    });

    const resetFilters = () => {
        setStatusFilter('');
        setBranchFilter('');
        setDateFrom('');
        setDateTo('');
        setSearchQuery('');
    };

    const hasFilters = statusFilter || branchFilter || dateFrom || dateTo || searchQuery;

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-100 pb-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-slate-900">Student Directory</h1>
                    <p className="text-sm text-slate-500">Comprehensive repository of all student applications and enrollment statuses.</p>
                </div>

                {hasFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs font-semibold text-primary-600 hover:text-primary-700 underline transition-colors"
                    >
                        Clear All Filters
                    </button>
                )}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap items-end gap-3 bg-white p-4 rounded-lg border border-slate-200">
                {/* Search */}
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Name, email, ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-premium pl-10 h-9 w-full text-sm"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="min-w-[160px]">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                            <Filter size={16} />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-premium pl-10 h-9 w-full text-sm appearance-none bg-white cursor-pointer"
                        >
                            {STATUS_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                            <Filter size={12} className="opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Course Filter */}
                <div className="min-w-[150px]">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Course</label>
                    <select
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                        className="input-premium h-9 w-full text-sm appearance-none bg-white cursor-pointer"
                    >
                        <option value="">All Courses</option>
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.code} — {b.name}</option>
                        ))}
                    </select>
                </div>

                {/* Date From */}
                <div className="min-w-[140px]">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">From</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                            <Calendar size={16} />
                        </div>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="input-premium pl-10 h-9 w-full text-sm"
                        />
                    </div>
                </div>

                {/* Date To */}
                <div className="min-w-[140px]">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">To</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                            <Calendar size={16} />
                        </div>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="input-premium pl-10 h-9 w-full text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-16 flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                            <Users size={20} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
                            <p className="text-slate-400 font-medium text-sm">Loading records...</p>
                        </div>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center gap-4">
                        <div className="bg-slate-100 w-14 h-14 rounded-lg flex items-center justify-center text-slate-300">
                            <Users size={28} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-semibold text-slate-900">No Records Found</h3>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">No student entries match the current filter criteria.</p>
                        </div>
                        <button
                            onClick={resetFilters}
                            className="btn-secondary h-9 px-5 text-sm"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                                        <div className="flex items-center gap-1.5"><Hash size={12} /> App ID</div>
                                    </th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Student</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Course / Quota</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Status</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Reference IDs</th>
                                    <th className="py-3 px-5 text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                        onClick={() => navigate(`/admin/students/${student.id}`)}
                                    >
                                        <td className="py-3.5 px-5">
                                            <span className="text-xs font-bold text-slate-500 font-mono bg-slate-100 px-2 py-1 rounded">#{student.id}</span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-semibold text-sm group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                    {student.studentpersonaldetails?.fullName?.[0] || student.user?.email?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 text-sm">{student.studentpersonaldetails?.fullName || 'Untitled Entry'}</div>
                                                    <div className="text-xs text-slate-400">{student.user?.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="font-medium text-slate-700 text-sm">{student.branch?.code || 'Pending'}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{student.admissionType}</div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex justify-center">
                                                <StatusBadge status={student.status} />
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="space-y-1 flex flex-col items-start font-mono">
                                                {student.tempCollegeId ? (
                                                    <span className="text-xs font-semibold bg-primary-50 text-primary-700 px-2 py-1 rounded">{student.tempCollegeId}</span>
                                                ) : (
                                                    <span className="text-xs text-slate-300 italic">Unassigned</span>
                                                )}
                                                {student.vtuUsn && (
                                                    <span className="text-xs font-semibold bg-slate-900 text-white px-2 py-1 rounded">{student.vtuUsn}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-right">
                                            <div className="flex justify-end">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors">
                                                    <Eye size={16} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Results count */}
                {!loading && filteredStudents.length > 0 && (
                    <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 font-medium">
                        Showing {filteredStudents.length} application{filteredStudents.length !== 1 ? 's' : ''}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentList;
