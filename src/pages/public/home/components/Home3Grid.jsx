import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import Heading from "./Heading";
import SubHeading from "./SubHeading";
// import Banner1 from "../../../../assets/images/Home/Home3Grid/SF_1080x1350_1.jpg";
// import Banner2 from "../../../../assets/images/Home/Home3Grid/SF_1080x1350_2.jpg";
// import Banner3 from "../../../../assets/images/Home/Home3Grid/SF_1080x1350_3.jpg";
import { useHome3grid } from "../../../../hooks/useHome3Grid";
function Home3Grid() {
    const data = useHome3grid()
    console.log('Returning Data =>', data)
    const navigate = useNavigate();


    return (
        <div className="boxedContainer lg:px-15 px-5 w-full py-4  h-auto  overflow-x-hidden ">
            <div className="md:mb-14 mb-10 mt-4">
                <div>

                    {/* Dyanamic */}
                    <Heading
                        text={data?.heading}
                    />
                </div>
                <div className="mt-2">
                    {/* Dyanamic */}
                    <SubHeading
                        text={
                            data?.subHeading
                        }
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.items?.map((item, index) => (
                    <div className="relative cursor-pointer " onClick={() => navigate(item?.slug)}>
                        <motion.img
                            whileTap={{ scale: 0.8 }}
                            key={index}
                            src={item?.image}
                            alt="Sarees"
                            className="w-full h-[500px] object-cover object-top md:object-center  hover:scale-[101%] transition-all ease-linear duration-200 shadow-sm  border border-gray-200 "
                        />
                        <div class="absolute bottom-20 left-0 w-full bg-gradient-to-t to-transparent p-4">
                            <p className="text-white text-2xl font-semibold text-center capitalize">
                                {item?.title}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home3Grid;
