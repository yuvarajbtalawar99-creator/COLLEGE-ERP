import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, Loader2, Eye, EyeOff, GraduationCap, User, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase, supabaseConfigError } from '../lib/supabase';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        mobile: '',
        password: '',
        role: 'STUDENT'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password || !formData.mobile) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            if (!supabase) {
                throw new Error(supabaseConfigError || 'Supabase is not configured');
            }
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        role: formData.role,
                        mobile: formData.mobile,
                    },
                },
            });
            if (error) throw error;

            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-fade-in max-w-sm mx-auto lg:mx-0">
            <div className="mb-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4">
                    <GraduationCap size={14} />
                    Admission 2024
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Student Registration</h2>
                <p className="text-slate-500">Please provide your details for formal enrollment</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="email">
                        <User size={18} className="text-slate-400" />
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                        placeholder="e.g. student.name@college.edu"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="mobile">
                        <Phone size={18} className="text-slate-400" />
                        Mobile Number
                    </label>
                    <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                        placeholder="+91 00000 00000"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="password">
                        <Lock size={18} className="text-slate-400" />
                        Create Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all text-slate-900 placeholder:text-slate-400"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : (
                        <>
                            Register for Admission
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-4">
                    Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign in to your portal</Link>
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-500" /> Secured by SSL</span>
                    <span className="size-1 bg-slate-200 rounded-full"></span>
                    <span>Institutional Policy</span>
                </div>
            </div>
        </div>
    );
};

export default Register;
