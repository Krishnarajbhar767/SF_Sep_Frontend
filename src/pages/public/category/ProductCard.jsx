
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Img } from "react-image";
import { useOffer } from "../../../hooks/useOffer";
// import ProductImage from "./ProductImage.jsx"; // Assuming ProductImage is a separate component


const ProductCard = React.memo(({ product, viewMode, navigate }) => {
    const offer = useOffer(product._id); // fetched once per session

    const [isOfferAplied, setIsOfferAplied] = useState(product.isOfferAplied);
    const basePrice = product?.price || 0;


    // Apply discount only to base price
    const discountedBase =
        offer && isOfferAplied ? basePrice * (1 - offer / 100) : basePrice;
    // const finalPrice = Math.round(discountedBase + addonPrice);
    // const totalBefore = Math.round(basePrice + addonPrice);

    // console.log("Final Price:", finalPrice);

    // console.log("Rendering ProductCard for", product.name);

    if (!product) return null; // Handle case where product is undefined
    // const ProductCard = ({ product, viewMode, navigate }) => {
    const containerClass = viewMode === "list" ? "flex" : "flex flex-col";
    const imageWrapperClass = viewMode === "list" ? "w-48 flex-shrink-0" : "aspect-[4/5] h-96";

    return (
        <div
            key={product._id}
            className={`capitalize group cursor-pointer bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden h-full ${containerClass}`}
        >
            {/* Product Image */}
            <div className={`relative overflow-hidden bg-gray-50 ${imageWrapperClass}`}>

                <CachedImage
                    src={product?.images?.[0] || "/default-image.png"}
                    alt={product?.name || "Product Image"}
                    product={product}
                    offer={offer}
                    isOfferAplied={isOfferAplied}
                // className="w-full h-full object-cover"
                />

                {/* <ProductImageLazy src={product.images?.[0]} alt={product.name} _id={product._id} /> */}

                {product.stock === 0 ? (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                        Out of Stock
                    </span>
                ) : product.stock > 0 && product.stock < 10 ? (
                    <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                        Only {product.stock} left
                    </span>
                ) : null}




            </div>

            {/* Product Info */}
            <div className="p-4 flex flex-col flex-1 space-y-3">
                <h3
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-foreground transition-colors cursor-pointer"
                >
                    {product.name}
                </h3>
                <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
                    {product.description || "Premium quality product with excellent craftsmanship."}
                </p>

                {/* Price */}

                {/*<p className="text-xl font-bold text-foreground">₹{product.price?.toLocaleString() || "N/A"}</p>
                        {product.originalPrice > product.price && (
                            <p className="text-sm text-foreground line-through">₹{product.originalPrice.toLocaleString()}</p>
                        )} */}


                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <p className="text-lg font-bold text-foreground">
                            ₹{Math.round(discountedBase)}{""}
                            {offer && isOfferAplied && (
                                <span className="text-sm text-green-600 font-medium ml-2">
                                    <span className="line-through mr-1 text-gray-500">₹{basePrice}</span>
                                    ({offer}% OFF)
                                </span>
                            )}
                        </p>
                    </div>



                    <p className="text-sm text-foreground">Stock: {product.stock || "N/A"}</p>
                </div>

                {/* Attributes */}
                <div className="grid grid-cols-3 gap-2 text-xs text-foreground bg-gray-50 p-3 rounded-lg">
                    <div><span className="font-medium">Fabric:</span> {product.fabric?.title || "N/A"}</div>
                    <div><span className="font-medium capitalize">Color:</span> {product.color || "N/A"}</div>
                </div>

                {/* View Button */}
                <Link
                    to={`/product/${product._id}`}
                    className="mt-auto block w-full text-center bg-foreground text-white py-3 px-4 rounded-lg hover:bg-foreground/90 transition-colors duration-200 font-medium"
                >
                    View Details
                </Link>
            </div>
        </div >
    );
});


export default ProductCard;



//     const [loaded, setLoaded] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         // Mark image loaded if browser already has it cached
//         const img = new Image();
//         img.src = src;
//         if (img.complete) {
//             setLoaded(true);
//         } else {
//             img.onload = () => setLoaded(true);
//         }
//     }, [src]);

//     return (
//         <div className="relative w-full h-full cursor-pointer">
//             {/* Skeleton loader */}
//             {!loaded && (
//                 <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse z-10" />
//             )}

//             <img
//                 loading="lazy"
//                 src={src}
//                 alt={alt}
//                 onClick={() => navigate(`/product/${_id}`)}
//                 className={`w-full h-full object-cover object-top transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
//                     }`}
//             />
//         </div>
//     );
// });



const CachedImage = ({ src, alt, product, offer, isOfferAplied }) => {
    const storageKey = `cachedImage_${src}`;
    const [imageSrc, setImageSrc] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const cachedData = localStorage.getItem(storageKey);
        const cacheTime = localStorage.getItem(`${storageKey}_time`);
        const now = Date.now();

        // If cached and not expired (2 days = 172800000 ms)
        if (cachedData && cacheTime && now - parseInt(cacheTime) < 172800000) {
            setImageSrc(cachedData);
        } else {
            fetch(src)
                .then(res => res.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64data = reader.result;
                        localStorage.setItem(storageKey, base64data);
                        localStorage.setItem(`${storageKey}_time`, now.toString());
                        setImageSrc(base64data);
                    };
                    reader.readAsDataURL(blob);
                })
                .catch(err => console.error("Image load error:", err));
        }
    }, [src]);

    return (
        <div className="relative w-full h-full cursor-pointer">


            <img
                src={imageSrc || src}
                alt={alt}
                loading="lazy"
                className="w-full h-full object-cover transition-opacity duration-500"
                onClick={() => navigate(`/product/${product._id}`)}
            />


            {offer && isOfferAplied && (
                <div className="absolute top-4 right-[-40px] rotate-45 bg-orange-500 text-white px-10 py-1 shadow-md">
                    {offer}% OFF
                </div>
            )}





        </div>

    );
};


