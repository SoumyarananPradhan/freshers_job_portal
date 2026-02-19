import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Book, Briefcase, MapPin, Code, ArrowLeft, Loader2, CheckCircle, Save } from 'lucide-react';
import { AuthContext } from './AuthContext';

function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // We use one state object to handle both Student and Recruiter fields!
  const [formData, setFormData] = useState({
    full_name: '',
    university: '',
    degree: '',
    graduation_year: '',
    skills: '',
    company_name: '',
    location: '',
    about_company: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('access_token');
    
    // Fetch the existing profile data on load
    axios.get('http://127.0.0.1:8000/api/profile/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        // Merge the fetched data into our form state (handles null/missing fields gracefully)
        setFormData(prev => ({ ...prev, ...response.data }));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const token = localStorage.getItem('access_token');

    try {
      await axios.put('http://127.0.0.1:8000/api/profile/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
      // Auto-hide the success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-8 font-sans selection:bg-indigo-500 selection:text-white relative">
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-gray-400 font-bold mb-8 hover:text-indigo-400 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-gray-800 shadow-2xl">
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-3">
            {user.is_recruiter ? <Briefcase className="text-emerald-500" /> : <User className="text-indigo-500" />} 
            {user.is_recruiter ? "Company Profile" : "Your Profile"}
          </h1>
          <p className="text-gray-400 font-medium mb-8 border-b border-gray-800 pb-6">
            {user.is_recruiter ? "Update your company details so students know who they are applying to." : "Showcase your skills and education to stand out to recruiters."}
          </p>

          {message && (
            <div className={`p-4 rounded-xl mb-8 text-sm font-bold flex items-center gap-2 border ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* --- STUDENT FIELDS --- */}
            {user.is_student && (
              <>
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400" />
                    <input type="text" name="full_name" value={formData.full_name || ''} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="e.g. Aman Kumar" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">University / College</label>
                    <div className="relative">
                      <Book size={18} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-indigo-400" />
                      <input type="text" name="university" value={formData.university || ''} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="e.g. KIIT University" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Degree</label>
                      <input type="text" name="degree" value={formData.degree || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="e.g. B.Tech, MCA" />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Grad Year</label>
                      <input type="number" name="graduation_year" value={formData.graduation_year || ''} onChange={handleChange} className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600" placeholder="2026" />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-indigo-400 transition-colors">Technical Skills</label>
                  <div className="relative">
                    <Code size={18} className="absolute left-4 top-4 text-gray-500 group-focus-within:text-indigo-400" />
                    <textarea name="skills" value={formData.skills || ''} onChange={handleChange} rows="3" className="w-full pl-11 pr-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-gray-600 resize-none" placeholder="e.g. Python, React, Django, SQL (comma separated)"></textarea>
                  </div>
                </div>
              </>
            )}

            {/* --- RECRUITER FIELDS --- */}
            {user.is_recruiter && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">Company Name</label>
                    <div className="relative">
                      <Briefcase size={18} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-emerald-400" />
                      <input type="text" name="company_name" value={formData.company_name || ''} onChange={handleChange} required className="w-full pl-11 pr-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-600" placeholder="e.g. TechNova Solutions" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">Headquarters / Location</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-emerald-400" />
                      <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-600" placeholder="e.g. Bangalore, India" />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 group-focus-within:text-emerald-400 transition-colors">About the Company</label>
                  <textarea name="about_company" value={formData.about_company || ''} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-gray-950/50 border border-gray-800 text-white rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder-gray-600 resize-none" placeholder="Describe what your company does..."></textarea>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button type="submit" disabled={saving} className={`w-full mt-6 text-white font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 group ${user.is_recruiter ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] focus:ring-emerald-500/30' : 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] focus:ring-indigo-500/30'} focus:ring-4`}>
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>Save Profile <Save size={18} className="group-hover:scale-110 transition-transform" /></>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;