import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import JobDetail from './JobDetail';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import PostJob from './PostJob';
import Profile from './Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/job/:id" element={<JobDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;