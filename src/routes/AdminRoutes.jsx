import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import Loader from "../components/common/Loader";
import AdminHomeManagement from "../pages/admin/home/AdminHomeManagement";




const AdminCommentsDashboard = lazy(() =>
    import("../pages/admin/comment/AdminCommentsDashboard")
);
const BlogDashboard = lazy(() =>
    import("../pages/admin/blog/BlogDashboard")
);


// Lazy load heavy components
const AdminOverview = lazy(() =>
    import("../pages/admin/overview/AdminOverview")
);
const AdminProducts = lazy(() => import("../pages/admin/product/AdminProduct"));
const AdminCategories = lazy(() =>
    import("../pages/admin/category/AdminCategories")
);
const AdminUsers = lazy(() => import("../pages/admin/user/AdminUser"));
const AdminOrders = lazy(() => import("../pages/admin/order/AdminOrders"));
const EditProduct = lazy(() => import("../pages/admin/product/EditProduct"));
const AddProduct = lazy(() => import("../pages/admin/product/AddProduct"));
const EditCategory = lazy(() => import("../pages/admin/category/EditCategory"));
const AddCategory = lazy(() => import("../pages/admin/category/AddCategory"));
const AdminOrderDetails = lazy(() =>
    import("../pages/admin/order/AdminOrderDetails")
);

const AdminFabrics = lazy(() => import("../pages/admin/fabrics/AdminFabrics"));
const AdminOffers = lazy(() => import("../pages/admin/offer/AdminOffers"));
const AdminCoupons = lazy(() => import("../pages/admin/coupon/AdminCoupons"));
const AdminNewsletterEmails = lazy(() => import("../pages/admin/newsletter/AdminNewsletterEmails"));
// Fallback UI while components load

const AdminRoutes = (
    <Route path="/admin" element={<AdminLayout />}>
        <Route
            index
            element={
                <Suspense fallback={<Loader />}>
                    <AdminOverview />
                </Suspense>
            }
        />
        <Route
            path="home-edit"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminHomeManagement />
                </Suspense>
            }
        />
        <Route
            path="overview"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminOverview />
                </Suspense>
            }
        />

        <Route
            path="products"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminProducts />
                </Suspense>
            }
        />
        <Route
            path="products/edit/:id"
            element={
                <Suspense fallback={<Loader />}>
                    <EditProduct />
                </Suspense>
            }
        />
        <Route
            path="products/add"
            element={
                <Suspense fallback={<Loader />}>
                    <AddProduct />
                </Suspense>
            }
        />
        <Route
            path="categories"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminCategories />
                </Suspense>
            }
        />
        <Route
            path="categories/add"
            element={
                <Suspense fallback={<Loader />}>
                    <AddCategory />
                </Suspense>
            }
        />
        <Route
            path="categories/edit/:id"
            element={
                <Suspense fallback={<Loader />}>
                    <EditCategory />
                </Suspense>
            }
        />
        <Route
            path="users"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminUsers />
                </Suspense>
            }
        />
        <Route
            path="blogs"
            element={
                <Suspense fallback={<Loader />}>
                    <BlogDashboard />
                </Suspense>
            }
        />
        <Route
            path="comments"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminCommentsDashboard />
                </Suspense>
            }
        />
        <Route
            path="orders"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminOrders />
                </Suspense>
            }
        />
        <Route
            path="orders/order/:id"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminOrderDetails />
                </Suspense>
            }
        />
        <Route
            path="fabrics"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminFabrics />
                </Suspense>
            }
        />
        <Route
            path="offers"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminOffers />
                </Suspense>
            }
        />
        <Route
            path="coupon"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminCoupons />
                </Suspense>
            }
        />
        <Route
            path="newsletters"
            element={
                <Suspense fallback={<Loader />}>
                    <AdminNewsletterEmails />
                </Suspense>
            }
        />

    </Route>
);

export default AdminRoutes;
