import { useEffect, useState } from "react";
import {
    ShoppingCart,
    CreditCard,
    Heart,
    Share2,
    Star,
    Truck,
    Shield,
    RotateCcw,
    ChevronDown,
    Sparkles,
    ChevronUp,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/apiConnector";
import { setWishList } from "../../../redux/slices/wishListSlice";
import BookVideoCallModal from "../BookVideoCall";
import { FALLPICO_PRICE, TASSELLS_PRICE } from "../../../Constant";
import { useOffer } from "../../../hooks/useOffer";

export default function ProductInfo({ product, onAddToCart, onShare }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((s) => s.cart);
    const { user } = useSelector((s) => s.user || {});
    const wishlistItems = useSelector((s) => s.wishlist);
    const offer = useOffer(product._id); // fetched once per session

    const [qty, setQty] = useState(1);
    const [inCart, setInCart] = useState(false);
    const [wishlisted, setWishlisted] = useState(false);
    const [callModalOpen, setCallModalOpen] = useState(false);
    const [withFallPico, setWithFallPico] = useState(false);
    const [withTassels, setWithTassels] = useState(false);
    const [faqOpen, setFaqOpen] = useState(false);
    const [shippingOpen, setShippingOpen] = useState(false);
    const [isOfferAplied, setIsOfferAplied] = useState(product.isOfferAplied);
    const basePrice = product?.price || 0;
    const addonPrice =
        (withFallPico ? FALLPICO_PRICE : 0) +
        (withTassels ? TASSELLS_PRICE : 0);

    // Apply discount only to base price
    const discountedBase =
        offer && isOfferAplied ? basePrice * (1 - offer / 100) : basePrice;
    const finalPrice = Math.round(discountedBase + addonPrice);
    const totalBefore = Math.round(basePrice + addonPrice);

    console.log("Final Price:", finalPrice);

    useEffect(() => {
        setInCart(cartItems.some((i) => i._id === product?._id));
    }, [cartItems, product?._id]);

    useEffect(() => {
        setWishlisted(wishlistItems.some((i) => i._id === product?._id));
    }, [wishlistItems, product?._id]);

    const renderStars = (rating = 0) =>
        Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                    }`}
            />
        ));

    const handleAddToCart = async () => {
        if (!user) return navigate("/login");
        if (inCart) return navigate("/cart");
        await onAddToCart?.({
            ...product,
            quantity: qty,
            addons: { withFallPico, withTassels },
            finalPrice,
        });
        setInCart(true);
    };

    const handleBuyNow = () => {
        navigate("/cart", {
            state: {
                buyNowItem: {
                    ...product,
                    id: product?._id,
                    quantity: qty,
                    addons: { withFallPico, withTassels },
                    finalPrice,
                },
            },
        });
    };

    const toggleWishlist = async () => {
        if (!user) return navigate("/login");
        const url = wishlisted ? "user/wishlist/remove" : "user/wishlist/add";
        const res = await axiosInstance.post(url, {
            userId: user._id,
            productId: product._id,
        });
        if (res.data) {
            dispatch(setWishList(res.data));
            setWishlisted(!wishlisted);
        }
    };

    return (
        <div className="space-y-8 text-base leading-relaxed capitalize px-0 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="border-b pb-4 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-semibold">
                            {product?.name}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={toggleWishlist}
                            className={`p-2 rounded-full ${wishlisted
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-foreground hover:text-red-600"
                                }`}
                        >
                            <Heart
                                className={wishlisted ? "fill-current" : ""}
                            />
                        </button>
                        <button
                            onClick={onShare}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                        >
                            <Share2 />
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setCallModalOpen(true)}
                    className="py-2 px-4 border border-gray-600 bg-gray-200 hover:bg-gray-100 mt-2"
                >
                    Book A Video Call
                </button>
                {callModalOpen && (
                    <BookVideoCallModal
                        isOpen
                        onClose={() => setCallModalOpen(false)}
                    />
                )}
            </div>

            {/* Pricing */}
            <div className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
                ₹{Math.round(discountedBase)}
                {offer && isOfferAplied && (
                    <span className="text-lg sm:text-xl text-green-600 font-medium">
                        <span className="line-through">₹{basePrice}</span> (
                        {offer}% OFF)
                    </span>
                )}
            </div>

            {/* Stock status */}
            <div className="flex gap-2 text-sm items-center">
                {product?.stock > 0 ? (
                    <>
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>In Stock ({product.stock})</span>
                    </>
                ) : (
                    <>
                        <span className="w-2 h-2 bg-red-500 rounded-full" />
                        <span>Out Of Stock</span>
                    </>
                )}
            </div>

            {/* Product details */}
            <div className="space-y-1 text-md sm:text-lg text-gray-700">
                <p>
                    <strong>Overview:</strong> {product?.description}
                </p>
                <p>
                    <strong>Color:</strong> {product?.color}
                </p>
                <p>
                    <strong>Technique:</strong> {product?.technique}
                </p>
                <p>
                    <strong>Fabric:</strong> {product?.fabric?.title || "N/A"}
                </p>
                {product?.note && (
                    <p>
                        <strong>Note:</strong> {product.note}
                    </p>
                )}
                {product?.assurance && (
                    <p>
                        <strong>Assurance:</strong> {product.assurance}
                    </p>
                )}
                {product?.weight && (
                    <p>
                        <strong>Weight:</strong> {product?.weight}
                    </p>
                )}
                {product?.hsnCode && (
                    <p>
                        <strong>HSN Code:</strong> {product?.hsnCode}
                    </p>
                )}
            </div>

            {/* Customizations */}
            <div className="border-t pt-4 space-y-3">
                <h2 className="text-lg font-semibold">Customizations</h2>
                <label className="flex justify-between items-center">
                    <span>Fall & Pico</span>
                    <div className="flex items-center gap-2">
                        <span>+₹{FALLPICO_PRICE}</span>
                        <input
                            type="checkbox"
                            checked={withFallPico}
                            onChange={() => setWithFallPico(!withFallPico)}
                        />
                    </div>
                </label>
                <label className="flex justify-between items-center">
                    <span>Tassels</span>
                    <div className="flex items-center gap-2">
                        <span>+₹{TASSELLS_PRICE}</span>
                        <input
                            type="checkbox"
                            checked={withTassels}
                            onChange={() => setWithTassels(!withTassels)}
                        />
                    </div>
                </label>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
                <label className="font-medium">Quantity</label>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-8 h-8 border rounded"
                    >
                        –
                    </button>
                    <span className="w-8 text-center">{qty}</span>
                    <button
                        onClick={() =>
                            setQty(Math.min(product.stock || 10, qty + 1))
                        }
                        className="w-8 h-8 border rounded"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <button
                    onClick={handleBuyNow}
                    disabled={!product.stock}
                    className="w-full py-3 rounded text-white bg-foreground hover:bg-foreground/90 disabled:bg-gray-300"
                >
                    <CreditCard className="inline-block mr-2" /> Buy Now
                </button>
                <button
                    onClick={handleAddToCart}
                    disabled={!product.stock}
                    className="w-full py-3 rounded border border-foreground text-foreground hover:bg-gray-50 disabled:bg-gray-300"
                >
                    <ShoppingCart className="inline-block mr-2" />
                    {inCart ? "Go To Cart" : "Add To Cart"}
                </button>
            </div>

            {/* Trust icons */}
            <div className="grid grid-cols-3 gap-4 text-center text-sm pt-4">
                <div>
                    <Truck className="mx-auto mb-1" /> Free Shipping
                </div>
                <div>
                    <Shield className="mx-auto mb-1" /> Authenticated
                </div>
                <div>
                    <Sparkles className="mx-auto mb-1" /> Quality You Can Trust
                </div>
            </div>

            {/* FAQ */}
            <div className="pt-6 border-t">
                <button
                    onClick={() => setFaqOpen(!faqOpen)}
                    className="flex justify-between items-center w-full font-semibold text-lg"
                >
                    Color & Care Guide{" "}
                    {faqOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
                {faqOpen && (
                    <div className="mt-2 text-sm text-gray-600">
                        Color and Texture may have slight variation. This
                        happens because of photography. Yarns and Slubs may have
                        some uneven and missing contrasts. They are inherent
                        chararcteristic of the fabric that make its style
                        peculiar. Dry Clean only.
                    </div>
                )}
            </div>

            {/* Supplier Info */}
            <div className="pt-4 border-t">
                <button
                    onClick={() => setShippingOpen(!shippingOpen)}
                    className="flex justify-between items-center w-full font-semibold text-lg"
                >
                    Supplier Information{" "}
                    {shippingOpen ? <ChevronUp /> : <ChevronDown />}
                </button>
                {shippingOpen && (
                    <div className="mt-2 text-sm text-gray-600">
                        2nd Floor, C.K 20/9 Shetla Katra Thatheri Bazar
                        <br />
                        Varanasi, Uttar Pradesh 221010
                    </div>
                )}
            </div>
        </div>
    );
}
