'use client';

import React, { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, PartyPopper } from 'lucide-react';
import { Input } from '../../../components/input';
import { Button } from '../../../components/button';
import { Footer } from '../../../components/footer';
import { Confetti } from '../../../components/confetti';
import Link from 'next/link';
import { useSignup } from '@/hooks/use-auth';

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

const validateName = (name: string): string | null => {
  if (!name) {
    return "이름을 입력해주세요.";
  }
  if (name.length < 2) {
    return "이름은 최소 2자 이상이어야 합니다.";
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

const validatePasswordConfirm = (password: string, passwordConfirm: string): string | null => {
  if (!passwordConfirm) {
    return "비밀번호 확인을 입력해주세요.";
  }
  if (password !== passwordConfirm) {
    return "비밀번호가 일치하지 않습니다.";
  }
  return null;
};

type FormErrors = {
  email?: string;
  name?: string;
  password?: string;
  passwordConfirm?: string;
};

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const signupMutation = useSignup();
  const serverError = signupMutation.error?.message;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailError = validateEmail(email);
    if (emailError) {
      newErrors.email = emailError;
    }

    const nameError = validateName(name);
    if (nameError) {
      newErrors.name = nameError;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    const passwordConfirmError = validatePasswordConfirm(password, passwordConfirm);
    if (passwordConfirmError) {
      newErrors.passwordConfirm = passwordConfirmError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    signupMutation.mutate({ email, name, password });
  };

  if (signupMutation.isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-neutral-1 p-4 font-sans">
        <Confetti />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-1">
            <div className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-6 overflow-hidden"
              >
                <img 
                  src="/giga_banana.png" 
                  alt="Giga Banana" 
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-neutral-3 mb-3"
              >
                가입을 환영합니다!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-neutral-2 mb-8"
              >
                회원가입이 완료되었습니다.<br />
                로그인하여 서비스를 이용해보세요.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center w-full h-12 bg-primary-2 text-white font-semibold rounded-xl hover:bg-primary-3 transition-colors duration-200"
                >
                  로그인 하러 가기
                </Link>
              </motion.div>
            </div>
          </div>

          <Footer />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-1 p-4 font-sans">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.5
        }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-1">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 overflow-hidden">
                <img 
                  src="/giga_banana.png" 
                  alt="Giga Banana" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-neutral-3 mb-2">회원가입</h1>
              <p className="text-neutral-2">새로운 계정을 만들어 서비스를 시작하세요</p>
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

              <Input
                id="name"
                type="text"
                label="이름"
                icon={<User className="h-5 w-5" />}
                value={name}
                error={errors.name}
                placeholder="홍길동"
                onValueChange={(value) => {
                  setName(value);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                onValidation={(value) => {
                  const error = validateName(value);
                  if (error) {
                    setErrors({ ...errors, name: error });
                  }
                  return error;
                }}
              />

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                label="비밀번호"
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
                  // 비밀번호가 변경되면 비밀번호 확인도 다시 검증
                  if (passwordConfirm && errors.passwordConfirm) {
                    const passwordConfirmError = validatePasswordConfirm(value, passwordConfirm);
                    if (passwordConfirmError) {
                      setErrors({ ...errors, passwordConfirm: passwordConfirmError });
                    } else {
                      setErrors({ ...errors, passwordConfirm: undefined });
                    }
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

              <Input
                id="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                label="비밀번호 확인"
                icon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="text-neutral-2 hover:text-neutral-3 focus:outline-none focus:ring-2 focus:ring-primary-2/20 rounded transition-colors duration-200"
                  >
                    {showPasswordConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                }
                value={passwordConfirm}
                error={errors.passwordConfirm}
                placeholder="••••••••"
                onValueChange={(value) => {
                  setPasswordConfirm(value);
                  if (errors.passwordConfirm) {
                    setErrors({ ...errors, passwordConfirm: undefined });
                  }
                }}
                onValidation={(value) => {
                  const error = validatePasswordConfirm(password, value);
                  if (error) {
                    setErrors({ ...errors, passwordConfirm: error });
                  }
                  return error;
                }}
              />

              {serverError && (
                <p className="text-sm text-red-500 text-center">{serverError}</p>
              )}

              <Button
                isLoading={signupMutation.isPending}
                isSuccess={signupMutation.isSuccess}
                loadingText="가입 중..."
                successText="성공!"
              >
                회원가입
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-2">
                이미 계정이 있으신가요?{' '}
                <Link
                  href="/login"
                  className="font-bold text-primary-2 hover:text-primary-3 focus:outline-none focus:ring-2 focus:ring-primary-2/20 rounded px-1 transition-all duration-200 hover:underline"
                >
                  로그인 하기
                </Link>
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </motion.div>
    </div>
  );
}
