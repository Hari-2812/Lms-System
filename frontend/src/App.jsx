import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/DashboardHome';
import CourseDetails from './pages/CourseDetails';
import CoursesPage from './pages/CoursesPage';
import EnrolledCoursesPage from './pages/EnrolledCoursesPage';
import TasksPage from './pages/TasksPage';
import ChatPage from './pages/ChatPage';
import AppointmentsPage from './pages/AppointmentsPage';
import TicketsPage from './pages/TicketsPage';
import JobsPage from './pages/JobsPage';

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="my-courses" element={<EnrolledCoursesPage />} />
          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="jobs" element={<JobsPage />} />
        </Route>

        <Route path="*" element={<div className="text-white p-10 text-center">404 - Page Not Found</div>} />
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
