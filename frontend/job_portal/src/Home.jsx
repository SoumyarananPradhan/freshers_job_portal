import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Briefcase, MapPin, DollarSign, Clock, Search, LogOut, PlusCircle, Users } from 'lucide-react';
import { AuthContext } from './AuthContext';

function Home() {
  const { user, logout } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');

  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  const fetchJobs = (query = '', pageUrl = null) => {
    setLoading(true);
    
    let url = pageUrl;
    if (!url) {
      url = query 
        ? `https://fresherjobs-api.onrender.com/api/jobs/?search=${query}` 
        : 'https://fresherjobs-api.onrender.com/api/jobs/';
    }

    axios.get(url)
      .then(response => {
        // DRF Pagination puts the actual array inside 'results'
        setJobs(response.data.results); 
        // Save the next and previous URLs provided by Django!
        setNextPage(response.data.next);
        setPrevPage(response.data.previous);
        
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Make sure your Django server is running.");
        setLoading(false);
      });
  };

  // Run once when the page loads (fetches all jobs)
  useEffect(() => {
    fetchJobs();
  }, []);

  // Triggered when the user clicks the "Search" button
  const handleSearch = () => {
    fetchJobs(searchQuery);
  };

  // Triggered when the user presses "Enter" while typing in the input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchJobs(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-gray-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Glassmorphism Navigation Bar */}
      <nav className="bg-gray-900/60 backdrop-blur-xl border-b border-gray-800 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 text-white font-extrabold text-2xl hover:scale-105 transition-transform">
          <div className="bg-indigo-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Briefcase size={24} className="text-white" />
          </div>
          <span className="tracking-tight">FresherJobs</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-5">
              
              {/* Show this ONLY to Students */}
              {user.is_student && (
                <Link to="/dashboard" className="hidden sm:flex items-center gap-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-5 py-2 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all">
                  <Briefcase size={18} /> My Applications
                </Link>
              )}

              {/* Show this ONLY to Recruiters */}
              {user.is_recruiter && (
                <div className="flex items-center gap-6">
                  <Link to="/dashboard" className="hidden sm:flex items-center gap-2 text-gray-400 font-bold hover:text-emerald-400 transition-colors">
                    <Users size={18} /> Applicants
                  </Link>
                  <Link to="/post-job" className="hidden sm:flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-5 py-2 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all">
                    <PlusCircle size={18} /> Post a Job
                  </Link>
                </div>
              )}
              
              <Link to="/profile" className="hidden md:block text-right border-l border-gray-800 pl-5 hover:opacity-80 transition-opacity cursor-pointer group">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest group-hover:text-gray-400 transition-colors">Logged in as</p>
                <p className="text-sm font-bold text-white group-hover:underline underline-offset-4 decoration-2 decoration-indigo-500">{user.username}</p>
              </Link>
              
              <button 
                onClick={logout} 
                className="flex items-center gap-2 bg-gray-800 text-gray-300 px-4 py-2 rounded-xl font-bold hover:bg-red-500/10 hover:text-red-400 border border-gray-700 hover:border-red-500/50 transition-all group"
              >
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-gray-400 font-medium hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all inline-block">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Glowing Background */}
      <header className="relative py-20 px-8 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            Kickstart Your Career.
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
            The ultimate job portal for college students and fresh graduates. Find roles perfectly matched to your potential.
          </p>
          
          {/* UPDATED: Glassy Search Bar wired to state */}
          <div className="max-w-3xl mx-auto bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-full p-2 flex items-center shadow-2xl">
            <Search className="text-gray-500 ml-5" size={24} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for 'React Developer' or 'Python Intern'..." 
              className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder-gray-500"
            />
            <button 
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-8 py-12 relative z-10">
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-3">
          <h2 className="text-2xl font-bold text-white">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Openings"}
          </h2>
          
          {/* Handy clear button if a search is active */}
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                fetchJobs('');
              }}
              className="text-sm font-bold text-gray-500 hover:text-white transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 text-center font-medium">
            {error}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800">
            <Search size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-lg font-medium">No jobs found matching your criteria. Try a different term!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(job => (
              <div key={job.id} className="bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-800 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight mb-1 group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                    <p className="text-sm font-semibold text-gray-400">{job.recruiter_name}</p>
                  </div>
                  <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-500/20">
                    {job.job_type}
                  </span>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                  <div className="flex items-center text-gray-400 text-sm font-medium">
                    <MapPin size={16} className="mr-3 text-gray-500" />
                    {job.location}
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center text-gray-400 text-sm font-medium">
                      <DollarSign size={16} className="mr-3 text-gray-500" />
                      {job.salary_range}
                    </div>
                  )}
                  <div className="flex items-center text-gray-400 text-sm font-medium">
                    <Clock size={16} className="mr-3 text-gray-500" />
                    Posted: {new Date(job.posted_at).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-gray-500 text-sm line-clamp-2 mb-6 border-t border-gray-800 pt-5">
                  {job.description}
                </p>

                <Link 
                  to={`/job/${job.id}`} 
                  className="block text-center w-full bg-gray-950 text-indigo-400 font-bold py-3 rounded-xl border border-gray-800 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
        {(nextPage || prevPage) && (
          <div className="flex justify-center items-center gap-6 mt-12 pt-8 border-t border-gray-800">
            <button 
              onClick={() => fetchJobs(searchQuery, prevPage)}
              disabled={!prevPage}
              className="px-6 py-2.5 rounded-xl font-bold bg-gray-900 border border-gray-800 text-white hover:bg-gray-800 hover:text-indigo-400 disabled:opacity-40 disabled:hover:text-white disabled:cursor-not-allowed transition-all"
            >
              &larr; Previous
            </button>
            <button 
              onClick={() => fetchJobs(searchQuery, nextPage)}
              disabled={!nextPage}
              className="px-6 py-2.5 rounded-xl font-bold bg-gray-900 border border-gray-800 text-white hover:bg-gray-800 hover:text-indigo-400 disabled:opacity-40 disabled:hover:text-white disabled:cursor-not-allowed transition-all"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;