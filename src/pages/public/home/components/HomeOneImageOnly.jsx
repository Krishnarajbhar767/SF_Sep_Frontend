import React from "react";
import { Link } from 'react-router-dom'

import { useHomeOneImageOnly } from "../../../../hooks/useHomeOneImageOnly";
function HomeOneImageOnly() {
    const data = useHomeOneImageOnly()
    console.log('Data  Of Image ONLY', data)
    return (
        <div className="h-[300px] md:h-[550px] w-full boxedContainer py-4 sm:px-8 overflow-hidden">
            <Link to={data?.slug}>
                <img
                    src={data?.image}
                    className="object-cover h-full w-full cursor-pointer sm:px-8"
                    alt="background"
                />
            </Link>
        </div>
    );
}

export default HomeOneImageOnly;
