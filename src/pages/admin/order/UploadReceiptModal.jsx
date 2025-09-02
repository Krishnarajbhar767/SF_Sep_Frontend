// import React, { useState, useRef } from "react";
// import { FiX, FiUploadCloud } from "react-icons/fi";
// import axiosInstance from "../../../utils/apiConnector";
// import uploadMedia from "../../../utils/uploadMedia";
// import { handleAxiosError } from "../../../utils/handleAxiosError";

// const UploadReceiptModal = ({ isOpen, onClose, orderId }) => {
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [previewUrl, setPreviewUrl] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const fileInputRef = useRef(null);

//     // Exit early if modal is not open
//     if (!isOpen) return null;

//     // Handle file selection from input or drop
//     const handleFileSelect = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setSelectedFile(file);

//             // If it's an image, generate a preview URL
//             if (file.type.startsWith("image/")) {
//                 const imageUrl = URL.createObjectURL(file);
//                 setPreviewUrl(imageUrl);
//             } else {
//                 setPreviewUrl(null); // clear if not image
//             }
//         }
//     };

//     // Handle drag & drop file upload
//     const handleDrop = (e) => {
//         e.preventDefault();
//         const file = e.dataTransfer.files[0];
//         if (file) {
//             setSelectedFile(file);

//             if (file.type.startsWith("image/")) {
//                 const imageUrl = URL.createObjectURL(file);
//                 setPreviewUrl(imageUrl);
//             } else {
//                 setPreviewUrl(null);
//             }
//         }
//     };

//     // Simulate file upload (replace with actual upload logic)
//     const handleUpload = async () => {
//         if (!selectedFile) return;
//         setUploading(true);

//         try {
//             const res = await uploadMedia([selectedFile]);
//             const imageUrl = res[0];
//             // Now Call Upload Receipt APi
//             const apiRes = await axiosInstance.post(
//                 "/admin/orders/updateDelhiveryReceipt",
//                 { delhiveryReceipt: imageUrl, orderId }
//             );
//             if (apiRes) {
//                 setSelectedFile(null);
//                 setPreviewUrl(null);
//                 onClose();
//             }
//         } catch (err) {
//             console.log(err);
//             handleAxiosError(error);
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div
//             className="fixed inset-0 z-50 flex items-center justify-center glass h-full bg-opacity-50 backdrop-blur-sm transition-all"
//             onClick={onClose}
//         >
//             <div
//                 className="relative bg-white w-[90%] sm:w-[500px] max-w-[95%] rounded-lg shadow-xl p-6"
//                 onClick={(e) => e.stopPropagation()} // prevent modal close on click inside
//             >
//                 {/* Close Button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
//                 >
//                     <FiX size={20} />
//                 </button>

//                 {/* Header */}
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">
//                     Upload Delhivery Receipt
//                 </h2>

//                 {/* Upload area (clickable & droppable) */}
//                 <div
//                     className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
//                     onClick={() => fileInputRef.current.click()}
//                     onDrop={handleDrop}
//                     onDragOver={(e) => e.preventDefault()}
//                 >
//                     {/* Icon */}
//                     <FiUploadCloud className="mx-auto text-4xl text-blue-500 mb-2" />

//                     {/* Instructions */}
//                     <p className="text-gray-600 text-sm">
//                         Drag & drop a file here or{" "}
//                         <span className="text-blue-600 underline">
//                             click to browse
//                         </span>
//                     </p>

//                     {/* Preview */}
//                     {selectedFile && previewUrl && (
//                         <div className="mt-4">
//                             <img
//                                 src={previewUrl}
//                                 alt="Preview"
//                                 className="mx-auto max-h-48 rounded shadow"
//                             />
//                             <p className="text-xs text-gray-500 mt-1">
//                                 {selectedFile.name}
//                             </p>
//                         </div>
//                     )}

//                     {/* Show filename if PDF */}
//                     {selectedFile && !previewUrl && (
//                         <p className="mt-3 text-sm text-green-600 font-medium">
//                             Selected: {selectedFile.name}
//                         </p>
//                     )}

//                     {/* Hidden input */}
//                     <input
//                         type="file"
//                         accept="application/pdf,image/*"
//                         ref={fileInputRef}
//                         onChange={handleFileSelect}
//                         className="hidden"
//                     />
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-end gap-3 mt-6">
//                     <button
//                         onClick={onClose}
//                         className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
//                         disabled={uploading}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleUpload}
//                         disabled={!selectedFile || uploading}
//                         className={`px-4 py-2 text-sm text-white rounded ${
//                             selectedFile && !uploading
//                                 ? "bg-gray-900 hover:bg-blue-700"
//                                 : "bg-gray-400 cursor-not-allowed"
//                         }`}
//                     >
//                         {uploading ? "Uploading..." : "Upload"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default UploadReceiptModal;






/// 6 Aug 

