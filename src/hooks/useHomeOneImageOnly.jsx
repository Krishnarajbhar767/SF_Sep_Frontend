import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const STRAPI_BACKEND_URL = import.meta.env.VITE_STRAPI_BACKEND
async function fetchData() {
    const res = await fetch(`${STRAPI_BACKEND_URL}/api/section-6-single-image?populate=image`);
    // If Resposne is Not Success Then throw error
    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);
    // Destructuring  Data From Response Array
    const { data } = await res.json();
    // Forammatting Data For Return 
    const dataToReturn = {
        slug: data.slug,
        image: data?.image?.url,

    }
    return dataToReturn;

}


export function useHomeOneImageOnly() {
    const { data } = useQuery({
        queryKey: ['home-single-image'],
        queryFn: fetchData,
        retry: 3,
        placeholderData: {
            slug: '#',
            image: "/Product_Placeholder.webp"
        }

    })
    return data;
}