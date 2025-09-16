import { useState } from "react";
import axiosInstance from "../../../utils/apiConnector";

export default function AdminReplyForm({ comment, fetchComments }) {
    const [replyText, setReplyText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleReply = async () => {
        if (!replyText.trim()) return alert("Reply cannot be empty");

        setSubmitting(true);
        try {
            await axiosInstance.put(`/comments/reply/${comment._id}`, { reply: replyText });
            setReplyText("");
            fetchComments();
        } catch (err) {
            console.error(err);
            alert("Failed to submit reply");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-2 mt-2">
            <textarea
                placeholder="Write a reply..."
                className="w-full border border-foreground/40 text-foreground rounded-lg p-2 focus:ring focus:ring-foreground/30 focus:border-foreground resize-none transition"
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
            />
            <button
                onClick={handleReply}
                disabled={submitting}
                className="px-3 py-1 bg-foreground text-white rounded hover:bg-foreground/80 transition disabled:opacity-50 self-start"
            >
                {submitting ? "Submitting..." : "Reply"}
            </button>
        </div>
    );
}
