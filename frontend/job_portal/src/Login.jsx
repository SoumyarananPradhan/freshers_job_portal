import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Lock, User, ArrowRight } from 'lucide-react';

function Login() {
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://fresherjobs-api.onrender.com/api/token/', {
        username,
        password
      });

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('username', username);

      localStorage.setItem('username', response.data.username);
      localStorage.setItem('is_student', response.data.is_student);
      localStorage.setItem('is_recruiter', response.data.is_recruiter);

      setUser({ 
        username: response.data.username,
        is_student: response.data.is_student,
        is_recruiter: response.data.is_recruiter
      });

      navigate('/');
    } catch (err) {
      console.error("Login Error:", err);
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Deep dark background
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center p-6 font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Animated glowing background blob (Optional but aesthetic) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Logo Area */}
      <Link to="/" className="relative flex items-center gap-3 text-white font-extrabold text-4xl mb-10 hover:scale-105 transition-transform duration-300 z-10">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.5)]">
          <Briefcase size={28} className="text-white" />
        </div>
        <span className="tracking-tight">FresherJobs</span>
      </Link>

      {/* Glassmorphism Login Card */}
      <div className="relative z-10 bg-gray-900/60 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md p-10 border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back.</h2>
        <p className="text-gray-400 mb-8 font-medium">Own your future. Sign in to continue.</p>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium border border-red-500/20 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username Input */}
          <div className="group">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="group">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider group-focus-within:text-indigo-400 transition-colors">
                Password
              </label>
              <a href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] group"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Sign In
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400 font-medium">
          New to FresherJobs?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;






// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import { Briefcase, Lock, User } from 'lucide-react';

// function Login() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       // 1. Send credentials to Django
//       const response = await axios.post('https://fresherjobs-api.onrender.com/api/token/', {
//         username,
//         password
//       });

//       // 2. Save the tokens in the browser's local storage
//       localStorage.setItem('access_token', response.data.access);
//       localStorage.setItem('refresh_token', response.data.refresh);
      
//       // Optional: Save the username so we can display "Welcome, Admin!" later
//       localStorage.setItem('username', username);

//       // 3. Redirect back to the home page
//       navigate('/');
      
//     } catch (err) {
//       console.error("Login Error:", err);
//       setError('Invalid username or password. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
      
//       {/* Logo Area */}
//       <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-3xl mb-8 hover:text-blue-700 transition">
//         <Briefcase size={32} />
//         <span>FresherJobs</span>
//       </Link>

//       {/* Login Card */}
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
//         <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Welcome Back</h2>
//         <p className="text-gray-500 text-center mb-8">Sign in to continue your career journey.</p>

//         {error && (
//           <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-200">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <User size={18} className="text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 required
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
//                 placeholder="Enter your username"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Lock size={18} className="text-gray-400" />
//               </div>
//               <input
//                 type="password"
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition"
//                 placeholder="••••••••"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
//           >
//             {loading ? (
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//             ) : (
//               "Sign In"
//             )}
//           </button>
//         </form>

//         <p className="mt-8 text-center text-sm text-gray-600">
//           Don't have an account?{' '}
//           <Link to="/register" className="text-blue-600 font-semibold hover:underline">
//             Sign up here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;