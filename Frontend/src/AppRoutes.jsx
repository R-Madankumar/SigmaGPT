// AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from "./pages/login.jsx"
import Signup from './pages/signup.jsx';
import Sidebar from './Sidebar.jsx';
import ChatWindow from './ChatWindow.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={
        <div className="main">
          <Sidebar />
          <ChatWindow />
        </div>
      } />
    </Routes>
  );
};

export default AppRoutes;
