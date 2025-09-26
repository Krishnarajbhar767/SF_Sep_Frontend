import { motion } from "motion/react";
import React, { useState } from "react";
const Slider = React.lazy(() => import('../home/editor/Slider'))
const Home3GridSection2Editor = React.lazy(() => import('../home/editor/Home3GridSection2Editor'))
const HomeSection3VideoEditor = React.lazy(() => import('../home/editor/HomeSection3VideoEditor'))
import AdminHomeTabSelector from "./AdminHomeTabSelector";
import Home2BigGridSection4Editor from "./editor/Home2BigGridSection4Editor";
import HomeSection6Editor from "./editor/HomeSection6Editor";
import HomeSection7Editor from "./editor/HomeSection7Editor";
import HomeSection8Editor from "./editor/HomeSection8Editor";
const SECTION_TABS = [
    { key: "heroSlider", label: "Hero Slider" },
    { key: "threeGrid", label: "3-Image Grid" },
    { key: "videoBlock", label: "Video Block" },
    { key: "bigGrid", label: "2-Image Big Grid" },
    { key: "singleBanner", label: "Single Banner" },
    { key: "twoSlideGrid", label: "2-Slide Grid" },
    { key: "exploreBanner", label: "Explore Banner" },

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
                {
                    activeTab === 'bigGrid' && <Home2BigGridSection4Editor />

                }
                {
                    activeTab === 'singleBanner' && <HomeSection6Editor />

                }
                {
                    activeTab === 'twoSlideGrid' && <HomeSection7Editor />

                }
                {
                    activeTab === 'exploreBanner' && <HomeSection8Editor />

                }
            </div>
        </motion.div>
    );
}

export default AdminHomeManagement;
