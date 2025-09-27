import { Link, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/apiConnector";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

const fetchBlog = async (id) => {
    const { data } = await axiosInstance.get(`/blogs/${id}`);
    return data.data;
};

const fetchComments = async (id) => {
    const { data } = await axiosInstance.get(`/comments/blog/${id}`);
    return data.data;
};

export default function BlogDetails() {
    const user = useSelector((state) => state.user.user);
    const { slug } = useParams();
    const { id } = useLocation()?.state;

    //  Blog details query
    const {
        data: blog,
        isLoading: blogLoading,
        isError: blogError,
        error: blogErr,
    } = useQuery({
        queryKey: ["blog", id],
        queryFn: () => fetchBlog(id),
        staleTime: 1000 * 60 * 10,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    // Comments query
    const {
        data: comments = [],
        isLoading: commentsLoading,
        refetch: refetchComments,
    } = useQuery({
        queryKey: ["comments", id],
        queryFn: () => fetchComments(id),
        staleTime: 1000 * 60 * 10,
        cacheTime: 1000 * 60 * 30,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    if (blogLoading || commentsLoading)
        return <p className="text-foreground text-center mt-10">Loading...</p>;
    if (blogError)
        return (
            <p className="text-center text-red-500 mt-10">
                Failed to load blog: {blogErr.message}
            </p>
        );

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Link
                to="/blogs"
                className="text-foreground hover:text-foreground/80 mb-6 block font-medium"
            >
                ← Back to Blogs
            </Link>

            <h1 className="text-4xl font-bold mb-3 text-foreground capitalize">{blog.title}</h1>
            <p className="text-sm text-foreground/70 mb-6">
                {new Date(blog.createdAt).toLocaleDateString("en-GB")}
            </p>

            {blog.coverImage && (
                <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-72 md:h-[30rem] object-cover rounded-lg shadow mb-8"
                />
            )}

            <div
                className="blog-content text-foreground text-lg leading-relaxed space-y-5 mb-10"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>

            {/* Comments Section */}
            <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Comments</h2>

                <CommentList
                    comments={comments}
                    fetchComments={refetchComments}
                    user={user}
                    blogId={id}
                />

                {user && !user.isAdmin && (
                    <CommentForm blogId={id} fetchComments={refetchComments} user={user} />
                )}
                {!user && (
                    <p className="text-foreground/70 mt-4">
                        Please{" "}
                        <Link to="/login" className="text-foreground underline">
                            login
                        </Link>{" "}
                        to post a comment.
                    </p>
                )}
            </div>
        </div>
    );
}
