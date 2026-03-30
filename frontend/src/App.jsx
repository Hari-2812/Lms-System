import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/DashboardHome';
import CourseDetails from './pages/CourseDetails';
import TasksPage from './pages/TasksPage';
import ChatPage from './pages/ChatPage';
import AppointmentsPage from './pages/AppointmentsPage';

// Higher order component for Protected Routes
const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Main Layout Wrapping Modules
const TasksPlaceholder = () => <div className="animate-fade-in"><h2 className="text-2xl font-bold dark:text-white">Active Tasks</h2></div>;

function AppRoutes() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
        </Route>

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="text-white p-10 text-center">
              404 - Page Not Found
            </div>
          }
        />
        
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
