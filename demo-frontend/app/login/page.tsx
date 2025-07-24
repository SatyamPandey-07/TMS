'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Star, Zap } from 'lucide-react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  
  const showNotification = (message: string, type: 'success' | 'error') => {
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      showNotification(result.error, 'error');
    } else {
      showNotification('Login successful!', 'success');
      
      // Get session to check user role and redirect accordingly
      const session = await getSession();
      
      if (session?.user?.role === 'admin') {
        router.push('/dashboard/owner');
      } else {
        router.push('/dashboard');
      }
    }

    setIsLoading(false);
  };

  // Demo login handlers
  const handleUserDemo = () => {
    setEmail('user@demo.com');
    setPassword('demo123');
  };

  const handleOwnerDemo = () => {
    setEmail('owner@demo.com');
    setPassword('owner123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-white dark:bg-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-50/30 dark:bg-black/10">
        <div
          className="absolute inset-0 dark:hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-gray-800 dark:text-white space-y-8 hidden lg:block"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚽</span>
              </div>
              <span className="text-3xl font-bold">TurfBooking</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight">
              Welcome Back<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Champion!</span><br />
              Ready to Play?
            </h1>
            <p className="text-xl opacity-80">
              Sign in to access premium turfs and exclusive features
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-blue-600 dark:text-white" />
              </div>
              <span>Instant Bookings</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-600 dark:text-white" />
              </div>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-white/20 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-yellow-600 dark:text-white" />
              </div>
              <span>Premium Experience</span>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Trusted by Thousands</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">15K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">800+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Premium Turfs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-black/50 p-8 border border-gray-200 dark:border-gray-700"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">⚽</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">TurfBooking</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back! 👋</h2>
            <p className="text-gray-600 dark:text-gray-400">Sign in to access your dashboard and book amazing turfs</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Demo Buttons for Mobile */}
            <div className="lg:hidden space-y-3">
              <Button
                type="button"
                onClick={handleUserDemo}
                variant="outline"
                className="w-full justify-start border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <div className="text-left">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">👤 Try User Demo</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Explore player features</div>
                </div>
              </Button>
              <Button
                type="button"
                onClick={handleOwnerDemo}
                variant="outline"
                className="w-full justify-start border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              >
                <div className="text-left">
                  <div className="font-semibold text-purple-600 dark:text-purple-400">🏢 Try Owner Demo</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Manage turfs & bookings</div>
                </div>
              </Button>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Sign Up
                </Link>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-3">
                By signing in, you agree to our{' '}
                <Link href="/easter-egg.html" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/easter-egg.html" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
