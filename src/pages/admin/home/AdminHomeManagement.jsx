import { motion } from "motion/react";
import React, { useState } from "react";
const Slider = React.lazy(() => import('../home/editor/Slider'))
const Home3GridSection2Editor = React.lazy(() => import('../home/editor/Home3GridSection2Editor'))
const HomeSection3VideoEditor = React.lazy(() => import('../home/editor/HomeSection3VideoEditor'))
import AdminHomeTabSelector from "./AdminHomeTabSelector";
const SECTION_TABS = [
    { key: "heroSlider", label: "Hero Slider" },
    { key: "threeGrid", label: "3-Image Grid" },
    { key: "videoBlock", label: "Video Block" },
    { key: "bigGrid", label: "2-Image Big Grid" },
    { key: "singleBanner", label: "Single Banner" },
    { key: "twoSlideGrid", label: "2-Slide Grid" },
    { key: "exploreBanner", label: "Explore Banner" },
    { key: "whyChooseUs", label: "Why Choose Us" },
];
function AdminHomeManagement() {
    const [activeTab, setActiveTab] = useState("heroSlider");
    console.log("Active Tab ->", activeTab);
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6  max-w-4xl scroll-smooth"
        >
            <div className="">
                <AdminHomeTabSelector
                    sections={SECTION_TABS}
                    onTabChange={(tab) => setActiveTab(tab)}
                />
            </div>
            <div>
                {
                    activeTab === 'heroSlider' && <Slider />

                }
                {
                    activeTab === 'threeGrid' && <Home3GridSection2Editor />

                }
                {
                    activeTab === 'videoBlock' && <HomeSection3VideoEditor />

                }
            </div>
        </motion.div>
    );
}

export default AdminHomeManagement;
