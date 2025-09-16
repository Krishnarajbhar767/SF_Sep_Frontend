import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import axiosInstance from "../../../utils/apiConnector";

export default function AdminModerateItem({ comment, fetchComments }) {
    const handleApprove = async () => {
        try {
            await axiosInstance.put(`/comments/moderate/${comment._id}`, { action: "approve" });
            fetchComments();
        } catch (err) {
            console.error(err);
            alert("Failed to approve comment");
        }
    };

    const handleReject = async () => {
        try {
            await axiosInstance.put(`/comments/moderate/${comment._id}`, { action: "reject" });
            fetchComments();
        } catch (err) {
            console.error(err);
            alert("Failed to reject comment");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete comment permanently?")) return;
        try {
            await axiosInstance.delete(`/comments/admin/${comment._id}`);
            fetchComments();
        } catch (err) {
            console.error(err);
            alert("Failed to delete comment");
        }
    };

    const initials = `${comment.author.firstName[0] || ""}${comment.author.lastName[0] || ""}`.toUpperCase();

    return (
        <li className="bg-gray-50 border border-gray-300 rounded-xl p-4 flex flex-col gap-2 shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-bold">
                    {initials}
                </div>
                <p className="font-semibold text-gray-800 capitalize">{comment.author.firstName} {comment.author.lastName}</p>
                <span className="ml-auto text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-700 text-sm">{comment.comment}</p>

            <div className="flex gap-2 mt-2 flex-wrap">
                <button
                    onClick={handleApprove}
                    className="flex items-center gap-1 px-2 py-1 border border-green-700 text-green-700 rounded text-sm hover:bg-green-100 transition"
                >
                    <FaCheck /> Approve
                </button>
                <button
                    onClick={handleReject}
                    className="flex items-center gap-1 px-2 py-1 border border-red-700 text-red-700 rounded text-sm hover:bg-red-100 transition"
                >
                    <FaTimes /> Reject
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 px-2 py-1 border border-red-600 text-red-600 rounded text-sm hover:bg-red-100 transition"
                >
                    <FaTrash /> Delete
                </button>
            </div>
        </li>
    );
}
