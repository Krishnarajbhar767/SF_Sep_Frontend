import { useState, useEffect } from "react";
import axiosInstance from "../../../../utils/apiConnector";
import uploadMedia from "../../../../utils/uploadMedia";

const API_BASE = "home/slider";   // backend for sliders
const UPLOAD_API = "upload";      // your image upload route

export default function Slider() {
    const [sliders, setSliders] = useState([]);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        id: "",
        heading: "",
        paragraph: "",
        slug: "",
        top: false,
        image: ""
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Fetch all sliders
    const fetchSliders = async () => {
        try {
            const { data } = await axiosInstance.get(API_BASE);
            setSliders(data);
        } catch (err) {
            console.error("Error fetching sliders", err);
        }
    };

    useEffect(() => {
        fetchSliders();
    }, []);

    // Open edit modal
    const handleEdit = (slider) => {
        setEditing(slider._id);
        setFormData({
            id: slider._id,
            heading: slider.heading,
            paragraph: slider.paragraph,
            slug: slider.slug,
            top: slider.top,
            image: slider.image
        });
        setFile(null);
    };

    // Update form fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Save updated slider
    const handleSave = async () => {
        try {
            let imageUrl = formData.image;

            // If new file selected → upload first
            if (file) {
                setUploading(true);
                const uploadData = new FormData();
                uploadData.append("files", file);

                const [data] = await uploadMedia(uploadData)
                console.log('Image Upload Data  =>', data)
                imageUrl = data; // assume backend returns { url: "..." }
                setUploading(false);
            }

            await axiosInstance.put(API_BASE, {
                id: formData.id,
                heading: formData.heading,
                paragraph: formData.paragraph,
                slug: formData.slug,
                top: formData.top,
                image: imageUrl
            });

            setEditing(null);
            setFile(null);
            fetchSliders();
        } catch (err) {
            console.error("Error updating slider", err);
            setUploading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Sliders</h1>

            {/* Sliders List */}
            <div className="grid gap-4">
                {sliders.map((slider, idx) => (
                    <div key={slider._id} className="border rounded p-4 shadow relative">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center absolute -left-3 -top-3 font-semibold z-10">{idx + 1}</div>
                        <img
                            src={slider.image}
                            alt={slider.heading}
                            className="w-32 h-20 object-cover rounded mb-2"
                        />
                        <h2 className="text-lg font-semibold">{slider.heading}</h2>
                        <p className="text-sm">{slider.paragraph}</p>
                        <p className="text-xs text-gray-500">Slug: {slider.slug}</p>
                        <p className="text-xs">Top: {slider.top ? "✅ Yes" : "❌ No"}</p>
                        <button
                            className="mt-2 px-3 py-1 btn-gray text-white rounded"
                            onClick={() => handleEdit(slider)}
                        >
                            Edit
                        </button>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold mb-6">Edit Slider</h2>

                        {/* Heading */}
                        <label className="block text-sm font-medium mb-1">Heading</label>
                        <input
                            type="text"
                            name="heading"
                            value={formData.heading}
                            onChange={handleChange}
                            placeholder="Heading"
                            className="border p-2 mb-4 w-full rounded"
                        />

                        {/* Paragraph */}
                        <label className="block text-sm font-medium mb-1">Paragraph</label>
                        <textarea
                            name="paragraph"
                            value={formData.paragraph}
                            onChange={handleChange}
                            placeholder="Paragraph"
                            className="border p-2 mb-4 w-full rounded resize-none min-h-[80px]"
                        />

                        {/* Slug */}
                        <label className="block text-sm font-medium mb-1">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="Slug"
                            className="border p-2 mb-4 w-full rounded"
                        />

                        {/* Current Image */}
                        {formData.image && (
                            <div className="mb-4">
                                <p className="text-sm font-medium mb-1">Current Image</p>
                                <img
                                    src={formData.image}
                                    alt="Current"
                                    className="w-full h-40 object-cover rounded"
                                />
                            </div>
                        )}

                        {/* File Upload */}
                        <label className="block text-sm font-medium mb-1">Upload New Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="py-1 px-2 border-gray-700 border bg-gray-200 hover:bg-gray-300 rounded-sm"
                        />

                        {/* Top Checkbox */}
                        <label className="flex items-center mb-6">
                            <input
                                type="checkbox"
                                name="top"
                                checked={formData.top}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Show on Top
                        </label>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={() => setEditing(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className=" text-white px-6 py-2 rounded btn-gray"
                                onClick={handleSave}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
