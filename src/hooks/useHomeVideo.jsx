import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const STRAPI_BACKEND_URL = import.meta.env.VITE_HOME_API

async function fetchData() {
    const res = await fetch(`${STRAPI_BACKEND_URL}/section3`);
    // If Resposne is Not Success Then throw error
    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
    // Destructuring  Data From Response Array
    const data = await res.json();
    // Forammatting Data For Return 
    const dataToReturn = {
        heading: data.heading,
        subHeading: data.subHeading,
        video: data.video
    }
    return dataToReturn;

}


export function useHomeVideo() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['home-video'],
        queryFn: fetchData,

        placeholderData: {
            heading: 'Loading...',
            subHeading: "Loading...",
            video: ''
        }
    })

    const returningData = useMemo(() => data, [data])
    return returningData
}