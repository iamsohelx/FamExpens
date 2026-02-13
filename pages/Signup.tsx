import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signUp, signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        // Create account
        const { error: signUpError } = await signUp(email, password);

        if (signUpError) {
            setError(signUpError.message);
            setLoading(false);
            return;
        }

        // Try to sign in immediately (works if email confirmation is disabled)
        const { error: signInError } = await signIn(email, password);

        if (signInError) {
            // Email confirmation is required
            setError('Account created! Please check your email to verify, then return to login.');
            setLoading(false);
        } else {
            // Auto-login successful
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/20 overflow-hidden ring-1 ring-black/5 dark:ring-white/10">

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2.5 bg-zinc-900 dark:bg-zinc-100 rounded-lg">
                                <UserPlus className="size-5 text-zinc-50 dark:text-zinc-900" />
                            </div>
                            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
                                Create Account
                            </h1>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Start tracking your family expenses today
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium ml-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs text-zinc-500 dark:text-zinc-400 font-medium ml-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold py-3 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 mt-6"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-200 dark:border-zinc-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-500 dark:text-zinc-400">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/login"
                            className="block w-full text-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-sm font-medium py-2.5 rounded-lg transition-all"
                        >
                            Sign In Instead
                        </Link>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
                    By signing up, you agree to our terms of service
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
