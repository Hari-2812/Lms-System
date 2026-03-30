import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, User } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
        role: 'student',
      });

      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full max-w-md p-8 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div><label>Name</label><div className="flex items-center border rounded px-2"><User size={16} /><input type="text" className="w-full p-2 outline-none" value={name} onChange={(e) => setName(e.target.value)} required /></div></div>
          <div><label>Email</label><div className="flex items-center border rounded px-2"><Mail size={16} /><input type="email" className="w-full p-2 outline-none" value={email} onChange={(e) => setEmail(e.target.value)} required /></div></div>
          <div><label>Password</label><div className="flex items-center border rounded px-2"><Lock size={16} /><input type="password" className="w-full p-2 outline-none" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} /></div></div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded flex items-center justify-center gap-2"><UserPlus size={16} /> Register</button>
        </form>

        <div className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></div>
      </motion.div>
    </div>
  );
};

export default Register;
