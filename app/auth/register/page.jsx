"use client"

import { useEffect, useState } from 'react';
import '../../../styles/registerpage.css';
import { Home, UserPlus } from 'react-feather';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FcGoogle } from "react-icons/fc";
import feather from 'feather-icons'

export default function Register() {

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    feather.replace();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    console.log(formData)

    try {

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData}),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Signup failed");
        return;
      }

      // localStorage.setItem("accessToken", signinData.accessToken);
      router.push("/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      <div className="registerContainer">
        <div className="register-logo">
          <Home />
          <span>NestQuest</span>
        </div>

        <h1 className="register-title">Create Account</h1>
        <p className="register-subtitle">Get started with NestQuest</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-formGroup">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-formGroup">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-formGroup">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="register-formGroup">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-formGroup">
            <label htmlFor="role">Role</label>
            <select onChange={(e) => handleChange(e)} name="role" value={formData.role}>
              <option value="buyer">Buyer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="signupButton"
            disabled={loading}
          >
            <UserPlus size={20} />
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="googleButton">
          <FcGoogle size={22} />
          Continue with Google
        </button>
        <p className="loginlink">
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
