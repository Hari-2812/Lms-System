const Navbar = () => {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between">
      <h2>Welcome, User</h2>
      <button className="bg-red-500 px-3 py-1 rounded">Logout</button>
    </div>
  );
};

export default Navbar;