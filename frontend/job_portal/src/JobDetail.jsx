import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, DollarSign, Clock, Building, ArrowLeft, CheckCircle, X } from 'lucide-react';
import { AuthContext } from './AuthContext';

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); 
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Application & Modal States
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyStatus, setApplyStatus] = useState(null); 
  const [applyMessage, setApplyMessage] = useState('');
  
  // NEW: States for the Cover Letter Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    axios.get(`https://fresherjobs-api.onrender.com/api/jobs/${id}/`)
      .then(response => {
        setJob(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching job details:", error);
        setLoading(false);
      });
  }, [id]);

  // Modified to actually send the cover letter!
  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setApplyLoading(true);
    setApplyStatus(null);
    setApplyMessage('');

    const token = localStorage.getItem('access_token');

    try {
      await axios.post(
        `https://fresherjobs-api.onrender.com/api/jobs/${id}/apply/`,
        { cover_letter: coverLetter }, // Send the cover letter text!
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setApplyStatus('success');
      setApplyMessage('Application submitted successfully!');
      setIsModalOpen(false); // Close the modal on success
      
    } catch (err) {
      setApplyStatus('error');
      if (err.response) {
        setApplyMessage(err.response.data.error || 'Failed to apply.');
      } else {
        setApplyMessage('Network error. Make sure Django is running.');
      }
      setIsModalOpen(false); // Close the modal on error so they can see the message
    } finally {
      setApplyLoading(false);
    }
  };

  // Function to open modal (checks login first)
  const openApplyModal = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setIsModalOpen(true);
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>;
  if (!job) return <div className="min-h-screen bg-gray-950 flex justify-center items-center text-xl text-red-400 font-bold">Job not found.</div>;

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-8 font-sans selection:bg-indigo-500 selection:text-white relative">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* NEW: Cover Letter Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Write a Cover Letter</h3>
            <p className="text-gray-400 text-sm mb-6 font-medium">Stand out by telling <span className="text-indigo-400">{job.recruiter_name}</span> why you are a perfect fit for this role.</p>
            
            <textarea 
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows="6"
              placeholder="Dear Hiring Manager, I am very interested in this role because..."
              className="w-full bg-gray-950/50 border border-gray-800 rounded-xl p-4 text-white placeholder-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-6 font-medium"
            ></textarea>
            
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                Cancel
              </button>
              <button 
                onClick={handleApply} 
                disabled={applyLoading}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-70 flex items-center gap-2 transition-all"
              >
                {applyLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="inline-flex items-center text-gray-400 font-bold mb-8 hover:text-indigo-400 transition-colors group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Jobs
        </Link>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-gray-800 shadow-2xl mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">{job.title}</h1>
          <div className="flex items-center text-xl font-bold text-indigo-400 mb-8">
            <Building size={24} className="mr-3" /> {job.recruiter_name}
          </div>

          <div className="flex flex-wrap gap-4 mb-10">
            <span className="bg-indigo-500/10 text-indigo-400 font-bold px-5 py-2.5 rounded-xl border border-indigo-500/20">{job.job_type}</span>
            <div className="flex items-center text-gray-300 bg-gray-950/50 border border-gray-800 px-5 py-2.5 rounded-xl font-medium">
              <MapPin size={18} className="mr-3 text-gray-500" /> {job.location}
            </div>
            {job.salary_range && (
               <div className="flex items-center text-gray-300 bg-gray-950/50 border border-gray-800 px-5 py-2.5 rounded-xl font-medium">
                <DollarSign size={18} className="mr-3 text-gray-500" /> {job.salary_range}
              </div>
            )}
             <div className="flex items-center text-gray-300 bg-gray-950/50 border border-gray-800 px-5 py-2.5 rounded-xl font-medium">
              <Clock size={18} className="mr-3 text-gray-500" /> Posted {new Date(job.posted_at).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <button 
              onClick={openApplyModal} // Now opens the modal instead of applying instantly
              disabled={applyStatus === 'success'}
              className={`px-10 py-4 rounded-xl font-bold transition-all w-full md:w-auto text-lg flex justify-center items-center gap-2
                ${applyStatus === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] disabled:opacity-70 disabled:cursor-not-allowed'
                }`}
            >
              {applyStatus === 'success' ? (
                <><CheckCircle size={22} /> Applied!</>
              ) : (
                "Apply Now"
              )}
            </button>
            
            {applyMessage && (
              <p className={`font-medium ${applyStatus === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {applyMessage}
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl p-10 border border-gray-800 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Job Description</h2>
          <p className="text-gray-400 whitespace-pre-wrap leading-relaxed mb-10 font-medium">{job.description}</p>
          
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-gray-800 pb-4">Requirements</h2>
          <p className="text-gray-400 whitespace-pre-wrap leading-relaxed font-medium">{job.requirements}</p>
        </div>

      </div>
    </div>
  );
}

export default JobDetail;