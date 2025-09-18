import React, { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Loader from "../components/common/Loader";
import ScrollToTop from "../components/common/ScrollToTop";

// Lazy load public pages
const BlogDetailsPage = lazy(() => import("../pages/public/blog/BlogDetailsPage"));
const BlogsPage = lazy(() => import("../pages/public/blog/BlogsPage"));
const Home = lazy(() => import("../pages/public/home/Home"));
const SignUp = lazy(() => import("../pages/public/signup/SignUp"));
const Login = lazy(() => import("../pages/public/login/Login"));
const ResetPassword = lazy(() =>
    import("../pages/public/reset password/ResetPassword")
);
const VerifyOtp = lazy(() => import("../pages/public/verify otp/VerifyOtp"));
const Cart = lazy(() => import("../pages/public/cart/Cart"));
const Wishlist = lazy(() => import("../pages/public/wishlist/Wishlist"));
const CategoryPage = lazy(() =>
    import("../pages/public/category/CategoryPage")
);
const ProductDetailsPage = lazy(() =>
    import("../components/common/ProductDetailsPage")
);
const AboutUs = lazy(() => import("../pages/public/about/About"));
const ContactUs = lazy(() => import("../pages/public/contact/ContactUs"));
const RefundPolicy = lazy(() =>
    import("../pages/public/legal pages/RefundPolicy")
);
const TermsOfService = lazy(() =>
    import("../pages/public/legal pages/TermsOfService")
);
const ShippingPolicy = lazy(() =>
    import("../pages/public/legal pages/ShippingPolicy")
);
const PrivacyPolicy = lazy(() =>
    import("../pages/public/legal pages/PrivacyPolicy")
);
const PaymentSuccess = lazy(() =>
    import("../components/common/PaymentSuccess")
);
const PaymentFailed = lazy(() => import("../components/common/PaymentFailed"));
const NotFound = lazy(() => import("../components/common/NotFound"));

const PublicRoutes = (
    <Route element={<MainLayout />}>
        <Route
            index
            element={
                <Suspense fallback={<Loader />}>
                    <Home />
                </Suspense>
            }
        />
        <Route
            path="/login"
            element={
                <Suspense fallback={<Loader />}>
                    <Login />
                </Suspense>
            }
        />

        <Route
            path="/sign-up"
            element={
                <Suspense fallback={<Loader />}>
                    <SignUp />
                </Suspense>
            }
        />
        <Route
            path="/reset-password"
            element={
                <Suspense fallback={<Loader />}>
                    <ResetPassword />
                </Suspense>
            }
        />

        <Route
            path="/reset-password/:token"
            element={
                <Suspense fallback={<Loader />}>
                    <ResetPassword />
                </Suspense>
            }
        />
        <Route
            path="/verify-otp"
            element={
                <Suspense fallback={<Loader />}>
                    <VerifyOtp />
                </Suspense>
            }
        />
        <Route
            path="/about"
            element={
                <Suspense fallback={<Loader />}>
                    <AboutUs />
                </Suspense>
            }
        />

        <Route
            path="/products"
            element={
                <Suspense fallback={<Loader />}>
                    <CategoryPage />
                </Suspense>
            }
        />

        <Route
            path="/products/:category/:id"
            element={
                <Suspense fallback={<Loader />}>
                    <CategoryPage />
                </Suspense>
            }
        />
        <Route
            path="/collection/:fabric/:id"
            element={
                <Suspense fallback={<Loader />}>
                    <CategoryPage />
                </Suspense>
            }
        />
        <Route
            path="/product/:id"
            element={
                <Suspense fallback={<Loader />}>
                    <ProductDetailsPage />
                </Suspense>
            }
        />
        <Route
            path="/contact"
            element={
                <Suspense fallback={<Loader />}>
                    <ContactUs />
                </Suspense>
            }
        />

        {/* Legal Pages */}
        <Route
            path="/refund-policy"
            element={
                <Suspense fallback={<Loader />}>
                    <RefundPolicy />
                </Suspense>
            }
        />
        <Route
            path="/terms-of-service"
            element={
                <Suspense fallback={<Loader />}>
                    <TermsOfService />
                </Suspense>
            }
        />
        <Route
            path="/shipping-policy"
            element={
                <Suspense fallback={<Loader />}>
                    <ShippingPolicy />
                </Suspense>
            }
        />
        <Route
            path="/privacy-policy"
            element={
                <Suspense fallback={<Loader />}>
                    <PrivacyPolicy />
                </Suspense>
            }
        />

        {/* Cart & Wishlist */}
        <Route
            path="/cart"
            element={
                <Suspense fallback={<Loader />}>
                    <Cart />
                </Suspense>
            }
        />
        <Route
            path="/wishlist"
            element={
                <Suspense fallback={<Loader />}>
                    <Wishlist />
                </Suspense>
            }
        />

        {/* Payment Status */}
        <Route
            path="/paymentSuccess"
            element={
                <Suspense fallback={<Loader />}>
                    <PaymentSuccess />
                </Suspense>
            }
        />
        <Route
            path="/paymentFailed"
            element={
                <Suspense fallback={<Loader />}>
                    <PaymentFailed />
                </Suspense>
            }
        />
        {/* Blogs  Route */}
        <Route
            path="/blogs"
            element={
                <Suspense fallback={<Loader />}>
                    <BlogsPage />
                </Suspense>
            }
        />
        <Route
            path="/blogs/:slug"
            element={
                <Suspense fallback={<Loader />}>
                    <BlogDetailsPage />
                </Suspense>
            }
        />

        {/* Catch-all */}
        <Route
            path="*"
            element={
                <Suspense fallback={<Loader />}>
                    <NotFound />
                </Suspense>
            }
        />
    </Route>
);

export default PublicRoutes;
