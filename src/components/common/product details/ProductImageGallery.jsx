





// 2 Aug


import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X } from "lucide-react";
import { useOffer } from "../../../hooks/useOffer";

export default function ProductImageGallery({
    images = [],
    productName = "",
    stock = 1,
    product
}) {
    const [selectedImage, setSelectedImage] = useState(
        images[0] || "/placeholder.svg"
    );

    const offer = useOffer(product._id); // fetched once per session

    const [isOfferAplied, setIsOfferAplied] = useState(product.isOfferAplied);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isFullscreen, setIsFullscreen] = useState(false);

    // Zoom & pan state
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isZoomed, setIsZoomed] = useState(false);
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [panStart, setPanStart] = useState(null);

    // Pinch state
    const [isPinching, setIsPinching] = useState(false);
    const pinchRef = useRef({ startDist: 0, startZoom: 1 });

    // Swipe state
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const minSwipeDistance = 50;

    const containerRef = useRef(null);

    // Initialize when images change
    useEffect(() => {
        if (images.length) {
            setSelectedImage(images[0]);
            setCurrentIndex(0);
            resetZoomPan();
        }
    }, [images]);

    // Helpers
    const resetZoomPan = () => {
        setZoomLevel(1);
        setIsZoomed(false);
        setPanOffset({ x: 0, y: 0 });
    };

    const distance = (t1, t2) =>
        Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

    // Navigation
    const nextImage = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (images.length < 2) return;
        const next = (currentIndex + 1) % images.length;
        setCurrentIndex(next);
        setSelectedImage(images[next]);
        resetZoomPan();
    };
    const prevImage = (e) => {
        e?.preventDefault();
        e?.stopPropagation();
        if (images.length < 2) return;
        const prev = (currentIndex - 1 + images.length) % images.length;
        setCurrentIndex(prev);
        setSelectedImage(images[prev]);
        resetZoomPan();
    };
    const selectImage = (img, idx) => {
        setCurrentIndex(idx);
        setSelectedImage(img);
        resetZoomPan();
    };

    // Fullscreen toggles
    const openFullscreen = () => {
        setIsFullscreen(true);
        resetZoomPan();
    };
    const closeFullscreen = () => {
        setIsFullscreen(false);
        resetZoomPan();
    };

    // Mouse wheel for desktop
    const onWheel = (e) => {
        if (!isZoomed && !isFullscreen) return;
        e.preventDefault();
        const delta = -e.deltaY * 0.002;
        const z = Math.min(5, Math.max(1, zoomLevel + delta));
        setZoomLevel(z);
        setIsZoomed(z > 1);
    };

    // Touch: pinch & swipe
    const onTouchStart = (e) => {
        if (e.touches.length === 2) {
            const d = distance(e.touches[0], e.touches[1]);
            pinchRef.current = { startDist: d, startZoom: zoomLevel };
            setIsPinching(true);
        } else {
            setTouchEndX(null);
            setTouchStartX(e.touches[0].clientX);
        }
    };
    const onTouchMove = (e) => {
        if (isPinching && e.touches.length === 2) {
            const d = distance(e.touches[0], e.touches[1]);
            const scale = d / pinchRef.current.startDist;
            const z = Math.min(
                5,
                Math.max(1, pinchRef.current.startZoom * scale)
            );
            setZoomLevel(z);
            setIsZoomed(z > 1);
        } else if (!isPinching) {
            setTouchEndX(e.touches[0].clientX);
        }
    };
    const onTouchEnd = () => {
        if (isPinching) {
            setIsPinching(false);
            return;
        }
        if (
            touchStartX != null &&
            touchEndX != null &&
            Math.abs(touchStartX - touchEndX) > minSwipeDistance
        ) {
            touchStartX - touchEndX > 0 ? nextImage() : prevImage();
        }
    };

    // Drag to pan
    const onDragStart = (e) => {
        if (!isZoomed) return;
        const pt = e.touches?.[0] || e;
        setPanStart({
            x: pt.clientX - panOffset.x,
            y: pt.clientY - panOffset.y,
        });
    };
    const onDragMove = (e) => {
        if (!isZoomed || !panStart) return;
        const pt = e.touches?.[0] || e;
        setPanOffset({
            x: pt.clientX - panStart.x,
            y: pt.clientY - panStart.y,
        });
    };
    const onDragEnd = () => {
        setPanStart(null);
    };

    // Keyboard nav in fullscreen
    useEffect(() => {
        const onKey = (e) => {
            if (!isFullscreen) return;
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
            if (e.key === "Escape") closeFullscreen();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isFullscreen, currentIndex]);

    if (!images.length) {
        return (
            <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-sm">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    return (
        <>
            {/* Thumbnails + main */}
            <div className="flex flex-col md:flex-row gap-4">
                {images.length > 1 && (
                    <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto md:h-[500px] md:w-32 pb-2 md:pb-0 md:pr-2">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => selectImage(img, i)}
                                className={`flex-shrink-0 w-20 md:w-full h-32 md:h-50 overflow-hidden rounded-sm border-2 transition-all duration-200 ${currentIndex === i
                                    ? "border-foreground  "
                                    : "border-gray-200 hover:border-gray-400"
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`${productName} thumbnail ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}

                <div className="order-1 md:order-2 flex-1 relative group">
                    <div
                        ref={containerRef}
                        className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-gray-50 rounded-sm  shadow-sm"
                        onWheel={onWheel}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={selectedImage}
                            alt={productName}
                            className={`w-full h-full object-cover transition-transform duration-200 ${stock === 0 ? "opacity-100" : ""
                                }`}
                            style={
                                isZoomed
                                    ? {
                                        transform: `translate(${panOffset.x}px,${panOffset.y}px) scale(${zoomLevel})`,
                                        cursor: "grab",
                                    }
                                    : { cursor: stock ? "zoom-in" : "default" }
                            }
                            draggable={false}
                            onClick={() => {
                                if (stock && !isZoomed) openFullscreen();
                            }}
                            onMouseDown={onDragStart}
                            onMouseMove={onDragMove}
                            onMouseUp={onDragEnd}
                            onTouchStart={onDragStart}
                            onTouchMove={onDragMove}
                            onTouchEnd={onDragEnd}
                        />

                        {offer && isOfferAplied && (
                            <div className="absolute top-4 right-[-40px] rotate-45 bg-orange-500 text-white px-10 py-1 shadow-md">
                                {offer}% OFF
                            </div>
                        )}

                        {product.stock === 0 ? (
                            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                                Out of Stock
                            </span>
                        ) : product.stock > 0 && product.stock < 10 ? (
                            <span className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                                Only {product.stock} left
                            </span>
                        ) : null}

                        {/* Nav arrows */}
                        {images.length > 1 && stock > 0 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-100 md:opacity-100 group-hover:opacity-100 z-10"
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-100 md:opacity-100 group-hover:opacity-100 z-10"
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-700" />
                                </button>
                            </>
                        )}

                        {/* Zoom controls */}
                        {stock > 0 && (
                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-100 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const z = Math.min(5, zoomLevel + 0.5);
                                        setZoomLevel(z);
                                        setIsZoomed(true);
                                    }}
                                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10"
                                >
                                    <ZoomIn className="w-4 h-4 text-gray-700" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const z = Math.max(1, zoomLevel - 0.5);
                                        setZoomLevel(z);
                                        setIsZoomed(z > 1);
                                    }}
                                    className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg z-10"
                                >
                                    <ZoomOut className="w-4 h-4 text-gray-700" />
                                </button>
                            </div>
                        )}

                        {/* Counter */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                {currentIndex + 1} / {images.length}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        <button
                            onClick={closeFullscreen}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <img
                            src={selectedImage}
                            alt={productName}
                            className="max-w-full max-h-full object-contain transition-transform duration-200"
                            style={
                                isZoomed
                                    ? {
                                        transform: `translate(${panOffset.x}px,${panOffset.y}px) scale(${zoomLevel})`,
                                        cursor: "grab",
                                    }
                                    : { cursor: stock ? "zoom-in" : "default" }
                            }
                            draggable={false}
                            onMouseDown={onDragStart}
                            onMouseMove={onDragMove}
                            onMouseUp={onDragEnd}
                            onTouchStart={onDragStart}
                            onTouchMove={onDragMove}
                            onTouchEnd={onDragEnd}
                        />

                        {/* Always-visible arrows on mobile fullscreen */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-10"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full z-10"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}