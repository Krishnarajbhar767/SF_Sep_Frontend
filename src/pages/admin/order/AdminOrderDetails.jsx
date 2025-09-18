
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiArrowLeft,
    FiPackage,
    FiTruck,
    FiCreditCard,
    FiUser,
    FiMail,
    FiPhone,
    FiHash,
    FiPrinter,
    FiUpload,
} from "react-icons/fi";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/apiConnector";
import UploadReceiptModal from "./UploadReceiptModal";
import PrintableComponent from "./PrintableComponent";
import { FALLPICO_PRICE, TASSELLS_PRICE } from "../../../Constant";
import ReceiptPreview from "../../../components/common/ReceiptPreview";

// Animation variants
const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.2, duration: 0.4 },
    }),
};

const StatusBadge = ({ status, type = "default" }) => {
    const statusLower = (status || "").toLowerCase();
    let style = "bg-gray-50 text-gray-700 border-gray-200";
    if (type === "payment") {
        if (statusLower === "paid")
            style = "bg-emerald-50 text-emerald-700 border-emerald-200";
        else if (["failed", "pending"].includes(statusLower))
            style = "bg-red-50 text-red-700 border-red-200";
    } else {
        if (statusLower === "delivered")
            style = "bg-emerald-50 text-emerald-700 border-emerald-200";
        else if (["shipped", "out for delivery"].includes(statusLower))
            style = "bg-blue-50 text-blue-700 border-blue-200";
        else if (statusLower === "pending")
            style = "bg-amber-50 text-amber-700 border-amber-200";
        else if (statusLower === "canceled")
            style = "bg-red-50 text-red-700 border-red-200";
    }
    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${style}`}
        >
            {status || "N/A"}
        </span>
    );
};

const AdminOrderHeader = ({ order, onPrint }) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            <motion.div
                custom={0}
                initial="hidden"
                animate="visible"
                variants={sectionVariants}
                className="flex flex-col sm:flex-row justify-between items-center gap-4"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Admin Order Management
                    </h1>
                    <p className="text-sm text-gray-600">
                        Order ID:{" "}
                        <span className="font-mono">
                            {order?.razorpay_order_id || "N/A"}
                        </span>
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={onPrint}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 hover:text-blue-600 border rounded bg-gray-100"
                    >
                        <FiPrinter size={18} /> Print Receipt
                    </button>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 hover:text-blue-600 border rounded bg-gray-100"
                    >
                        <FiUpload size={18} /> Upload Delhivery Receipt
                    </button>
                    <Link
                        to="/admin/orders"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                    >
                        <FiArrowLeft size={16} /> Back to Orders
                    </Link>
                </div>
            </motion.div>
            <UploadReceiptModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                orderId={order?._id}
            />
        </>
    );
};

const CustomerInfo = ({ user }) => (
    <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="space-y-4"
    >
        <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <FiUser size={20} /> Customer Information
        </h3>
        <div className="bg-purple-50 border-purple-100 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <FiUser size={20} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Customer Name
                            </p>
                            <p className="font-semibold text-gray-800 capitalize">
                                {(user?.firstName || "") +
                                    " " +
                                    (user?.lastName || "")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FiMail size={20} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Email Address
                            </p>
                            <p className="font-medium text-gray-800 lowercase">
                                {user?.email || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <FiPhone size={20} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Phone Number
                            </p>
                            <p className="font-semibold text-gray-800">
                                {user?.phone || "N/A"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <FiHash size={20} className="text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Customer ID</p>
                            <p className="font-mono text-sm text-gray-800">
                                {user?._id || "N/A"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

const AdminOrderOverview = ({ order, formatINR }) => {
    const totalBeforeCoupon =
        (order?.totalAmount || 0) +
        (typeof order?.discount === "number" && order.discount > 0
            ? order.discount
            : 0);

    return (
        <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="bg-blue-50 border-blue-100 rounded-xl p-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                        Order Date
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                    <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                        Gross Amount
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                        ₹{formatINR(totalBeforeCoupon)}
                    </p>
                </div>
                {typeof order?.discount === "number" && order.discount > 0 && (
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                            Coupon Discount
                        </p>
                        <p className="text-sm font-medium text-red-600">
                            - ₹{formatINR(order.discount)}
                        </p>
                    </div>
                )}
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                        Net Payable
                    </p>
                    <p className="text-xl font-bold text-gray-800">
                        ₹{formatINR(order.totalAmount || 0)}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                        Payment Status
                    </p>
                    <StatusBadge status={order.paymentStatus} type="payment" />
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                        Delivery Status
                    </p>
                    <StatusBadge status={order.deliveryStatus} />
                </div>
            </div>
        </motion.div>
    );
};

const AdminProductItem = ({ item, index, formatINR }) => {
    const navigate = useNavigate();
    const product = item?.product || {};
    const name = product.name || "Unnamed Product";
    const price = typeof product.price === "number" ? product.price : 0;
    const images = Array.isArray(product.images) ? product.images : [];
    const qty = item?.quantity || 0;
    const isOfferApplied = product.isOfferAplied === true;
    const offerPercent =
        isOfferApplied && typeof product.offerDiscount === "number"
            ? product.offerDiscount
            : 0;
    const fallPico = item?.withFallPico ? FALLPICO_PRICE : 0;
    const tassels = item?.withTassels ? TASSELLS_PRICE : 0;
    const addons = fallPico + tassels;
    const offerDiscount = isOfferApplied ? (price * offerPercent) / 100 : 0;
    const discountedPrice = price - offerDiscount;
    const unitPrice = discountedPrice + addons;
    const gross = unitPrice * qty;

    return (
        <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-gray-200 rounded-xl p-6 shadow-sm"
        >
            <div className="flex flex-col sm:flex-row gap-6">
                <img
                    onClick={() =>
                        product._id && navigate(`/product/${product._id}`)
                    }
                    src={images[0] || "/Product_Placeholder.webp"}
                    alt={name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-sm cursor-pointer"
                />
                <div className="flex-1 space-y-4 text-sm text-gray-700">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 capitalize">
                            {name}
                        </h4>
                        <div className="flex gap-4 mt-1 text-xs text-gray-500">
                            <span>
                                Product ID: <code>{product._id || "N/A"}</code>
                            </span>
                            <span>
                                Qty: <strong>{qty}</strong>
                            </span>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                        <h5 className="text-sm font-bold text-gray-900">
                            🧾 Price Summary
                        </h5>
                        <div className="flex justify-between font-semibold text-gray-700">
                            <span>Base Price</span>
                            <span>₹{formatINR(price)}</span>
                        </div>
                        {isOfferApplied && offerPercent > 0 ? (
                            <>
                                <div className="flex justify-between text-green-600">
                                    <span>
                                        Offer Discount ({offerPercent}%)
                                    </span>
                                    <span>- ₹{formatINR(offerDiscount)}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                    <span>After Offer</span>
                                    <span>₹{formatINR(discountedPrice)}</span>
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-between font-medium text-gray-600">
                                <span>Offer Not Applied</span>
                                <span>₹{formatINR(price)}</span>
                            </div>
                        )}

                        {(fallPico > 0 || tassels > 0) && (
                            <div className="space-y-1 pt-2">
                                <p className="font-semibold text-gray-700">
                                    Add‑ons
                                </p>
                                {fallPico > 0 && (
                                    <div className="flex justify-between">
                                        <span>+ Fall Pico</span>
                                        <span>+ ₹{FALLPICO_PRICE}</span>
                                    </div>
                                )}
                                {tassels > 0 && (
                                    <div className="flex justify-between">
                                        <span>+ Tassels</span>
                                        <span>+ ₹{TASSELLS_PRICE}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="border-t pt-2 space-y-1">
                            <p className="font-semibold text-gray-700">
                                Final Unit Price
                            </p>
                            <div className="flex justify-between font-medium">
                                <span>Unit Price</span>
                                <span>₹{formatINR(unitPrice)}</span>
                            </div>
                        </div>

                        <div className="border-t pt-2 space-y-1">
                            <p className="font-semibold text-gray-700">
                                Gross Total
                            </p>
                            <div className="flex justify-between font-bold text-gray-800">
                                <span>
                                    {qty} × ₹{formatINR(unitPrice)}
                                </span>
                                <span>₹{formatINR(gross)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const AdminOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const printRef = useRef();
    console.log('Order Details ->', order)
    const navigate = useNavigate();
    const receiptOption = {
        id: order?.razorpay_order_id || "",
        date: order?.createdAt || "",
        customerName: `${order?.user?.firstName || ""} ${order?.user?.lastName || ""
            }`,
        email: order?.user?.email || "",
        phone: order?.shippingAddressSnapshot?.phone || "",

        shippingAddress: {
            street: order?.shippingAddressSnapshot?.street || "",
            city: order?.shippingAddressSnapshot?.city || "",
            state: order?.shippingAddressSnapshot?.state || "",
            country: order?.shippingAddressSnapshot?.country || "",
            postalCode: order?.shippingAddressSnapshot?.postalCode || "",
        },

        items: (order?.items || []).map((item) => {
            console.log('Item  consoling  I Am --->', item.offer)
            console.log('Item  consoling  I Am --->', item.product.price)

            return {
                name: item?.product?.name || "Product",
                quantity: item?.quantity || 0,
                price: item.product.price * (1 - item.offer / 100),
                withFallPico: item?.withFallPico || false,
                withTassels: item?.withTassels || false,
            }
        }),

        subtotal: order?.totalAmount || 0, // already includes GST
        shipping: "Free",
        paymentMethod: order?.paymentMethod || "N/A",
    };
    useEffect(() => {
        setLoading(true);
        axiosInstance
            .get(`/admin/orders/order/${id}`)
            .then((res) => {
                setOrder(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setOrder(null);
                setLoading(false);
            });
    }, [id]);

    const formatINR = (amount) =>
        (amount || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    if (loading) return <div> {/* loader UI */}Loading...</div>;
    if (!order) return <div>No order found.</div>;

    const handlePrint = () => {
        const original = document.body.innerHTML;
        document.body.innerHTML = printRef.current.innerHTML;
        window.print();
        document.body.innerHTML = original;
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto">
                <motion.div className="space-y-8">
                    <AdminOrderHeader order={order} onPrint={handlePrint} />
                    <CustomerInfo user={order.user} />
                    <AdminOrderOverview order={order} formatINR={formatINR} />
                    <motion.div
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={sectionVariants}
                        className="space-y-4"
                    >
                        <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                            <FiPackage size={20} /> Order Items (
                            {order.items?.length || 0})
                        </h3>
                        <div className="space-y-4">
                            {order.items?.map((item, idx) => (
                                <AdminProductItem
                                    key={item._id || idx}
                                    item={item}
                                    index={idx}
                                    formatINR={formatINR}
                                />
                            ))}
                        </div>
                    </motion.div>
                    <ReceiptPreview
                        imageUrl={order?.delhiveryReceipt}
                        trackingId={order?.trackingId}
                        parcelWeight={order?.parcelWeight}
                        deliveryPartner={order?.deliveryPartner}
                    />

                    {/* 
                        "deliveryPartner": "Ekart",
                        "parcelWeight": "100gm",
                        "trackingId": "TRK123456" 
                    */}

                    <PrintableComponent
                        receipt={
                            receiptOption
                        }
                        printRef={printRef}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
