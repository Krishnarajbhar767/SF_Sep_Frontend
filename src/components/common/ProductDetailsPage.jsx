import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/apiConnector";
import ProductImageGallery from "./product details/ProductImageGallery";
import ProductInfo from "./product details/ProductInfo";
import ProductFeatures from "./product details/ProductFeatures";
import CareInstructions from "./product details/CareInstructions";
import StylingTips from "./product details/StylingTips";
import DeliveryTimeline from "./product details/DeliveryTimeline";
import SuggestedProducts from "./product details/SuggestedProducts";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";
import slugify from "slugify";
import { useEffect, useRef } from "react";
// Loading Skeleton component
const ProductDetailsSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse p-8">
        <div className="flex gap-4">
            <div className="hidden md:block w-20 space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-200 rounded" />
                ))}
            </div>
            <div className="flex-1">
                <div className="aspect-square bg-gray-200 rounded" />
            </div>
        </div>
        <div className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
        </div>
    </div>
);

// Breadcrumb Navigation
const Breadcrumb = ({ product }) => (
    <nav className="hidden sm:flex text-sm space-x-2 text-foreground mb-6 capitalize">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link
            to={`/products/${slugify(product.category.name, { lower: true })}/${
                product.category._id
            }`}
        >
            {product.category.name}
        </Link>
        <span>/</span>
        <span className="font-medium">{product.name}</span>
    </nav>
);

function ProductDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.user);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomedImage, setZoomedImage] = useState("");

    const productQuery = useQuery({
        queryKey: ["product", id],
        queryFn: () =>
            axiosInstance.get(`/products/${id}`).then((res) => res.data.data),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const handleAddToCart = async (prod) => {
        if (product.stock < 1) {
            toast("Currenlty This Product Not Available ");
            return;
        }

        if (user) {
            try {
                const res = await axiosInstance.post("/user/cart/add", {
                    product: prod._id,
                    quantity: prod.quantity,
                    finalPrice: prod.finalPrice,
                    addons: prod.addons,
                    totalPrice: prod.finalPrice * prod.quantity,
                    userId: user._id,
                });
                dispatch(setCart(res.data));
            } catch {
                toast.error("Failed to sync cart. Offline copy retained.");
            }
        }
        toast.success("Added to cart");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: productQuery.data.name,
                text: productQuery.data.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied!");
        }
    };

    if (productQuery.isError) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="p-8 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-red-500" />
                    <h3 className="text-xl font-semibold mb-2">Error!</h3>
                    <p>{productQuery.error.message}</p>
                </div>
            </main>
        );
    }

    if (productQuery.isLoading) {
        return (
            <main className="min-h-screen bg-white p-8">
                <ProductDetailsSkeleton />
            </main>
        );
    }

    const product = productQuery.data;
    // const relatedProducts = relatedQuery.data ?? [];

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Breadcrumb product={product} />

                <div className="bg-white rounded-lg overflow-hidden p-1 mb-8 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4">
                        <ProductImageGallery
                            images={product.images}
                            productName={product.name}
                            stock={product.stock}
                            product={product}
                        />
                        <ProductInfo
                            product={product}
                            onAddToCart={handleAddToCart}
                            onShare={handleShare}
                        />
                    </div>
                </div>

                <ProductFeatures product={product} />
                <CareInstructions />
                {/* <SuggestedProducts products={relatedProducts} /> */}
                <StylingTips />
                <DeliveryTimeline />

                {isZoomed && (
                    <ZoomModal
                        image={zoomedImage}
                        name={product.name}
                        onClose={() => setIsZoomed(false)}
                    />
                )}
            </div>
        </main>
    );
}

export default ProductDetailsPage;