import React, { useState, useRef } from "react";
import { FiX, FiUploadCloud } from "react-icons/fi";
import axiosInstance from "../../../utils/apiConnector";
import uploadMedia from "../../../utils/uploadMedia";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import InputField from "../../../components/common/InputField";
import { useForm } from "react-hook-form";

const UploadReceiptModal = ({ isOpen, onClose, orderId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    // Exit early if modal is not open
    if (!isOpen) return null;

    // Handle file selection from input or drop
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            // If it's an image, generate a preview URL
            if (file.type.startsWith("image/")) {
                const imageUrl = URL.createObjectURL(file);
                setPreviewUrl(imageUrl);
            } else {
                setPreviewUrl(null); // clear if not image
            }
        }
    };

    // Handle drag & drop file upload
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);

            if (file.type.startsWith("image/")) {
                const imageUrl = URL.createObjectURL(file);
                setPreviewUrl(imageUrl);
            } else {
                setPreviewUrl(null);
            }
        }
    };

    // Simulate file upload (replace with actual upload logic)
    const handleUpload = async (formData) => {
        if (!selectedFile) return;
        setUploading(true);
        // console.log("Receipt Form Data", formData);
        try {
            const res = await uploadMedia([selectedFile], {
                name: "order_reciept",
            });

            console.log("Receipt Image URL", res);
            console.log("Receipt Form Data........", formData);

            //             Receipt Form Data........ 

            // {trackingId: '12345', parcelWeight: '200gm', deliveryPartner: 'Blue Dart'}
            // deliveryPartner
            // : 
            // "Blue Dart"
            // parcelWeight
            // : 
            // "200gm"
            // trackingId
            // : 
            // "12345"


            // If single upload
            const imageUrl = res.secure_url || res[0];

            // Now Call Upload Receipt APi
            // const apiRes = await axiosInstance.post(
            //     "/admin/orders/updateDelhiveryReceipt",
            //     {
            //         delhiveryReceipt: imageUrl,
            //         orderId,
            //         trackingId: formData?.trackingId,
            //         parcelWeight: formData?.parcelWeight,
            //         deliveryPartner: formData?.deliveryPartner,
            //     }
            // );

            const apiRes = await axiosInstance.post(
                "/admin/orders/updateDelhiveryReceipt",
                { delhiveryReceipt: imageUrl, orderId, ...formData }
            );

            console.log("Receipt Upload Response", apiRes);
            if (apiRes) {
                setSelectedFile(null);
                setPreviewUrl(null);
                onClose();
            }
        } catch (err) {
            handleAxiosError(err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center glass h-full bg-opacity-50 backdrop-blur-sm transition-all overflow-hidden"
            onClick={onClose}
        >
            <div
                className="h-[95%] overflow-y-scroll relative bg-white w-[90%] sm:w-[500px] max-w-[95%] rounded-lg shadow-xl p-6"
                onClick={(e) => e.stopPropagation()} // prevent modal close on click inside
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                    <FiX size={20} />
                </button>

                {/* Header */}
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Upload Delhivery Receipt & Other Data
                </h2>

                {/* Upload area (clickable & droppable) */}
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => fileInputRef.current.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {/* Icon */}
                    <FiUploadCloud className="mx-auto text-4xl text-blue-500 mb-2" />

                    {/* Instructions */}
                    <p className="text-gray-600 text-sm">
                        Drag & drop a file here or{" "}
                        <span className="text-blue-600 underline">
                            click to browse
                        </span>

                    </p>
                    <p>MAX 10MB</p>



                    {/* Preview */}
                    {selectedFile && previewUrl && (
                        <div className="mt-4">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="mx-auto max-h-48 rounded shadow"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {selectedFile.name}
                            </p>
                        </div>
                    )}

                    {/* Show filename if PDF */}
                    {selectedFile && !previewUrl && (
                        <p className="mt-3 text-sm text-green-600 font-medium">
                            Selected: {selectedFile.name}
                        </p>
                    )}

                    {/* Hidden input */}
                    <input
                        type="file"
                        accept="application/pdf,image/*"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
                <form className="mt-4 space-y-4">
                    <InputField
                        register={register}
                        name={"trackingId"}
                        type="text"
                        label={"Enter Tracking Id"}
                        errors={errors}
                        rules={{
                            required: "Tracking id is required*",
                        }}
                    />
                    <InputField
                        register={register}
                        name={"parcelWeight"}
                        type="text"
                        label={"Enter Parcel Weight (e.g 500gm, 1kg)"}
                        errors={errors}
                        rules={{
                            required: "Parcel Weight is required*",
                        }}
                    />
                    <InputField
                        register={register}
                        name={"deliveryPartner"}
                        type="text"
                        label={"Enter delivery partner name"}
                        errors={errors}
                        rules={{
                            required: "Delivery partner is required*",
                        }}
                    />
                </form>
                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
                        disabled={uploading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit(handleUpload)}
                        disabled={!selectedFile || uploading}
                        className={`px-4 py-2 text-sm text-white rounded ${selectedFile && !uploading
                            ? "bg-gray-900 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadReceiptModal;

