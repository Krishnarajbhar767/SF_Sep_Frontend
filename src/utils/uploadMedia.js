import axios from "axios";
import axiosInstance from "./apiConnector";
import { handleAxiosError } from "./handleAxiosError";

// import imageCompression from "browser-image-compression";

// const uploadMedia = async (files, data) => {
//     console.log("information-----------", data);

//     if (!data?.name) {
//         console.error("Image name is missing!");
//         return null;
//     }

//     const formData = new FormData();

//     for (const file of files) {
//         // Compress image before upload
//         const options = {
//             maxSizeMB: 5,               // Smaller target size
//             maxWidthOrHeight: 800,     // Reduce dimensions
//             useWebWorker: true,
//         };

//         let compressedFile = file;
//         try {
//             if (file.size > 5 * 1024 * 1024) { // Only compress if > 5MB
//                 compressedFile = await imageCompression(file, options);
//                 console.log(`Compressed ${file.name} from ${(file.size / 1024 / 1024).toFixed(5)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(5)}MB`);
//             }
//         } catch (err) {
//             console.error("Compression failed:", err);
//         }

//         formData.append("files", compressedFile);
//     }

//     formData.append("name", data.name);

//     try {
//         console.log("Uploading files...");
//         const res = await axiosInstance.post("/upload", formData, {
//             headers: { "Content-Type": "multipart/form-data" },
//         });
//         return res.data?.data;
//     } catch (err) {
//         console.error("Upload failed:", err);
//         handleAxiosError(err);
//         return null;
//     }
// };

// export default uploadMedia;







const uploadMedia = async (files, data) => {
    // console.log("information-----------", data); // undefined
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file);
    });

    formData.append("name", data.name);

    try {
        console.log("formData ------------- ", formData);
        const res = await axiosInstance.post("/upload", formData);
        return res.data?.data;
    } catch (err) {
        console.error("Upload failed:", err);
        handleAxiosError(err);
        return null;
    }
};
export default uploadMedia;




