import { useState, useEffect } from "react";
import axiosInstance from "../../../../utils/apiConnector";

const API_BASE = "home/section3";

// Single video upload helper
const uploadVideo = async (file, folderName = "homeSection3Video") => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("files", file); // single file
  formData.append("name", folderName);

  const res = await axiosInstance.post("/upload/video", formData);
  console.log('res POinse IN Frontend ', res)
  return res.data?.data; // single URL string
};

export default function HomeSection3VideoEditor() {
  const [doc, setDoc] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
      let videoUrl = doc?.video;

      if (file) {
        const uploadedUrl = await uploadVideo(file);
        if (uploadedUrl) videoUrl = uploadedUrl;
      }

      await axiosInstance.post(`${API_BASE}`, {
        heading: doc.heading,
        subHeading: doc.subHeading,
        video: videoUrl,
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
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Home Section 4 - Video</h1>

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

      <label className="block mb-1 font-medium">Video</label>
      {doc.video && (
        <video src={doc.video} controls className="w-full mb-2 rounded" />
      )}

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])} // single file only
        className="mb-4"
      />

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
