import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllUsers, deleteUser } from "../../../../services/operations/adminAPI";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function AdminUsers() {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getAllUsers(token);
    setUsers(data);
    setLoading(false);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const success = await deleteUser(userId, token);
    if (success) setUsers(users.filter((u) => u._id !== userId));
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || u.accountType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-richblack-5">Manage Users</h1>

      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg bg-richblack-800 px-4 py-2 text-richblack-5 outline-none"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg bg-richblack-800 px-4 py-2 text-richblack-5 outline-none"
        >
          <option value="All">All</option>
          <option value="Student">Students</option>
          <option value="Instructor">Instructors</option>
          <option value="Admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-richblack-200">
            <thead className="bg-richblack-700 text-richblack-5">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user._id} className="border-b border-richblack-700 bg-richblack-800 hover:bg-richblack-750">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                      <span className="text-richblack-5">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.accountType === "Admin" ? "bg-red-900 text-red-200" :
                      user.accountType === "Instructor" ? "bg-yellow-900 text-yellow-200" :
                      "bg-green-900 text-green-200"
                    }`}>
                      {user.accountType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.accountType !== "Admin" && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="rounded-lg bg-red-900 p-2 text-red-200 hover:bg-red-800"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-richblack-300">No users found</p>
          )}
        </div>
      )}
    </div>
  );
}
