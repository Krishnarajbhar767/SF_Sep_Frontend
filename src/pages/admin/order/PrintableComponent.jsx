import React, { useRef } from "react";
import { FALLPICO_PRICE, TASSELLS_PRICE } from "../../../Constant";

const PrintableComponent = ({ receipt, printRef }) => {
    const formatINR = (amount) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);

    const calculateItemTotal = (item) => {
        const basePrice = item?.price || 0;
        const addOns =
            (item?.withFallPico ? FALLPICO_PRICE : 0) +
            (item?.withTassels ? TASSELLS_PRICE : 0);
        const finalPricePerUnit = basePrice + addOns;
        return {
            finalPricePerUnit,
            total: finalPricePerUnit * item?.quantity,
        };
    };

    const calculatedSubtotal = receipt?.items?.reduce((acc, item) => {
        const { total } = calculateItemTotal(item);
        return acc + total;
    }, 0);

    return (
        <div className="p-4 hidden">
            <div
                ref={printRef}
                className="mt-6 p-6 bg-white shadow-lg rounded text-sm font-sans"
            >
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-2xl font-bold mb-1">Order Receipt</h2>
                    <p className="text-gray-600">Order ID: {receipt?.id}</p>
                    <p className="text-gray-600">
                        Date: {new Date(receipt?.date).toLocaleString()}
                    </p>
                </div>

                <div className="mb-6 capitalize">
                    <h3 className="text-lg font-semibold">Customer Info</h3>
                    <p>
                        <strong>Name:</strong> {receipt?.customerName}
                    </p>
                    <p>
                        <strong>Email:</strong> {receipt?.email}
                    </p>
                    <p>
                        <strong>Phone:</strong> {receipt?.phone}
                    </p>
                    <p>
                        <strong>Address:</strong>{" "}
                        {receipt?.shippingAddress
                            ? `${receipt?.shippingAddress?.street}, ${receipt?.shippingAddress?.city}, ${receipt?.shippingAddress?.postalCode},${receipt?.shippingAddress?.state}, ${receipt?.shippingAddress?.country}`
                            : "N/A"}
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Order Items</h3>
                    <table className="min-w-full table-auto border border-gray-300 text-xs sm:text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2 text-left">
                                    Product
                                </th>
                                <th className="border p-2">Qty</th>
                                <th className="border p-2">With Fall Pico</th>
                                <th className="border p-2">With Tassels</th>
                                <th className="border p-2">Unit Price</th>
                                <th className="border p-2">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receipt?.items?.map((item, index) => {
                                const { finalPricePerUnit, total } =
                                    calculateItemTotal(item);
                                return (
                                    <tr key={index} className="text-center">
                                        <td className="border p-2 text-left">
                                            {item?.name || "Product"}
                                        </td>
                                        <td className="border p-2">
                                            {item?.quantity}
                                        </td>
                                        <td className="border p-2">
                                            {item?.withFallPico
                                                ? `Yes +₹${FALLPICO_PRICE}`
                                                : "No"}
                                        </td>
                                        <td className="border p-2">
                                            {item?.withTassels
                                                ? `Yes +₹${TASSELLS_PRICE}`
                                                : "No"}
                                        </td>
                                        <td className="border p-2">
                                            {formatINR(finalPricePerUnit)}
                                        </td>
                                        <td className="border p-2">
                                            {formatINR(total)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="text-right mb-6">
                    <p>
                        <strong>Amount (Inclusive of 5% GST):</strong>{" "}
                        {formatINR(calculatedSubtotal)}
                    </p>
                    <p className="text-gray-600 italic">
                        GST (5%) is already included in the above amount.
                    </p>
                    <p>
                        <strong>Shipping:</strong> {receipt?.shipping || "Free"}
                    </p>
                    <p>
                        <strong>Payment Method:</strong>{" "}
                        {receipt?.paymentMethod || "N/A"}
                    </p>
                </div>

                <div className="border-t pt-4 text-center text-sm">
                    <p className="font-semibold text-base">
                        Thank you for shopping with us!
                    </p>
                    <p className="text-gray-700">Srijan Fabs Pvt. Ltd.</p>
                    <p className="text-gray-700">Contact: +91 89605 00991</p>
                </div>
            </div>
        </div>
    );
};

export default PrintableComponent;
