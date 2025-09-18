import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../utils/apiConnector";

const fetchBlogs = async () => {
    const { data } = await axiosInstance.get("/blogs/all");
    return data?.data || [];
};

export default function Blogs() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const blogsPerPage = 6;

    //  React Query hook
    const {
        data: blogs = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["blogs"],
        queryFn: fetchBlogs,
        staleTime: 1000 * 60 * 10, // 10 minutes: use cache if fresh
        cacheTime: 1000 * 60 * 30, // keep in memory for 30 min
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    //  Filter and paginate
    const filteredBlogs = useMemo(
        () =>
            blogs.filter((blog) =>
                blog.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
            ),
        [blogs, searchQuery]
    );

    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage) || 1;
    const currentBlogs = useMemo(
        () =>
            filteredBlogs.slice(
                (currentPage - 1) * blogsPerPage,
                currentPage * blogsPerPage
            ),
        [filteredBlogs, currentPage]
    );

    const readMoreHandler = (blog) => {
        navigate(`/blogs/${blog.slug}`, { state: { id: blog._id } });
    };

    //  Handle loading and error states
    if (isLoading)
        return (
            <p className="text-center text-foreground/70 mt-10">Loading blogs...</p>
        );
    if (isError)
        return (
            <p className="text-center text-red-500 mt-10">
                Failed to load blogs: {error.message}
            </p>
        );

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold text-center mb-8 text-foreground">
                Latest Blogs
            </h1>

            {/* 🔎 Search Bar */}
            <div className="flex justify-center mb-10">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    placeholder="Search blogs..."
                    className="w-full max-w-md px-4 py-2 border border-foreground/50 rounded-lg 
            focus:ring-2 focus:ring-foreground focus:outline-none 
            text-foreground placeholder-foreground/60"
                />
            </div>

            {/* 📚 Blog Cards */}
            {filteredBlogs.length === 0 ? (
                <p className="text-center text-foreground/70">No blogs found.</p>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentBlogs.map((blog) => (
                            <div
                                key={blog._id}
                                className="rounded-2xl border border-foreground/20 shadow-sm 
                  hover:shadow-lg transition-transform transform hover:-translate-y-1 overflow-hidden flex flex-col"
                            >
                                <img
                                    src={blog.coverImage}
                                    alt={blog.title}
                                    className="h-56 w-full object-cover"
                                />
                                <div className="p-5 flex flex-col flex-grow">
                                    <h2 className="text-lg font-semibold text-foreground mb-6 line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <div className="mt-auto">
                                        <button
                                            onClick={() => readMoreHandler(blog)}
                                            className="inline-block px-5 py-2 rounded-lg bg-foreground 
                        text-white hover:bg-foreground/80 transition font-medium text-sm"
                                        >
                                            Read More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/*  Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10 gap-2 flex-wrap">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setCurrentPage(num)}
                                    className={`px-4 py-2 rounded-lg font-medium transition ${num === currentPage
                                        ? "bg-foreground text-white"
                                        : "bg-foreground/10 text-foreground hover:bg-foreground/20"
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
