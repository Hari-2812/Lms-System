import { useState } from "react";
import axios from "axios";

const AppointmentsPage = () => {
  const [form, setForm] = useState({
    mentor: "Backend Mentor",
    date: "",
    time: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!form.date || !form.time) {
      setMessage("⚠️ Please select date and time");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/api/appointments`, // ✅ FIXED ROUTE
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ AUTH ADDED
          },
        }
      );

      setMessage("✅ Appointment Booked Successfully!");

      setForm({
        mentor: "Backend Mentor",
        date: "",
        time: "",
      });

    } catch (err) {
      setMessage(
        err.response?.data?.message || "❌ Booking Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">
        Book Appointment
      </h2>

      <form
        onSubmit={submitHandler}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
      >
        {/* Mentor */}
        <div>
          <label className="block mb-1">Select Mentor</label>
          <select
            className="w-full p-2 bg-gray-700 rounded"
            value={form.mentor}
            onChange={(e) =>
              setForm({ ...form, mentor: e.target.value })
            }
          >
            <option>Backend Mentor</option>
            <option>Frontend Mentor</option>
            <option>AI Mentor</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1">Select Date</label>
          <input
            type="date"
            value={form.date}
            className="w-full p-2 bg-gray-700 rounded"
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
        </div>

        {/* Time */}
        <div>
          <label className="block mb-1">Select Time</label>
          <input
            type="time"
            value={form.time}
            className="w-full p-2 bg-gray-700 rounded"
            onChange={(e) =>
              setForm({ ...form, time: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded ${
            loading
              ? "bg-gray-500"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Booking..." : "Book Appointment"}
        </button>

        {/* Message */}
        {message && (
          <p
            className={`text-center mt-2 ${
              message.includes("❌")
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AppointmentsPage;