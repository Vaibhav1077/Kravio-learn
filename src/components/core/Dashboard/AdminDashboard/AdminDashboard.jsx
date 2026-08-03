import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAdminStats } from "../../../../services/operations/adminAPI";

export default function AdminDashboard() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const data = await getAdminStats(token);
      setStats(data);
      setLoading(false);
    })();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, color: "bg-blue-900", link: "/dashboard/admin/users" },
        { label: "Students", value: stats.totalStudents, color: "bg-green-900", link: "/dashboard/admin/users" },
        { label: "Instructors", value: stats.totalInstructors, color: "bg-yellow-900", link: "/dashboard/admin/users" },
        { label: "Total Courses", value: stats.totalCourses, color: "bg-purple-900", link: "/dashboard/admin/courses" },
        { label: "Published Courses", value: stats.totalPublished, color: "bg-pink-900", link: "/dashboard/admin/courses" },
        { label: "Categories", value: stats.totalCategories, color: "bg-indigo-900", link: "/dashboard/admin/categories" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-richblack-5">
          Welcome, {user?.firstName} 👋
        </h1>
        <p className="text-richblack-300">Platform Overview</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {statCards.map((card, i) => (
            <Link to={card.link} key={i}>
              <div className={`${card.color} rounded-lg p-6 hover:opacity-90 transition-opacity`}>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <p className="mt-1 text-sm text-richblack-200">{card.label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Link to="/dashboard/admin/users" className="rounded-lg bg-richblack-800 p-6 hover:bg-richblack-700 transition-colors">
          <p className="text-lg font-semibold text-richblack-5">Manage Users</p>
          <p className="mt-2 text-sm text-richblack-300">View, search and delete users</p>
        </Link>
        <Link to="/dashboard/admin/courses" className="rounded-lg bg-richblack-800 p-6 hover:bg-richblack-700 transition-colors">
          <p className="text-lg font-semibold text-richblack-5">Manage Courses</p>
          <p className="mt-2 text-sm text-richblack-300">View and delete courses</p>
        </Link>
        <Link to="/dashboard/admin/categories" className="rounded-lg bg-richblack-800 p-6 hover:bg-richblack-700 transition-colors">
          <p className="text-lg font-semibold text-richblack-5">Manage Categories</p>
          <p className="mt-2 text-sm text-richblack-300">Add and remove course categories</p>
        </Link>
      </div>
    </div>
  );
}
