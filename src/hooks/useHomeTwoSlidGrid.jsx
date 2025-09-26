import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const STRAPI_BACKEND_URL = import.meta.env.VITE_HOME_API
async function fetchData() {
    const res = await fetch(`${STRAPI_BACKEND_URL}/section7`);
    // If Resposne is Not Success Then throw error
    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
    // Destructuring  Data From Response Array
    const data = await res.json();
    console.log('Data That  I got For API Call', data)
    // Forammatting Data For Return
    const dataToReturn = data?.map((itm) => ({
        heading: itm.heading,
        paragraph: itm.paragraph,
        slugText: itm.slugText,
        slug: itm.slug,
        image: itm.image

    }))
    return dataToReturn;

}


export function useHomeTwoSlidGrid() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['home-two-slid-grid'],
        queryFn: fetchData,
        retry: 3,
        placeholderData: [{
            heading: "Loading...",
            paragraph: "Loading...",
            slugText: "Loading...",
            slug: "#",
            image: "Product_Placeholder.webp"
        }, {
            heading: "Loading...",
            paragraph: "Loading...",
            slugText: "Loading...",
            slug: "#",
            image: "Product_Placeholder.webp"
        }]
    })
    const returningData = useMemo(() => data, [data])
    return returningData
}