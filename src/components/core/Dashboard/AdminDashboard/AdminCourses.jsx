import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllCoursesAdmin, deleteCourseAdmin } from "../../../../services/operations/adminAPI";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function AdminCourses() {
  const { token } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const data = await getAllCoursesAdmin(token);
    setCourses(data);
    setLoading(false);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;
    const success = await deleteCourseAdmin(courseId, token);
    if (success) setCourses(courses.filter((c) => c._id !== courseId));
  };

  const filtered = courses.filter((c) =>
    c.courseName?.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-richblack-5">Manage Courses</h1>

      <input
        type="text"
        placeholder="Search by course name or instructor..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-lg bg-richblack-800 px-4 py-2 text-richblack-5 outline-none"
      />

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-richblack-200">
            <thead className="bg-richblack-700 text-richblack-5">
              <tr>
                <th className="px-4 py-3 text-left">Course</th>
                <th className="px-4 py-3 text-left">Instructor</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course) => (
                <tr key={course._id} className="border-b border-richblack-700 bg-richblack-800 hover:bg-richblack-750">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail}
                        alt=""
                        className="h-10 w-16 rounded object-cover"
                        onError={(e) => e.target.style.display = "none"}
                      />
                      <span className="text-richblack-5 font-medium">{course.courseName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{course.instructor?.firstName} {course.instructor?.lastName}</td>
                  <td className="px-4 py-3">{course.category?.name || "-"}</td>
                  <td className="px-4 py-3">₹{course.price}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      course.status === "Published" ? "bg-green-900 text-green-200" : "bg-yellow-900 text-yellow-200"
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="rounded-lg bg-red-900 p-2 text-red-200 hover:bg-red-800"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="py-8 text-center text-richblack-300">No courses found</p>
          )}
        </div>
      )}
    </div>
  );
}
