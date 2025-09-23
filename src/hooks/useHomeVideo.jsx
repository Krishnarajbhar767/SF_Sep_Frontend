import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const STRAPI_BACKEND_URL = import.meta.env.VITE_STRAPI_BACKEND
async function fetchData() {
    const res = await fetch(`${STRAPI_BACKEND_URL}/api/video-section-3?populate=*`);
    // If Resposne is Not Success Then throw error
    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
    // Destructuring  Data From Response Array
    const { data } = await res.json();
    // Forammatting Data For Return 
    const dataToReturn = {
        heading: data.heading,
        subHeading: data.subHeading,
        video: `${STRAPI_BACKEND_URL}${data.video.url}`
    }
    return dataToReturn;

}


export function useHomeVideo() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['home-video'],
        queryFn: fetchData,
        retry: 3,
        placeholderData: {
            heading: 'Loading...',
            subHeading: "Loading...",
            video: ''
        }
    })

    const returningData = useMemo(() => data, [data])
    return returningData
}