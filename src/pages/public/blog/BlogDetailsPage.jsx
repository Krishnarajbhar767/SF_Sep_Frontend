import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../../utils/apiConnector";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { useSelector } from "react-redux";

export default function BlogDetails() {
    const user = useSelector((state) => state.user.user);
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);

    const fetchBlog = async () => {
        try {
            const { data } = await axiosInstance.get(`/blogs/${id}`);
            setBlog(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchComments = async () => {
        try {
            const { data } = await axiosInstance.get(`/comments/blog/${id}`);
            setComments(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBlog();
        fetchComments();
    }, [id]);

    if (!blog) return <p className="text-foreground text-center mt-10">Loading...</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Link
                to="/blogs"
                className="text-foreground hover:text-foreground/80 mb-6 block font-medium"
            >
                ← Back to Blogs
            </Link>

            <h1 className="text-4xl font-bold mb-3 text-foreground">{blog.title}</h1>
            <p className="text-sm text-foreground/70 mb-6">
                {new Date(blog.createdAt).toLocaleDateString()}
            </p>

            {blog.coverImage && (
                <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-72 md:h-96 object-cover rounded-lg shadow mb-8"
                />
            )}

            <div
                className="blog-content text-foreground text-lg leading-relaxed space-y-5 mb-10"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>

            <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Comments</h2>

                <CommentList
                    comments={comments}
                    fetchComments={fetchComments}
                    user={user}
                    blogId={id}
                />

                {user && !user.isAdmin && (
                    <CommentForm blogId={id} fetchComments={fetchComments} user={user} />
                )}
                {console.log('USer Alert', user)}
                {!user && (
                    <p className="text-foreground/70 mt-4">
                        Please <Link to="/login" className="text-foreground underline">login</Link> to post a comment.
                    </p>
                )}
            </div>
        </div>
    );
}
