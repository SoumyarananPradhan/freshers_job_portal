import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, Clock, CheckCircle, XCircle, ArrowLeft, Loader2, User, Mail, FileText } from 'lucide-react';
import { AuthContext } from './AuthContext';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('access_token');

    axios.get('http://127.0.0.1:8000/api/applications/', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        setApplications(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching dashboard:", error);
        setLoading(false);
      });
  }, [user, navigate]);

  // NEW: Function to handle recruiter clicking a status button
  const handleUpdateStatus = async (applicationId, newStatus) => {
    const token = localStorage.getItem('access_token');
    
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/applications/${applicationId}/update_status/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Instantly update the UI so the Recruiter doesn't have to refresh the page
      setApplications(prevApps => 
        prevApps.map(app => app.id === applicationId ? { ...app, status: newStatus } : app)
      );
      
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Applied': return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><Clock size={14}/> Applied</span>;
      case 'Shortlisted': return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Shortlisted</span>;
      case 'Hired': return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Hired!</span>;
      case 'Rejected': return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1"><XCircle size={14}/> Rejected</span>;
      default: return <span className="bg-gray-500/10 text-gray-400 border border-gray-500/20 px-3 py-1 rounded-lg text-xs font-bold">{status}</span>;
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><Loader2 className="animate-spin text-indigo-500" size={48} /></div>;

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-8 font-sans selection:bg-indigo-500 selection:text-white relative">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10">
          <Link to="/" className="inline-flex items-center text-gray-400 font-bold hover:text-indigo-400 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>
          <button onClick={logout} className="text-sm font-bold text-gray-400 hover:text-red-400 transition-colors">Logout</button>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
          {user.is_recruiter ? "Recruiter Dashboard" : "Student Dashboard"}
        </h1>
        <p className="text-gray-400 font-medium mb-10">
          {user.is_recruiter 
            ? "Review the candidates who have applied to your job postings." 
            : "Track your job applications and career progress."}
        </p>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-gray-800 pb-4 flex items-center gap-2">
            <Briefcase className="text-indigo-400" /> 
            {user.is_recruiter ? "Recent Applicants" : "Recent Applications"}
          </h2>

          {applications.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 font-medium mb-4">
                {user.is_recruiter ? "No one has applied to your jobs yet." : "You haven't applied to any jobs yet."}
              </p>
              <Link to={user.is_recruiter ? "/post-job" : "/"} className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                {user.is_recruiter ? "Post a Job" : "Find Jobs"}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="bg-gray-950/50 border border-gray-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start gap-6 hover:border-gray-700 transition-colors">
                  
                  <div className="w-full">
                    <div className="flex justify-between items-start w-full">
                      <h3 className="text-xl font-bold text-white mb-1">{app.job_title}</h3>
                      <div className="hidden md:block">{getStatusBadge(app.status)}</div>
                    </div>
                    
                    {user.is_recruiter ? (
                      <div className="space-y-1 mt-2">
                        <p className="text-sm text-indigo-400 font-bold flex items-center gap-2">
                          <User size={14}/> {app.applicant_name || 'Anonymous Student'}
                        </p>
                        <p className="text-xs text-gray-400 font-medium flex items-center gap-2">
                          <Mail size={14}/> {app.applicant_email}
                        </p>
                        
                        {app.cover_letter && (
                          <div className="mt-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                              <FileText size={14} /> Cover Letter
                            </p>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed italic">
                              "{app.cover_letter}"
                            </p>
                          </div>
                        )}

                        {/* NEW: Action Buttons for Recruiters */}
                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-800/50">
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'Shortlisted')}
                            className="bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Shortlist
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'Hired')}
                            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Hire
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                            className="bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Reject
                          </button>
                        </div>

                      </div>
                    ) : (
                      <p className="text-sm text-indigo-400 font-bold mb-2">{app.company_name}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Clock size={12}/> Applied {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                      <div className="md:hidden">{getStatusBadge(app.status)}</div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;