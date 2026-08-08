import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import UserDashboard from "../pages/user/Dashboard";
import AdminDashboard from "../pages/admin/Dashboard";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import MyToken from "../pages/user/MyToken";
import LandingPage from "../pages/LandingPage";

const AppRoutes = () => {
    return (
        <Routes>

            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User Routes */}
            <Route
                path="/user/dashboard"
                element={
                    <RoleProtectedRoute role="user">
                        <UserDashboard />
                    </RoleProtectedRoute>
                }
            />

            <Route
                path="/user/my-token"
                element={
                    <RoleProtectedRoute role="user">
                        <MyToken />
                    </RoleProtectedRoute>
                }
            />

            {/* Admin Routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <RoleProtectedRoute role="admin">
                        <AdminDashboard />
                    </RoleProtectedRoute>
                }
            />

        </Routes>

    );
};

export default AppRoutes;