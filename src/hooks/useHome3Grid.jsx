import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const STRAPI_BACKEND_URL = import.meta.env.VITE_STRAPI_BACKEND
async function fetchData() {
    const res = await fetch(`${STRAPI_BACKEND_URL}/api/grid-section-2?populate[items][populate]=image`);
    // If Resposne is Not Success Then throw error
    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
    // Destructuring  Data From Response Array
    const { data } = await res.json();
    // Forammatting Data For Return 
    const dataToReturn = {
        heading: data.heading,
        subHeading: data.subHeading,
        items: data?.items?.map((grid) => ({
            title: grid?.title,
            slug: grid?.slug,
            image: grid?.image?.url
        }))
    }
    return dataToReturn;

}


export function useHome3grid() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['home3grid'],
        queryFn: fetchData,
        retry: 5,
        placeholderData: {
            heading: 'Loading...',
            subHeading: "Loading...",
            items: []
        }
    })

    const returningData = useMemo(() => data, [data])
    return returningData
}