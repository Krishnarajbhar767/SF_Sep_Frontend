


//  2 Aug Code 


import { useForm } from "react-hook-form";
import { FiImage, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import InputField from "../../../components/common/InputField";
import SelectField from "../../../components/common/SelectField";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import uploadMedia from "../../../utils/uploadMedia";
import productApis from "../../../services/api/admin/product/product.api";
import { setProducts } from "../../../redux/slices/productSlice";
import { handleAxiosError } from "../../../utils/handleAxiosError";
import { useOffer } from "../../../hooks/useOffer";

const EditProduct = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const fabrics = useSelector((sc) => sc.fabrics);
    const { products } = useSelector((state) => state.product);
    const categories = useSelector((state) => state.category.categories || []);
    const product = products?.find((p) => p._id === id);
    const offers = useOffer();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm();

    const [originalImages, setOriginalImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [initialData, setInitialData] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const watchedFields = watch();
    const dispatch = useDispatch();

    // Initialize form and previews
    useEffect(() => {
        if (product) {
            const init = {
                name: product?.name,
                description: product?.description,
                price: product?.price,
                stock: product?.stock,
                category: product?.category?._id || product?.category,
                fabric: product?.fabric?._id,
                technique: product?.technique,
                color: product?.color,
                weight: product?.weight,
                assurance: product?.assurance,
                hsnCode: product?.hsnCode,
                isOfferAplied: product?.isOfferAplied,
                offerDiscount: product?.offerDiscount,
            };
            reset(init);
            setInitialData(init);
            const orig = Array.isArray(product.images) ? product?.images : [];
            setOriginalImages(orig);
            setImagePreviews(orig);
        }
    }, [product, reset]);

    // Handle new file uploads
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setImageFiles((prev) => [...prev, ...files]);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...previews]);
    };

    // Remove image (existing or new)
    const handleRemoveImage = (index) => {
        // Always remove preview
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));

        if (index < originalImages.length) {
            // Removing an original URL
            setOriginalImages((prev) => prev.filter((_, i) => i !== index));
        } else {
            // Removing a newly added file
            const fileIndex = index - originalImages.length;
            setImageFiles((prev) => prev.filter((_, i) => i !== fileIndex));
        }
    };

    // Detect changes
    const isFormChanged = () => {
        if (!initialData) return false;
        for (let key in initialData) {
            if (String(watchedFields[key]) !== String(initialData[key])) {
                return true;
            }
        }
        if (imageFiles.length > 0) return true;
        if (originalImages?.length !== (product?.images?.length || 0))
            return true;
        return false;
    };

    // Submit handler
    const onSubmit = async (data) => {
        if (!isFormChanged()) {
            toast.error("No changes detected.");
            return;
        }
        setIsSubmitting(true);
        const toastId = toast.loading("Please wait...");
        try {
            let uploadedUrls = [];
            if (imageFiles.length > 0) {
                uploadedUrls = await uploadMedia(imageFiles, data);
            }
            const newUrls = Array.isArray(uploadedUrls)
                ? uploadedUrls
                : [uploadedUrls];
            const finalImages = [...originalImages, ...newUrls];
            const updatedData = { ...data, images: finalImages };

            const updatedProducts = await productApis.updateProduct(
                updatedData,
                id
            );
            dispatch(setProducts(updatedProducts));
            toast.success("Product updated successfully");
            navigate(-1);
        } catch (error) {
            handleAxiosError(error);
        } finally {
            toast.dismiss(toastId);
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => navigate(-1);

    if (!product) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 text-sm">Product not found.</p>
            </div>
        );
    }


    console.log("Offer Discount Value:", product?.offerDiscount, typeof product?.offerDiscount);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 p-4 sm:p-6 max-w-2xl mx-auto"
        >
            <h3 className="text-lg font-semibold uppercase text-gray-800 mb-4 tracking-wide">
                Edit Product
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Core Fields */}
                <InputField
                    label="Name"
                    name="name"
                    register={register}
                    errors={errors}
                    rules={{ required: "Product name is required" }}
                />
                <InputField
                    label="Description"
                    name="description"
                    register={register}
                    errors={errors}
                    rules={{ required: "Description is required" }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        label="Price"
                        name="price"
                        type="number"
                        register={register}
                        errors={errors}
                        rules={{
                            required: "Price is required",
                            min: { value: 0, message: "Must be positive" },
                        }}
                    />
                    <InputField
                        label="Stock"
                        name="stock"
                        type="number"
                        register={register}
                        errors={errors}
                        rules={{
                            required: "Stock is required",
                            min: { value: 0, message: "Must be positive" },
                        }}
                    />
                </div>

                <SelectField
                    label="Category"
                    name="category"
                    register={register}
                    errors={errors}
                    value={product?.category}
                    rules={{ required: "Category is required" }}
                    options={categories?.map((cat) => ({
                        value: cat._id || cat.value,
                        label: cat.name || cat.label,
                    }))}
                />

                {/* Image Upload with Remove */}
                <div>
                    <label className="block text-sm text-gray-600 mb-1 flex items-center gap-2">
                        <FiImage size={16} /> Images
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-800"
                    />
                    {imagePreviews.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                            {imagePreviews?.map((src, i) => (
                                <div key={i} className="relative w-16 h-16">
                                    <img
                                        src={src}
                                        alt={`${i}`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(i)}
                                        className="absolute top-0 right-0 bg-white rounded-full p-0.5 shadow-md"
                                    >
                                        <FiX size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Additional Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField
                        label="Fabric"
                        name="fabric"
                        register={register}
                        errors={errors}
                        rules={{ required: "Fabric is required" }}
                        options={fabrics?.map((cat) => ({
                            value: cat._id || cat.value,
                            label: cat.title || cat.label,
                        }))}
                        value={product.fabric}
                    />

                    <InputField
                        label="Technique"
                        name="technique"
                        register={register}
                        errors={errors}
                        rules={{ required: "Technique is required" }}
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField
                        label="Color"
                        name="color"
                        register={register}
                        errors={errors}
                        rules={{ required: "Color is required" }}
                    />
                    <InputField
                        label="Weight"
                        name="weight"
                        register={register}
                        errors={errors}
                        rules={{ required: "Weight is required" }}
                    />
                </div>
                <InputField
                    label="Assurance"
                    name="assurance"
                    register={register}
                    errors={errors}
                    rules={{ required: "Assurance is required" }}
                />
                <InputField
                    label="HSN Code"
                    name="hsnCode"
                    register={register}
                    errors={errors}
                    rules={{
                        required: "HSN Code is required",
                        pattern: {
                            value: /^[0-9]+$/,
                            message: "HSN Code must contain only numbers",
                        },
                    }}
                />

                {/* <SelectField
                    label="Offer Discount"
                    name="offerDiscount"
                    register={register}
                    errors={errors}
                    value={product?.offerDiscount}
                    options={[
                        { value: -1, label: "No Offer" },
                        ...offers?.map((of) => ({
                            value: of.discount,
                            label: `Discount ${of.discount}%`,
                        })),
                    ]}
                /> */}

                <SelectField
                    label="Offer Discount"
                    name="offerDiscount"
                    register={register}
                    errors={errors}
                    value={product?.offerDiscount}
                    options={[
                        
                        ...offers?.map((of) => ({
                            value: String(of.discount),
                            label: `Discount ${of.discount}%`,
                        })),

                        { value: 0, label: "No Offer" },
                    ]}
                />


                <SelectField
                    label="Offer"
                    name="isOfferAplied"
                    register={register}
                    errors={errors}
                    value={product?.isOfferAplied}
                    // rules={{ required: "Offer is required" }}
                    options={[
                        { name: "No", value: false },
                        { name: "Yes", value: true },
                    ].map((cat) => ({
                        value: cat._id || cat.value,
                        label: cat.name || cat.label,
                        disabled: cat.name == "all" ? true : false,
                    }))}
                />



                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                        className="bg-neutral-950 text-white px-4 py-2 h-12 text-sm uppercase hover:bg-gray-700 transition-colors duration-200 shadow-md w-full"
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-200 text-gray-800 px-4 py-2 text-sm uppercase hover:bg-gray-300 transition-colors duration-200 shadow-md w-full"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default EditProduct;