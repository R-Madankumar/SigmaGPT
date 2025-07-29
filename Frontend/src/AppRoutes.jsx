// AppRoutes.jsx
import {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/login.jsx"
import Signup from './pages/signup.jsx';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';

const AppRoutes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={
        <div className="main">
          <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
          <ChatWindow toggleSidebar={toggleSidebar} />
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;
