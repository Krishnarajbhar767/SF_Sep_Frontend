import { useState, useEffect } from "react";
import axiosInstance from "../../../../utils/apiConnector";
import uploadMedia from "../../../../utils/uploadMedia";

const API_BASE = "home/section7";

export default function HomeSection7Editor() {
    const [docs, setDocs] = useState([]);
    const [fileMap, setFileMap] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch existing documents
    const fetchDocuments = async () => {
        try {
            const { data } = await axiosInstance.get(API_BASE);
            setDocs(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFieldChange = (index, field, value) => {
        const newDocs = [...docs];
        newDocs[index][field] = value;
        setDocs(newDocs);
    };

    const handleFileChange = (index, file) => {
        setFileMap(prev => ({ ...prev, [index]: file }));
    };

    const handleSave = async (index) => {
        try {
            setLoading(true);
            let updatedDoc = { ...docs[index] };

            // Upload new image if chosen
            if (fileMap[index]) {
                const uploaded = await uploadMedia([fileMap[index]], { name: "homeSection7" });
                if (uploaded && uploaded.length > 0) {
                    updatedDoc.image = uploaded[0];
                }
            }

            if (updatedDoc._id) {
                // Update existing
                await axiosInstance.patch(API_BASE, { ...updatedDoc, id: updatedDoc._id });
            } else {
                // Create new
                await axiosInstance.post(API_BASE, updatedDoc);
            }

            setFileMap({});
            fetchDocuments();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Edit Home Section 7</h1>

            {docs.map((doc, index) => (
                <div key={doc._id || index} className="mb-6 border p-4 rounded shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">Card {index + 1}</h2>

                    {doc.image && <img src={doc.image} alt="section7" className="w-32 h-20 mb-2 rounded" />}
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                        className="py-1 px-2 border-gray-700 border bg-gray-200 hover:bg-gray-300 rounded-sm mb-2"
                    />

                    <input
                        type="text"
                        value={doc.heading}
                        onChange={(e) => handleFieldChange(index, "heading", e.target.value)}
                        className="border p-2 w-full rounded mb-2"
                        placeholder="Heading"
                    />

                    <textarea
                        value={doc.paragraph}
                        onChange={(e) => handleFieldChange(index, "paragraph", e.target.value)}
                        className="border p-2 w-full rounded mb-2"
                        placeholder="Paragraph"
                    />

                    <input
                        type="text"
                        value={doc.slugText}
                        onChange={(e) => handleFieldChange(index, "slugText", e.target.value)}
                        className="border p-2 w-full rounded mb-2"
                        placeholder="Slug Text"
                    />

                    <input
                        type="text"
                        value={doc.slug}
                        onChange={(e) => handleFieldChange(index, "slug", e.target.value)}
                        className="border p-2 w-full rounded mb-2"
                        placeholder="Slug"
                    />

                    <button
                        onClick={() => handleSave(index)}
                        className="btn-gray text-white px-6 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            ))}

            {/* Allow creating new only if < 2 docs */}
            {docs.length < 2 && (
                <button
                    onClick={() =>
                        setDocs([...docs, { heading: "", paragraph: "", slugText: "", slug: "", image: "" }])
                    }
                    className="btn-gray text-white px-6 py-2 rounded"
                >
                    Add New Card
                </button>
            )}
        </div>
    );
}
