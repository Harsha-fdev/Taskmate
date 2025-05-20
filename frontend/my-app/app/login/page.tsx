'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        localStorage.setItem('accessToken', result.accessToken);
        router.push('/dashboard');
      } else {
        alert(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md w-full bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-900">Login to your account</h2>

        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register('email', { required: true })}
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            {...register('password', { required: true })}
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}
