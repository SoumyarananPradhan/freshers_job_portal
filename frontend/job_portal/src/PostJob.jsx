import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, MapPin, DollarSign, AlignLeft, ListChecks, ArrowLeft, Send } from 'lucide-react';
import { AuthContext } from './AuthContext';

function PostJob() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [salaryRange, setSalaryRange] = useState('');
  const [location, setLocation] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Protect the route: must be logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('access_token');

    const payload = {
      title,
      description,
      requirements,
      job_type: jobType,
      salary_range: salaryRange,
      location,
      // Note: Recruiter is automatically assigned by Django backend!
    };

    try {
      await axios.post('http://127.0.0.1:8000/api/jobs/', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // On success, take them back to the home page to see their new job
      navigate('/');
    } catch (err) {
      console.error("Error posting job:", err);
      if (err.response?.status === 500) {
        setError("Server error. Are you sure you are logged in as a Recruiter? (Students cannot post jobs)");
      } else {
        setError(err.response?.data?.detail || "Failed to post the job. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-8 font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Background Glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        <Link to="/" className="inline-flex items-center text-gray-400 font-bold mb-8 hover:text-indigo-400 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-gray-800 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-3">
            <Briefcase className="text-indigo-500" /> Post a New Job
          </h1>
          <p className="text-gray-400 font-medium mb-8 border-b border-gray-800 pb-6">Fill out the details below to publish an opening to the platform.</p>

          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-xl mb-8 text-sm font-medium border border-red-500/20 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title & Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Job Title</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="e.g. Frontend React Developer" />
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Job Type</label>
                <select value={jobType} onChange={(e) => setJobType(e.target.value)} className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>
            </div>

            {/* Location & Salary Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Location</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400" />
                  <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="e.g. Remote, Bangalore, etc." />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Salary Range (Optional)</label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400" />
                  <input type="text" value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="e.g. ₹5,00,000 - ₹8,00,000" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2"><AlignLeft size={14}/> Job Description</label>
              <textarea required rows="5" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600 resize-none" placeholder="Describe the role and responsibilities..."></textarea>
            </div>

            {/* Requirements */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors flex items-center gap-2"><ListChecks size={14}/> Requirements</label>
              <textarea required rows="4" value={requirements} onChange={(e) => setRequirements(e.target.value)} className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600 resize-none" placeholder="List the skills, education, and experience required..."></textarea>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="w-full mt-6 bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-indigo-500 focus:ring-4 focus:ring-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] group">
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>Publish Job <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default PostJob;