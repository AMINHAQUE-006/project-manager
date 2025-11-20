'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from "@/components/ui/separator";
import { FolderKanban, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import Image from "next/image";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login, googleLogin }: any = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("GOOGLE LOGGIN")
    setGoogleLoading(true);
    setError('');

    try {
      await googleLogin();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Google login failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <FolderKanban className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="text-base">
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>

      <CardContent>
        
        {/* 🔹 Google Login */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Image src="/google.svg" alt="Google" width={18} height={18} />
          )}
          Continue with Google
        </Button>

        {/* Shadcn separator */}
        <div className="flex items-center my-6">
          <Separator className="flex-1" />
          <span className="px-3 text-xs text-muted-foreground">OR CONTINUE WITH EMAIL</span>
          <Separator className="flex-1" />
        </div>

        {/* 🔹 Email & Password */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                disabled={loading || googleLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || googleLoading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link href="/register" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 font-medium mb-2">Demo Account:</p>
          <p className="text-xs text-gray-500">Email: demo@example.com</p>
          <p className="text-xs text-gray-500">Password: demo123456</p>
        </div>

      </CardContent>
    </Card>
  );
}
