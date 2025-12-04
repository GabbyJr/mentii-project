import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Welcome from './pages/Welcome';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Communities from './pages/Communities';
import Chat from './pages/Chat';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import CommunityDetail from './pages/CommunityDetail';
import CreatePost from './pages/CreatePost';

// Components
import BottomNav from './components/BottomNav';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Fetch user data from backend
    }
  }, []);

  return (
    <Router>
      <div className="bg-white font-poppins min-h-screen">
        <Routes>
          {/* Onboarding */}
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />

          {/* Main App */}
          <Route path="/feed" element={isLoggedIn ? <Feed /> : <Navigate to="/login" />} />
          <Route path="/communities" element={isLoggedIn ? <Communities /> : <Navigate to="/login" />} />
          <Route path="/communities/:id" element={isLoggedIn ? <CommunityDetail /> : <Navigate to="/login" />} />
          <Route path="/chat" element={isLoggedIn ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/resources" element={isLoggedIn ? <Resources /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/create-post" element={isLoggedIn ? <CreatePost /> : <Navigate to="/login" />} />
        </Routes>

        {/* Bottom Nav - only show if logged in */}
        {isLoggedIn && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;