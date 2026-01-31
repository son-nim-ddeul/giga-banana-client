'use client';

import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Input } from '../../../components/input';

// Validation functions
const validateEmail = (email: string): string | null => {
  if (!email) {
    return "이메일 주소를 입력해주세요.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "유효한 이메일 주소를 입력해주세요.";
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) {
    return "비밀번호를 입력해주세요.";
  }
  if (password.length < 8) {
    return "비밀번호는 최소 8자 이상이어야 합니다.";
  }
  return null;
};

type FormErrors = {
  email?: string;
  password?: string;
};


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginStatus('idle');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login submitted:', { email, password });
      setLoginStatus('success');
    } catch {
      setLoginStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  // @return
  return <div className="min-h-screen w-full flex items-center justify-center bg-neutral-1 p-4 font-sans">
    <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-1">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-1 rounded-2xl mb-4">
              <Lock className="w-8 h-8 text-primary-2" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-3 mb-2">환영합니다</h1>
            <p className="text-neutral-2">계정에 로그인하여 서비스를 이용하세요</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              id="email"
              type="email"
              label="이메일 주소"
              icon={<Mail className="h-5 w-5" />}
              value={email}
              error={errors.email}
              placeholder="example@email.com"
              onValueChange={(value) => {
                setEmail(value);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              onValidation={(value) => {
                const error = validateEmail(value);
                if (error) {
                  setErrors({ ...errors, email: error });
                }
                return error;
              }}
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-neutral-3" htmlFor="password">
                  비밀번호
                </label>
                <button
                  type="button"
                  className="text-xs font-semibold text-primary-2 hover:text-primary-3 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-2/20 rounded px-1"
                >
                  비밀번호 찾기
                </button>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                icon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-2 hover:text-neutral-3 focus:outline-none focus:ring-2 focus:ring-primary-2/20 rounded transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
                value={password}
                error={errors.password}
                placeholder="••••••••"
                onValueChange={(value) => {
                  setPassword(value);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                onValidation={(value) => {
                  const error = validatePassword(value);
                  if (error) {
                    setErrors({ ...errors, password: error });
                  }
                  return error;
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "group relative w-full py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white shadow-lg transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2",
                loginStatus === 'success'
                  ? "bg-success-2 hover:bg-success-3 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-success-2"
                  : "bg-primary-2 hover:bg-primary-3 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-primary-2/50",
                isLoading && "opacity-80 cursor-not-allowed hover:scale-100"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>로그인 중...</span>
                </> : loginStatus === 'success' ? <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>성공!</span>
                </> : <>
                  <span>로그인</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-2">
              계정이 없으신가요?{' '}
              <button
                className="font-bold text-primary-2 hover:text-primary-3 focus:outline-none focus:ring-2 focus:ring-primary-2/20 rounded px-1 transition-all duration-200 hover:underline"
              >
                회원가입 하기
              </button>
            </p>
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs text-neutral-2">
        &copy; 2024 YourCompany. All rights reserved.
      </p>
    </motion.div>
  </div>;
};