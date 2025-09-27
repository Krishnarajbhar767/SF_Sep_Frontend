// HomeSection8Editor.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../../../../utils/apiConnector";
import uploadMedia from "../../../../utils/uploadMedia";

const API_BASE = "home/section8";

export default function HomeSection8Editor() {
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
            let imageUrl = doc.image;

            if (file) {
                const uploaded = await uploadMedia([file], { name: "homeSection8" });
                if (uploaded && uploaded.length > 0) {
                    imageUrl = uploaded[0];
                }
            }

            await axiosInstance.patch(API_BASE, { ...doc, image: imageUrl });
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
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit - Section 8</h1>

            {["heading", "subHeading", "title", "paragraph", "btnText", "btnUrl"].map((field) => (
                <div key={field} className="mb-4">
                    <label className="block mb-1 font-medium capitalize">{field}</label>
                    <input
                        type="text"
                        value={doc[field]}
                        onChange={(e) => setDoc({ ...doc, [field]: e.target.value })}
                        className="border p-2 w-full rounded"
                    />
                </div>
            ))}

            <div className="mb-4">
                {doc.image && (
                    <img src={doc.image} alt="section8" className="w-40 h-28 object-cover mb-2 rounded" />
                )}
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="py-1 px-2 border-gray-700 border bg-gray-200 hover:bg-gray-300 rounded-sm" />
            </div>

            <button
                onClick={handleSave}
                className="btn-gray text-white px-6 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
}
