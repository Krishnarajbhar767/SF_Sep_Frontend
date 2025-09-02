import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import PublicRoutes from "./PublicRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import { useSelector } from "react-redux";
import Loader from "../components/common/Loader";
import ScrollToTop from "../components/common/ScrollToTop";

function AppRoutes() {
    const token = useSelector((s) => s.user?.token);
    const isLoading = useSelector((state) => state.user.isLoading);

    if (token && isLoading) {
        return <Loader />;
    }
    return (
         <Routes>
            {PublicRoutes}

            {/* User Routes */}
            {UserRoutes}

            {/* Admin Routes */}
            {AdminRoutes}

            {/* Fallbacks */}
            <Route path="/unauthorized" element={<h1>🚫 Unauthorized</h1>} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>

    );
}

export default AppRoutes;
