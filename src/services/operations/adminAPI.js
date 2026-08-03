import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:4000/api/v1";
const ADMIN_URL = `${BASE_URL}/admin`;

export const getAdminStats = async (token) => {
  try {
    const res = await apiConnector("GET", `${ADMIN_URL}/stats`, null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data.data;
  } catch (error) {
    toast.error("Could not fetch stats");
    return null;
  }
};

export const getAllUsers = async (token) => {
  try {
    const res = await apiConnector("GET", `${ADMIN_URL}/users`, null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data.data;
  } catch (error) {
    toast.error("Could not fetch users");
    return [];
  }
};

export const deleteUser = async (userId, token) => {
  try {
    const res = await apiConnector("DELETE", `${ADMIN_URL}/users`, { userId }, {
      Authorization: `Bearer ${token}`,
    });
    if (res.data.success) toast.success("User deleted");
    return res.data.success;
  } catch (error) {
    toast.error("Could not delete user");
    return false;
  }
};

export const getAllCoursesAdmin = async (token) => {
  try {
    const res = await apiConnector("GET", `${ADMIN_URL}/courses`, null, {
      Authorization: `Bearer ${token}`,
    });
    return res.data.data;
  } catch (error) {
    toast.error("Could not fetch courses");
    return [];
  }
};

export const deleteCourseAdmin = async (courseId, token) => {
  try {
    const res = await apiConnector("DELETE", `${ADMIN_URL}/courses`, { courseId }, {
      Authorization: `Bearer ${token}`,
    });
    if (res.data.success) toast.success("Course deleted");
    return res.data.success;
  } catch (error) {
    toast.error("Could not delete course");
    return false;
  }
};

export const createCategory = async (name, description, token) => {
  try {
    const res = await apiConnector("POST", `${ADMIN_URL}/categories`, { name, description }, {
      Authorization: `Bearer ${token}`,
    });
    if (res.data.success) toast.success("Category created");
    return res.data.success;
  } catch (error) {
    toast.error("Could not create category");
    return false;
  }
};

export const deleteCategory = async (categoryId, token) => {
  try {
    const res = await apiConnector("DELETE", `${ADMIN_URL}/categories`, { categoryId }, {
      Authorization: `Bearer ${token}`,
    });
    if (res.data.success) toast.success("Category deleted");
    return res.data.success;
  } catch (error) {
    toast.error("Could not delete category");
    return false;
  }
};
