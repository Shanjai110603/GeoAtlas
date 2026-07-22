'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/schemas';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Lock, Mail } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Login failed');
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['session'] });
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setServerError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-100">Welcome to GeoAtlas</h1>
          <p className="text-sm text-slate-400 mt-1">Sign in to edit and moderate geographic data</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded-xl">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2 w-full">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Demo Account: moderator@geoatlas.org / geoatlas_secret</p>
        </div>
      </Card>
    </div>
  );
}
