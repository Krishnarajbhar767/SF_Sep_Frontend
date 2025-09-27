import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiMail, FiDownload } from "react-icons/fi";
import { toast } from "react-hot-toast";
import axiosInstance from "../../../utils/apiConnector";
import * as XLSX from "xlsx";

export default function AdminNewsletterEmails() {
    // Fetch emails using React Query without caching
    const { data: emails = [], isLoading, isError } = useQuery({
        queryKey: ["newsletter-emails"],
        queryFn: async () => {
            const { data } = await axiosInstance.get("/admin/newsletters");
            return Array.isArray(data) ? data : [];
        },

    });

    if (isError) {
        toast.error("Failed to load newsletter emails.");
    }

    // Memoize formatted data for Excel export
    const excelData = useMemo(
        () =>
            emails.map((item, index) => ({
                SNo: index + 1,
                Email: item?.email || "",
            })),
        [emails]
    );

    const exportToExcel = () => {
        if (excelData.length === 0) return;

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Subscribers");
        XLSX.writeFile(workbook, "newsletter_subscribers.xlsx");
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Newsletter Subscribers
                </h2>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Total: {emails.length}</span>
                    {emails.length > 0 && (
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-800 text-white rounded hover:bg-gray-700"
                        >
                            <FiDownload /> Export
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
            ) : emails.length === 0 ? (
                <p className="text-gray-600">No subscribers found.</p>
            ) : (
                <ul className="capitalize bg-white border border-gray-200 rounded-lg divide-y">
                    {emails.map((item, index) => (
                        <li
                            key={index}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                        >
                            <FiMail className="text-gray-500" />
                            {item?.email}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
