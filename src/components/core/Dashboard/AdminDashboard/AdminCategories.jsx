import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createCategory, deleteCategory } from "../../../../services/operations/adminAPI";
import { apiConnector } from "../../../../services/apiconnector";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function AdminCategories() {
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiConnector("GET", `${BASE_URL}/course/showAllCategories`);
      setCategories(res.data.data);
    } catch (e) {
      setCategories([]);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    const success = await createCategory(name, description, token);
    if (success) {
      setName("");
      setDescription("");
      fetchCategories();
    }
    setSubmitting(false);
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Delete this category?")) return;
    const success = await deleteCategory(categoryId, token);
    if (success) setCategories(categories.filter((c) => c._id !== categoryId));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-richblack-5">Manage Categories</h1>

      {/* Add Category Form */}
      <div className="rounded-lg bg-richblack-800 p-6">
        <h2 className="mb-4 text-lg font-semibold text-richblack-5">Add New Category</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Category Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg bg-richblack-700 px-4 py-2 text-richblack-5 outline-none"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg bg-richblack-700 px-4 py-2 text-richblack-5 outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-yellow-50 px-6 py-2 font-semibold text-richblack-900 hover:bg-yellow-100 disabled:opacity-50"
          >
            {submitting ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="rounded-lg overflow-hidden">
          <table className="w-full text-sm text-richblack-200">
            <thead className="bg-richblack-700 text-richblack-5">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Courses</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-richblack-700 bg-richblack-800">
                  <td className="px-4 py-3 font-medium text-richblack-5">{cat.name}</td>
                  <td className="px-4 py-3">{cat.description || "-"}</td>
                  <td className="px-4 py-3">{cat.courses?.length || 0}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(cat._id)}
                      className="rounded-lg bg-red-900 p-2 text-red-200 hover:bg-red-800"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <p className="py-8 text-center text-richblack-300">No categories found</p>
          )}
        </div>
      )}
    </div>
  );
}
