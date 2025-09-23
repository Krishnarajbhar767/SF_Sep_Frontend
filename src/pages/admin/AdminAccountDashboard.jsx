import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiBox, FiGrid, FiUsers, FiShoppingCart } from "react-icons/fi";
import { GiClothes } from "react-icons/gi";
import { BiSolidOffer, BiSolidCoupon } from "react-icons/bi";
import { FaBloggerB } from "react-icons/fa";
import { FaComments } from "react-icons/fa6";
import { MdMarkEmailRead } from "react-icons/md";

import { useMemo } from "react";

// Animation variants for sidebar links
const sidebarLinkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.3,
        },
    }),
};

// Animation variants for tab links
const tabLinkVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.3,
        },
    }),
};

function AdminAccountDashboard() {
    const location = useLocation();

    const navItems = useMemo(() => {
        return [

            { path: "overview", label: "Overview", icon: <FiHome size={20} /> },
            { path: "products", label: "Products", icon: <FiBox size={20} /> },
            {
                path: "categories",
                label: "Categories",
                icon: <FiGrid size={20} />,
            },
            { path: "users", label: "Users", icon: <FiUsers size={20} /> },
            { path: "blogs", label: "Blogs", icon: < FaBloggerB size={20} /> },
            { path: "comments", label: "Comments", icon: < FaComments size={20} /> },
            {
                path: "orders",
                label: "Orders",
                icon: <FiShoppingCart size={20} />,
            },
            {
                path: "fabrics",
                label: "fabrics",
                icon: <GiClothes size={20} />,
            },
            {
                path: "offers",
                label: "offers",
                icon: <BiSolidOffer size={20} />,
            },
            {
                path: "coupon",
                label: "coupon",
                icon: <BiSolidCoupon size={20} />,
            },
            {
                path: "newsletters",
                label: "newsletters",
                icon: <MdMarkEmailRead size={20} />,
            },
        ];
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-auto w-full boxedContainer py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 min-h-screen"
        >
            {/* Mobile Navigation: Tabbed Interface */}
            <div className="md:hidden flex border-b border-gray-200 mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {navItems.map((item, index) => (
                    <motion.div
                        key={item.path}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={tabLinkVariants}
                    >
                        <Link
                            to={`/admin/${item.path}`}
                            className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium uppercase transition-colors duration-300 whitespace-nowrap ${location.pathname === `/admin/${item.path}`
                                ? "text-gray-800"
                                : "text-gray-600 hover:text-gray-800"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                            {location.pathname === `/admin/${item.path}` && (
                                <motion.div
                                    className="absolute bottom-0 left-0 w-full h-1 bg-gray-800"
                                    layoutId="underline"
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Sidebar Navigation (Desktop Only) */}
                <aside className="hidden md:block w-full md:w-64 flex-shrink-0">
                    <nav className="border border-gray-200 rounded-lg p-4 space-y-2 bg-white shadow-md">
                        {navItems.map((item, index) => (
                            <motion.div
                                key={item.path}
                                custom={index}
                                initial="hidden"
                                animate="visible"
                                variants={sidebarLinkVariants}
                            >
                                <Link
                                    to={`/admin/${item.path}`}
                                    className={`flex items-center gap-3 px-4 py-3 text-base font-medium uppercase rounded-md transition-all duration-300 ${location.pathname ===
                                        `/admin/${item.path}`
                                        ? "bg-gray-800 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </motion.div>
    );
}

export default AdminAccountDashboard;
