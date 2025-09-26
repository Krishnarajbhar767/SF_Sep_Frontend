import { useState, useEffect } from "react";
import axiosInstance from "../../../../utils/apiConnector";
import uploadMedia from "../../../../utils/uploadMedia";

const API_BASE = "home/section4"; // section4 endpoint

export default function Home3BigGridSection4Editor() {
    const [doc, setDoc] = useState(null);
    const [items, setItems] = useState([]);
    const [fileMap, setFileMap] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch document
    const fetchDocument = async () => {
        try {
            const { data } = await axiosInstance.get(API_BASE);
            setDoc(data);
            setItems(data.items || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchDocument();
    }, []);

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleFileChange = (index, file) => {
        setFileMap((prev) => ({ ...prev, [index]: file }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const newItems = [...items];

            // Upload new images
            for (let i = 0; i < newItems.length; i++) {
                if (fileMap[i]) {
                    const uploaded = await uploadMedia([fileMap[i]], {
                        name: "home3BigGridSection4",
                    });
                    if (uploaded && uploaded.length > 0) {
                        newItems[i].image = uploaded[0];
                    }
                }
            }

            await axiosInstance.patch(API_BASE, {
                heading: doc.heading,
                subHeading: doc.subHeading,
                items: newItems,
            });

            setFileMap({});
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
            <h1 className="text-2xl font-bold mb-4">Edit Home 3 Big Grid - Section 4</h1>

            <label className="block mb-1 font-medium">Heading</label>
            <input
                type="text"
                value={doc.heading}
                onChange={(e) => setDoc({ ...doc, heading: e.target.value })}
                className="border p-2 w-full mb-4 rounded"
            />

            <label className="block mb-1 font-medium">Sub Heading</label>
            <input
                type="text"
                value={doc.subHeading}
                onChange={(e) => setDoc({ ...doc, subHeading: e.target.value })}
                className="border p-2 w-full mb-4 rounded"
            />

            <h2 className="text-xl font-semibold mb-2">Items (Max 2)</h2>
            {items.map((item, index) => (
                <div key={index} className="mb-4 border p-3 rounded">
                    {item.image && (
                        <img
                            src={item.image}
                            alt="item"
                            className="w-32 h-20 object-cover mb-2 rounded"
                        />
                    )}
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(index, e.target.files[0])}


                        className="mb-2 py-1 px-2 border-gray-700 border bg-gray-200 hover:bg-gray-300 rounded-sm"
                    />

                    <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleItemChange(index, "title", e.target.value)}
                        className="border p-2 w-full rounded mb-2"
                        placeholder="Item Title"
                    />

                    <input
                        type="text"
                        value={item.slug}
                        onChange={(e) => handleItemChange(index, "slug", e.target.value)}
                        className="border p-2 w-full rounded mb-2"
                        placeholder="Item Slug"
                    />
                </div>
            ))}

            <div>
                <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-6 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}
