import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";

import UserLayout from "../layout/UserLayout";
import Loader from "../components/common/Loader";
import ScrollToTop from "../components/common/ScrollToTop";
// Lazy load user pages
const Dashboard = lazy(() => import("../pages/user/dashboard/Dashboard"));
const Profile = lazy(() => import("../pages/user/profile/Profile"));
const Orders = lazy(() => import("../pages/user/orders/Orders"));
const Addresses = lazy(() => import("../pages/user/addresses/Addresses"));
const OrderDetails = lazy(() =>
    import("../pages/user/orders/components/OrderDetails")
);

const UserRoutes = (
    <Route path="/account" element={<UserLayout />}>
        <Route
            path="dashboard"
            element={
                <Suspense fallback={<Loader />}>
                    <Dashboard />
                </Suspense>
            }
        />
        <Route
            path="profile"
            element={
                <Suspense fallback={<Loader />}>
                    <Profile />
                </Suspense>
            }
        />
        <Route
            path="orders"
            element={
                <Suspense fallback={<Loader />}>
                    <Orders />
                </Suspense>
            }
        />
        <Route
            path="orders/:orderId"
            element={
                <Suspense fallback={<Loader />}>
                    <OrderDetails />
                </Suspense>
            }
        />
        <Route
            path="addresses"
            element={
                <Suspense fallback={<Loader />}>
                    <Addresses />
                </Suspense>
            }
        />
    </Route>
);

export default UserRoutes;
