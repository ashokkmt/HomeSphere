"use client"

import { useEffect, useState } from 'react';
import '../../../styles/loginpage.css';
import feather from 'feather-icons'
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { LogIn } from 'react-feather';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/UserContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    feather.replace();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Replace with actual API call
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Sign in failed");
        return;
      }

      await refreshUser();
      router.push("/"); // or your dashboard
      // router.refresh();
      // window.location.href = "/";

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="loginContainer">
        <div className="login-logo">
          <i data-feather="home"></i>
          <span>NestQuest</span>
        </div>

        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Please enter your details</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="/forgot-password" className="forgotPassword">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="loginButton"
            disabled={loading}
          >
            <LogIn size={20} />
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="googleButton">
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <p className="signupLink">
          Don't have an account? <Link href="/auth/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}