import { useState, useEffect } from "react";
import BlogTable from "./BlogTable";
import BlogForm from "./BlogForm";
import Loader from "../../../components/common/Loader";
import axiosInstance from "../../../utils/apiConnector";

export default function BlogDashboard() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get("/blogs");
            setBlogs(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (blogData) => {
        try {
            if (editingBlog) {
                await axiosInstance.put(`/blogs/${editingBlog._id}`, blogData);
            } else {
                await axiosInstance.post("/blogs", blogData);
            }
            setShowForm(false);
            setEditingBlog(null);
            fetchBlogs();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        try {
            await axiosInstance.delete(`/blogs/${id}`);
            fetchBlogs();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setShowForm(true);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    // Filter blogs by searchQuery (case-insensitive, multi-word support)
    const filteredBlogs = blogs.filter((blog) =>
        searchQuery
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .every((word) => blog.title.toLowerCase().includes(word))
    );

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Admin Blog Dashboard</h1>

            {/* Search bar */}
            <input
                type="text"
                placeholder="Search blogs by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded"
            />

            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 text-white rounded bg-gray-900 hover:bg-gray-800 ml-4"
                >
                    Add New Blog
                </button>
            )}

            {showForm && (
                <BlogForm
                    onSubmit={handleCreate}
                    initialData={editingBlog}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingBlog(null);
                    }}
                />
            )}

            {loading ? (
                <Loader />
            ) : (
                <BlogTable blogs={filteredBlogs} onEdit={handleEdit} onDelete={handleDelete} />
            )}
        </div>
    );
}
