import React from "react";
import Image from "../../../../assets/images/Home/HomeOneImageOnly/SF_1920x800.jpg";
function HomeOneImageOnly() {
    return (
        <div className="h-[300px] md:h-[550px] w-full boxedContainer py-4 sm:px-8 overflow-hidden">
            <img
                src="https://res.cloudinary.com/ditulyswb/image/upload/v1755155453/SF_1920x800_koql8b.jpg"
                className="object-cover h-full w-full cursor-pointer sm:px-8"
                alt="background"
            />
        </div>
    );
}

export default HomeOneImageOnly;
