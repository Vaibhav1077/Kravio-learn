import axios from "axios"

export const axiosInstance = axios.create({
    timeout: 30000, // 30 second timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired - will be handled by auth logic
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: `${method}`,
        url: `${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : null,
        params: params ? params : null,
    });
}