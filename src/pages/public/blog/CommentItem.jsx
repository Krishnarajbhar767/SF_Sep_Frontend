import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import CommentForm from "./CommentForm";
import AdminReplyForm from "./AdminReplyForm";
import axiosInstance from "../../../utils/apiConnector";

export default function CommentItem({ comment, fetchComments, user }) {
    const [editing, setEditing] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await axiosInstance.delete(`/comments/${comment._id}`);
            fetchComments();
        } catch (err) {
            console.error(err);
            alert("Failed to delete comment");
        }
    };

    const firstInitial = comment.author.firstName?.[0]?.toUpperCase() || "";
    const lastInitial = comment.author.lastName?.[0]?.toUpperCase() || "";
    const commenterName = `${comment.author.firstName} ${comment.author.lastName}`
        .split(" ")
        .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
        .join(" ");

    return (
        <li className="flex flex-col space-y-3 p-4 bg-foreground/5 border border-foreground/20 rounded-lg shadow-sm hover:shadow-md transition capitalize">
            {/* Header: Avatar + Name + Timestamp */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground/20 flex items-center justify-center text-foreground font-bold text-sm">
                        {firstInitial}{lastInitial}
                    </div>
                    <p className="font-semibold text-foreground text-sm">{commenterName}</p>
                </div>
                <span className="text-xs text-foreground/50">

                    {new Date(comment.createdAt).toLocaleDateString("en-GB")}
                    {comment.isEdited ? " (edited)" : ""}
                </span>
            </div>

            {/* Comment Text / Edit Form */}
            {editing ? (
                <CommentForm
                    commentId={comment._id}
                    initialComment={comment.comment}
                    fetchComments={fetchComments}
                    onCancel={() => setEditing(false)}
                />
            ) : (
                <p className="text-foreground text-sm leading-relaxed">{comment.comment}</p>
            )}

            {/* Admin Reply */}
            {comment.adminReply && (
                <div className="ml-12 mt-2 p-3 bg-foreground/10 border-l-2 border-foreground/40 rounded-md">
                    <p className="text-xs font-semibold text-foreground uppercase">Admin Reply</p>
                    <p className="text-foreground text-sm mt-1">{comment.adminReply}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-2 text-sm">
                {/* User actions */}
                {user && !user.isAdmin && comment.author._id === user._id && !editing && (
                    <>
                        <button
                            onClick={() => setEditing(true)}
                            className="flex items-center gap-1 text-foreground hover:text-foreground/70 transition"
                            title="Edit"
                        >
                            <FaEdit />
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                            title="Delete"
                        >
                            <FaTrash />
                        </button>
                    </>
                )}

                {/* Admin reply */}
                {user?.isAdmin && !comment.adminReply && (
                    <AdminReplyForm comment={comment} fetchComments={fetchComments} />
                )}
            </div>
        </li>
    );
}
