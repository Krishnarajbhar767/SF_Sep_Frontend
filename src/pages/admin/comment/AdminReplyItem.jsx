import { useState } from "react";
import { FaReply, FaPaperPlane, FaTrash, FaEdit } from "react-icons/fa";
import axiosInstance from "../../../utils/apiConnector";

export default function AdminReplyItem({ comment, fetchComments, allowDelete = false }) {
    const [reply, setReply] = useState(comment.adminReply || "");
    const [replying, setReplying] = useState(false);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!reply.trim()) return;

        try {
            await axiosInstance.put(`/comments/reply/${comment._id}`, { reply });
            setReplying(false);
            fetchComments();
        } catch (err) {
            console.error(err);
            alert("Failed to submit reply");
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
                <p className="font-semibold text-gray-800 capitalize">
                    {comment.author.firstName} {comment.author.lastName}
                </p>
                <span className="ml-auto text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>

            <p className="text-gray-700 text-sm">{comment.comment}</p>

            {/* Admin reply section */}
            <div className="mt-2 pl-4 border-l-2 border-gray-400 bg-gray-100 rounded p-2 flex flex-col gap-1">
                {comment.adminReply && !replying && (
                    <>
                        <p className="font-medium text-gray-700">Admin Reply:</p>
                        <p className="text-gray-700 text-sm">{comment.adminReply}</p>
                        <button
                            onClick={() => setReplying(true)}
                            className="flex items-center gap-1 text-gray-700 border border-gray-400 px-2 py-1 rounded text-sm hover:bg-gray-200 transition mt-1"
                        >
                            <FaEdit /> Edit Reply
                        </button>
                    </>
                )}

                {(replying || !comment.adminReply) && (
                    <form onSubmit={handleReplySubmit} className="flex flex-col gap-2">
                        <textarea
                            className="border border-gray-300 rounded p-2 text-gray-700 text-sm"
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Type your reply..."
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex items-center gap-1 justify-center bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition text-sm"
                            >
                                <FaPaperPlane /> Send
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setReplying(false);
                                    setReply(comment.adminReply || "");
                                }}
                                className="flex items-center gap-1 justify-center border border-gray-400 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Delete comment button */}
            {allowDelete && (
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 mt-2 text-red-600 border border-red-600 px-2 py-1 rounded text-sm hover:bg-red-100 transition w-full sm:w-fit"
                >
                    <FaTrash /> Delete
                </button>
            )}
        </li>
    );
}
