import { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axiosInstance from "../../../utils/apiConnector";

export default function BlogForm({ onSubmit, initialData, onCancel }) {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [coverFile, setCoverFile] = useState(null);
    const [coverImage, setCoverImage] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState({});

    // Pre-fill when editing
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setSlug(initialData.slug || "");
            setCoverImage(initialData.coverImage || "");
            setContent(initialData.content || "");
            setStatus(initialData.status ?? true);
        } else {
            setTitle("");
            setSlug("");
            setCoverImage("");
            setContent("");
            setStatus(true);
        }
    }, [initialData]);

    const handleImageUpload = async () => {
        if (!coverFile) return coverImage; // Use existing image if no new file
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("files", coverFile);
            formData.append("name", title);
            const { data } = await axiosInstance.post("/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return data.data[0];
        } catch (err) {
            console.error(err);
            alert("Image upload failed");
            return "";
        } finally {
            setUploading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!title.trim()) newErrors.title = "Title is required.";
        if (!slug.trim()) newErrors.slug = "Slug is required.";
        if (!content || content.trim() === "" || content === "<p><br></p>")
            newErrors.content = "Content cannot be empty.";
        if (!coverFile && !coverImage)
            newErrors.coverImage = "Cover image is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const coverUrl = await handleImageUpload();
        if (!coverUrl) {
            setErrors({ coverImage: "Cover image upload failed." });
            return;
        }

        onSubmit({
            title: title.trim(),
            slug: slug.trim(),
            coverImage: coverUrl,
            content,
            status,
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-5 my-2 "
        >
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-3">
                {initialData ? "Edit Blog Post" : "Create New Blog Post"}
            </h2>

            {/* Title */}
            <div>
                <label className="block font-medium mb-1">Blog Title</label>
                <input
                    type="text"
                    placeholder="Enter blog title"
                    className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            {/* Slug */}
            <div>
                <label className="block font-medium mb-1">Slug</label>
                <input
                    type="text"
                    placeholder="e.g. how-to-style-rugs"
                    className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                />
                {errors.slug && <p className="text-red-500 text-sm">{errors.slug}</p>}
            </div>

            {/* Cover Image */}
            <div>
                <label className="block font-medium mb-2">Cover Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files[0])}
                    className="mb-2 border px-3 cursor-pointer rounded-sm"
                />
                {(coverFile || coverImage) && (
                    <img
                        src={coverFile ? URL.createObjectURL(coverFile) : coverImage}
                        alt="Preview"
                        className="w-40 h-28 object-cover rounded border"
                    />
                )}
                {errors.coverImage && (
                    <p className="text-red-500 text-sm">{errors.coverImage}</p>
                )}
            </div>

            {/* Status */}
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={status}
                    onChange={() => setStatus(!status)}
                />
                Published
            </label>

            {/* Content */}
            <div>
                <label className="block font-medium mb-2">Blog Content</label>
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    placeholder="Write your blog content here..."
                />
                {errors.content && (
                    <p className="text-red-500 text-sm">{errors.content}</p>
                )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded  disabled:opacity-50"
                >
                    {initialData ? "Update Blog" : "Create Blog"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-5 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
