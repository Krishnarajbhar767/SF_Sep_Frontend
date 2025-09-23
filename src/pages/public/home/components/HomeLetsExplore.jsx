import React from "react";
import Heading from "./Heading";
import SubHeading from "./SubHeading";
import { useNavigate } from "react-router-dom";
import { useLetsExplore } from "../../../../hooks/useLetsExplore";

function HomeLetsExplore() {
    const navigate = useNavigate();
    const data = useLetsExplore()
    console.log('Images Of Lets Explore->', data)
    return (
        <div className=" py-4">
            {/* Heading Section */}
            <div className="md:mb-14 mb-10 mt-4 text-center md:text-left">
                <Heading text={data?.heading} />
                <div className="mt-2">
                    <SubHeading text={data?.subHeading} />
                </div>
            </div>

            {/* Background Image with CTA */}
            <div className={`relative h-[400px] md:h-[600px] py-4 bg-fixed bg-center bg-cover bg-no-repeat text-white`} style={{
                backgroundImage: `url(${data?.image})`,
            }}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-[90%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] space-y-4">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight capitalize">
                            {data?.title}
                        </h1>
                        <h2 className="text-md sm:text-base md:text-lg font-normal tracking-tight leading-snug capitalize">
                            {data?.paragraph}
                        </h2>
                        <button
                            onClick={() =>
                                navigate(
                                    data?.btnUrl
                                )
                            }
                            className="text-lg md:text-xl bg-white text-gray-800 w-44 md:w-52 px-4 py-2 border border-transparent hover:border-white hover:bg-transparent hover:text-white transition-all duration-200"
                        >
                            {data?.btnText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeLetsExplore;
