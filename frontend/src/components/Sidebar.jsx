import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-900 text-white p-5">
      <h1 className="text-xl font-bold mb-6">LMS</h1>

      <nav className="space-y-4">
        <Link to="/" className="block hover:text-blue-400">Dashboard</Link>
        <Link to="/appointments" className="block hover:text-blue-400">Appointments</Link>
        <Link to="/courses" className="block hover:text-blue-400">Courses</Link>
      </nav>
    </div>
  );
};

export default Sidebar;