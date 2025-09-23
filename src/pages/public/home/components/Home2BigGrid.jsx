import React from "react";
import { motion } from "motion/react";
import Heading from "./Heading";
import SubHeading from "./SubHeading";
import Banner1 from "../../../../assets/images/Home/Home2BigGrid/SF_772x772_1.jpg";
import Banner2 from "../../../../assets/images/Home/Home2BigGrid/SF_772x772_2.jpg";
import { useHome2BigGrid } from "../../../../hooks/useHome2BigGrid";
import { Link } from "react-router-dom";
function Home2BigGrid() {
    const data = useHome2BigGrid()
    // const data = [
    //     {
    //         image: "https://res.cloudinary.com/ditulyswb/image/upload/v1755499003/SF_772x772_2_uviajv.jpg",
    //         text: "Saree",
    //         slug: ""
    //     },
    //     {
    //         image: "https://res.cloudinary.com/ditulyswb/image/upload/v1755499002/SF_772x772_1_yhyfmx.jpg",
    //         text: "Duppata",
    //         slug: ""
    //     },
    // ];
    return (
        <div className="boxedContainer lg:px-15 px-5 w-full py-4  h-auto  overflow-x-hidden ">
            <div className="md:mb-14 mb-10 mt-4">
                <div>
                    <Heading text={data?.heading} />
                </div>
                <div className="mt-2">
                    <SubHeading
                        text={
                            data?.subHeading
                        }
                    />
                </div>
            </div>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 ">
                {data?.items?.map((item, index) => (
                    <Link className="relative" to={item.slug}>
                        <motion.img
                            whileTap={{ scale: 0.95 }}
                            key={index}
                            src={item?.image}
                            alt="Sarees"
                            className="w-full h-[50vh] md:h-[100vh] object-cover object-top  hover:scale-[101%] transition-all ease-linear duration-200 shadow-sm  border border-gray-200 "
                        />
                        {/* <h1 className="absolute top-[85%] md:top-[90%]  left-[5%] text-xl font-medium text-white uppercase">
                            {item.text}
                        </h1> */}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Home2BigGrid;
