import React, { useMemo, Suspense, useEffect } from "react";
import HomeHeroSlider from "./components/HomeHeroSlider";
import Second_Slider from "./components/Second_Slider";
import axios from 'axios'
import { useQuery } from '@tanstack/react-query';
import Loader from "../../../components/common/Loader";
import { toast } from 'react-hot-toast'
import { queryClient } from "../../../QueryClient";
import { useHeroSlides } from "../../../hooks/useHero";

// Lazy-load heavy sections
const HomeOnlyTwoSlideGrid = React.lazy(() =>
    import("./components/HomeOnlyTwoSlideGrid")
);
const WhyChooseUs = React.lazy(() => import("./components/WhyChooseUs"));
const Home3Grid = React.lazy(() => import("./components/Home3Grid"));
const HomeVideo = React.lazy(() => import("./components/HomeVideo"));
const Home2BigGrid = React.lazy(() => import("./components/Home2BigGrid"));
const HomeOneImageOnly = React.lazy(() =>
    import("./components/HomeOneImageOnly")
);
const HomeLetsExplore = React.lazy(() =>
    import("./components/HomeLetsExplore")
);



function Home() {
    const { sliderData1 = [], sliderData2 = [], isLoading, isError } = useHeroSlides()
    console.log('Is Error Accured WHile Fetching API', isError, { sliderData1, sliderData2 })
    return (
        <div className="w-full h-full ">
            {/* Hero Slider */}
            {/* Section 1 */}
            <HomeHeroSlider sliderData={sliderData1} />

            {/* Sections */}
            <Suspense fallback={<Loader />} >
                {/* Section 2 */}
                {/* Home 3 Grid */}
                <Home3Grid />
                {/* Section 3 */}
                {/* Home Video */}
                <HomeVideo />
                {/* Section 4 */}
                <Home2BigGrid />
            </Suspense>

            <div className="py-4">
                {/* Section 5 */}
                <Second_Slider textPosition={true} sliderData={sliderData2} />
            </div>



            <Suspense fallback={<Loader />}>
                {/* Section 6 */}
                <HomeOneImageOnly />
                {/* Section 7 */}
                <HomeOnlyTwoSlideGrid />
                {/* Section 8 */}
                <HomeLetsExplore />
                {/* Section 9 */}
                <WhyChooseUs />
            </Suspense>
        </div>
    );
}

export default Home;
