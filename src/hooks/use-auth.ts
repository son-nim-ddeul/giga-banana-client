import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  name: string;
  password: string;
}

interface AuthResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
}

interface ErrorResponse {
  error: string;
}

async function loginApi(data: LoginRequest): Promise<AuthResponse> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error: ErrorResponse = await res.json();
    throw new Error(error.error);
  }

  return res.json();
}

async function signupApi(data: SignupRequest): Promise<AuthResponse> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error: ErrorResponse = await res.json();
    throw new Error(error.error);
  }

  return res.json();
}

async function refreshTokenApi(): Promise<{ accessToken: string }> {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Token refresh failed');
  }

  return res.json();
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      router.push('/images');
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: signupApi,
  });
}

export function useRefreshToken() {
  const { setAccessToken, logout } = useAuthStore();

  return useMutation({
    mutationFn: refreshTokenApi,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
    onError: () => {
      logout();
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return () => {
    logout();
    router.push('/login');
  };
}
