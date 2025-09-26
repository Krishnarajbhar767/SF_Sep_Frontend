import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
    FiHome,
    FiAlertTriangle,
    FiDollarSign,
    FiShoppingCart,
    FiStar,
    FiTrendingUp,
    FiUser,
    FiClock,
    FiGrid,
} from "react-icons/fi";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/apiConnector";

// Skeleton card component
const SkeletonCard = () => (
    <div className="bg-white border border-gray-200 rounded p-4 animate-pulse">
        <div className="h-4 w-1/4 bg-gray-300 rounded mb-2" />
        <div className="h-6 w-1/2 bg-gray-200 rounded" />
    </div>
);

// Skeleton list item
const SkeletonList = () => (
    <div className="bg-white border border-gray-200 rounded p-4 animate-pulse space-y-2">
        <div className="h-4 w-1/3 bg-gray-300 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-300 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
    </div>
);

export default function AdminOverview() {
    const queryClient = useQueryClient();

    // Fetch overview data with React Query (no caching)
    const { data, isLoading, isError } = useQuery({
        queryKey: ["admin-overview"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/admin/overview");
            return data;
        },

    });

    const [month, setMonth] = useState("");
    const [date, setDate] = useState("");

    const filterByTime = (arr, key) => {
        return arr.filter((x) => {
            const d = new Date(x[key]);
            const monthMatch = month ? d.getMonth() + 1 === +month : true;
            const dateMatch = date
                ? d.toISOString().slice(0, 10) === date
                : true;
            return monthMatch && dateMatch;
        });
    };

    // Flush React Query cache
    const handleFlushCache = () => {
        const confirmed = window.confirm(
            "Are you sure you want to flush ALL caches? This cannot be undone."
        );
        if (confirmed) {
            queryClient.clear();
            alert("All caches have been flushed!");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
        >
            {/* Buttons: Flush Cache */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={handleFlushCache}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                    Flush Cache
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between">
                <h2 className="flex items-center gap-2 text-xl font-semibold uppercase text-gray-800">
                    <FiHome /> Dashboard Overview
                </h2>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data
                    ? [
                        {
                            icon: <FiAlertTriangle className="text-red-600" />,
                            label: "Low Stock Products",
                            value: filterByTime(data.lowStockProducts, "createdAt").length,
                        },
                        {
                            icon: <FiDollarSign className="text-green-600" />,
                            label: "Total Revenue",
                            value: `₹${data.totalRevenue.toLocaleString()}`,
                        },
                        {
                            icon: <FiShoppingCart className="text-yellow-600" />,
                            label: "Pending Orders",
                            value: filterByTime(data.pendingOrders, "createdAt").length,
                        },
                        {
                            icon: <FiStar className="text-teal-600" />,
                            label: "Average Rating",
                            value: data.averageRating,
                        },
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white border border-gray-200 rounded p-4 flex items-center gap-3"
                        >
                            {card.icon}
                            <div>
                                <p className="text-xs text-gray-600 uppercase">{card.label}</p>
                                <p className="text-lg font-medium text-gray-800">{card.value}</p>
                            </div>
                        </motion.div>
                    ))
                    : Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data
                    ? [
                        {
                            icon: <FiGrid className="text-blue-600" />,
                            label: "Total Products",
                            value: data.totalProducts,
                        },
                        {
                            icon: <FiUser className="text-purple-600" />,
                            label: "Active Users",
                            value: data.activeUsers,
                        },
                        {
                            icon: <FiClock className="text-gray-600" />,
                            label: "By Delivery Status",
                            list: data.orderStats.map((s) => ({
                                key: s._id,
                                value: s.count,
                            })),
                        },
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white border border-gray-200 rounded p-4"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {item.icon}
                                <h3 className="text-sm uppercase text-gray-600">{item.label}</h3>
                            </div>
                            {item.list ? (
                                <ul className="space-y-1 text-gray-800">
                                    {item.list.map((x) => (
                                        <li key={x.key} className="flex justify-between">
                                            <span>{x.key}</span>
                                            <span>{x.value}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-lg font-medium text-gray-800">{item.value}</p>
                            )}
                        </motion.div>
                    ))
                    : Array.from({ length: 3 }).map((_, i) => <SkeletonList key={i} />)}
            </div>

            {/* Top Selling List */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white border border-gray-200 rounded p-4"
            >
                <div className="flex items-center gap-2 mb-2">
                    <FiTrendingUp className="text-green-600" />
                    <h3 className="text-sm uppercase text-gray-600">Top Selling</h3>
                </div>
                {data ? (
                    data.topSellingProducts.length > 0 ? (
                        <ul className="space-y-1 text-gray-800">
                            {data.topSellingProducts.map((p) => (
                                <li key={p.name} className="flex justify-between capitalize">
                                    <span>{p.name}</span>
                                    <span>{p.sales} sold</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 text-sm">No sales data</p>
                    )
                ) : (
                    <SkeletonList />
                )}
            </motion.div>
        </motion.div>
    );
}
