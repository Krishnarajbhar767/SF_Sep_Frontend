import { useState, useEffect } from "react";
import axiosInstance from "../../../../utils/apiConnector";
import uploadMedia from "../../../../utils/uploadMedia";

const API_BASE = "home/section6";

export default function HomeSection6Editor() {
    const [doc, setDoc] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch document
    const fetchDocument = async () => {
        try {
            const { data } = await axiosInstance.get(API_BASE);
            setDoc(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, []);

    const handleSave = async () => {
        try {
            setLoading(true);
            let imageUrl = doc?.image;

            // Upload new image if selected
            if (file) {
                const uploaded = await uploadMedia([file], { name: "homeSection6" });
                if (uploaded && uploaded.length > 0) {
                    imageUrl = uploaded[0];
                }
            }

            await axiosInstance.patch(API_BASE, {
                image: imageUrl,
                slug: doc.slug
            });

            setFile(null);
            fetchDocument();
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    if (!doc) return <p>Loading...</p>;

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Home - Section 6</h1>

            {doc.image && (
                <img src={doc.image} alt="section6" className="w-40 h-28 object-cover mb-3 rounded" />
            )}

            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}

                className="mb-4 py-1 px-2 border-gray-700 border bg-gray-200 hover:bg-gray-300 rounded-sm"
            />

            <label className="block mb-1 font-medium">Slug</label>
            <input
                type="text"
                value={doc.slug}
                onChange={(e) => setDoc({ ...doc, slug: e.target.value })}
                className="border p-2 w-full rounded mb-4"
                placeholder="Enter slug"
            />

            <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-6 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
