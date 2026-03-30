import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Loader from './components/Loader';

const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const DashboardHome = React.lazy(() => import('./pages/DashboardHome'));
const CourseDetails = React.lazy(() => import('./pages/CourseDetails'));
const CoursesPage = React.lazy(() => import('./pages/CoursesPage'));
const EnrolledCoursesPage = React.lazy(() => import('./pages/EnrolledCoursesPage'));
const TasksPage = React.lazy(() => import('./pages/TasksPage'));
const ChatPage = React.lazy(() => import('./pages/ChatPage'));
const AppointmentsPage = React.lazy(() => import('./pages/AppointmentsPage'));
const TicketsPage = React.lazy(() => import('./pages/TicketsPage'));
const JobsPage = React.lazy(() => import('./pages/JobsPage'));

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Router>
      <React.Suspense fallback={<Loader />}>
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
      </React.Suspense>
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
