import CommentItem from "./CommentItem";

export default function CommentList({ comments, fetchComments, user, blogId }) {
    return (
        <ul className="space-y-6 mb-6">
            {comments.length === 0 && (
                <p className="text-foreground/70">No comments yet. Be the first to comment!</p>
            )}
            {comments.map((c) => (
                <CommentItem
                    key={c._id}
                    comment={c}
                    fetchComments={fetchComments}
                    user={user}
                    blogId={blogId}
                />
            ))}
        </ul>
    );
}
