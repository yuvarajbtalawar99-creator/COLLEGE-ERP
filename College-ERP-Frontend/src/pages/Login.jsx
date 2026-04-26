import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff, User, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { supabase, supabaseConfigError } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            toast.error('Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            if (!supabase) {
                throw new Error(supabaseConfigError || 'Supabase is not configured');
            }
            const { error, data } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });
            if (error) {
                throw error;
            }

            if (data.user) {
                api.post('/auth/sync', {
                    supabaseUserId: data.user.id,
                    email: data.user.email,
                    mobile: data.user.phone || null,
                    role: data.user.user_metadata?.role || data.user.app_metadata?.role || 'STUDENT',
                }).catch(() => {
                    // Non-blocking profile sync: user can still proceed.
                });
                toast.success('Login successful!');
                login();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full animate-fade-in max-w-sm mx-auto lg:mx-0">
            <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Student Portal Login</h2>
                <p className="text-slate-500">Please enter your institutional credentials to access the system.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="email">
                        <User size={18} className="text-slate-400" />
                        Email or Institutional ID
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
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-slate-700 flex items-center gap-2" htmlFor="password">
                            <Lock size={18} className="text-slate-400" />
                            Password
                        </label>
                        <a href="#" className="text-xs font-semibold text-primary-600 hover:underline">Forgot password?</a>
                    </div>
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

                <div className="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        id="remember" 
                        className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-600" 
                    />
                    <label className="text-sm text-slate-600 font-medium" htmlFor="remember">Keep me logged in</label>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary-600/20 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : (
                        <>
                            Sign In to Dashboard
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500 mb-4">
                    New admission? <Link to="/register" className="text-primary-600 font-bold hover:underline">Apply Here</Link>
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

export default Login;
