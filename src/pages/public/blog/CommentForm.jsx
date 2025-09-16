import { useState } from "react";
import axiosInstance from "../../../utils/apiConnector";
import toast from "react-hot-toast";

export default function CommentForm({ blogId, fetchComments, user, commentId, initialComment, onCancel }) {
    const [commentText, setCommentText] = useState(initialComment || "");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return alert("Comment cannot be empty");

        setSubmitting(true);
        try {
            if (commentId) {
                await axiosInstance.put(`/comments/${commentId}`, { comment: commentText });
                toast.success('Success')
            } else {
                await axiosInstance.post("/comments/", { blogId, comment: commentText });
                toast.success('Comment Added, Wait for Admin Approval')
            }
            setCommentText("");
            fetchComments();
            if (onCancel) onCancel();
        } catch (err) {
            console.error(err);
            alert("Failed to submit comment");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 mt-2">
            <textarea
                placeholder="Write your comment here..."
                className="w-full border border-foreground/40 text-foreground rounded-lg p-3 focus:ring focus:ring-foreground/30 focus:border-foreground resize-none transition"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                required
            />
            <div className="flex flex-wrap gap-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-foreground text-white rounded hover:bg-foreground/80 transition disabled:opacity-50"
                >
                    {submitting ? "Submitting..." : commentId ? "Update" : "Post Comment"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
