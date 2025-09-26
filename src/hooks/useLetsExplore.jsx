import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const STRAPI_BACKEND_URL = import.meta.env.VITE_HOME_API
async function fetchData() {
    const res = await fetch(`${STRAPI_BACKEND_URL}/section8`);
    // If Resposne is Not Success Then throw error
    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
    // Destructuring  Data From Response Array
    const data = await res.json();
    // Forammatting Data For Return
    const dataToReturn = {
        heading: data.heading,
        subHeading: data.subHeading,
        title: data.title,
        paragraph: data.paragraph,
        btnText: data.btnText,
        btnUrl: data.btnUrl,
        image: data.image
    }
    return dataToReturn;

}


export function useLetsExplore() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['lets-explore'],
        queryFn: fetchData,
        retry: 3,
        placeholderData: {
            heading: "Loading...",
            subHeading: "Loading...",
            title: "Loading...",
            paragraph: "Loading...",
            btnText: "Loading...",
            btnUrl: "#",
            image: "Product_Placeholder.webp"
        }
    })
    const returningData = useMemo(() => data, [data])
    return returningData
}