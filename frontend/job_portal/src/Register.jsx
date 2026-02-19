import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Lock, User, Mail, Building, GraduationCap, ArrowRight } from 'lucide-react';

function Register() {
  const [role, setRole] = useState('student'); // 'student' or 'recruiter'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Construct the payload exactly as our Django API expects it
    const payload = {
      username,
      email,
      password,
      is_student: role === 'student',
      is_recruiter: role === 'recruiter',
      full_name: role === 'student' ? fullName : '',
      company_name: role === 'recruiter' ? companyName : ''
    };

    try {
      await axios.post('https://fresherjobs-api.onrender.com/api/register/', payload);
      // On success, send them to the login page
      navigate('/login');
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err);
      // Display the first error message returned from Django
      const errorMsg = err.response?.data ? Object.values(err.response.data)[0][0] : 'Registration failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-6 font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <Link to="/" className="relative z-10 flex items-center gap-3 text-white font-extrabold text-3xl mb-8 hover:scale-105 transition-transform">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.5)]">
          <Briefcase size={24} className="text-white" />
        </div>
        <span className="tracking-tight">FresherJobs</span>
      </Link>

      <div className="relative z-10 bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-10 border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-2">Join the Platform.</h2>
        <p className="text-gray-400 mb-8 font-medium">Create your account and get started.</p>

        {/* Role Toggle */}
        <div className="flex bg-gray-950/50 p-1 rounded-xl mb-8 border border-gray-800">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              role === 'student' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <GraduationCap size={18} /> Student
          </button>
          <button
            type="button"
            onClick={() => setRole('recruiter')}
            className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
              role === 'recruiter' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Building size={18} /> Recruiter
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Conditional Field: Full Name OR Company Name */}
          {role === 'student' ? (
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-500 group-focus-within:text-indigo-400" />
                </div>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="John Doe" />
              </div>
            </div>
          ) : (
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Company Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building size={18} className="text-gray-500 group-focus-within:text-indigo-400" />
                </div>
                <input type="text" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="TechCorp Inc." />
              </div>
            </div>
          )}

          {/* Username */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500 group-focus-within:text-indigo-400" />
              </div>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="Choose a username" />
            </div>
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500 group-focus-within:text-indigo-400" />
              </div>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="you@example.com" />
            </div>
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500 group-focus-within:text-indigo-400" />
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full mt-4 bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] group">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <>Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;