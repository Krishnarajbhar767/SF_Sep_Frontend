import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchSlides = async () => {
    const STRAPI_BACKEND_URL = import.meta.env.VITE_STRAPI_BACKEND
    const res = await fetch(`${STRAPI_BACKEND_URL}/api/hero-slide1s?populate=*`);
    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

    const apiRes = await res.json();

    // Simplify data: only heading, paragraph, slug, image
    return apiRes.data.map(slide => ({
        heading: slide.heading,
        paragraph: slide.paragraph,
        slug: slide.slug,
        top: slide.top,
        image: slide.image?.url || '', // direct Cloudinary URL
    }));
};

export const useHeroSlides = () => {
    const { data: slides = [], isLoading, isError, error } = useQuery({
        queryKey: ['hero-slides'],
        queryFn: fetchSlides,
        staleTime: 1000 * 60 * 10, // 10 min cache
        cacheTime: 1000 * 60 * 30, // 1 hour in memory
    });

    // Separate slides into top and non-top
    const sliderData1 = useMemo(() => slides?.filter(slide => slide.top), [slides]);
    const sliderData2 = useMemo(() => slides?.filter(slide => !slide.top), [slides]);

    return { sliderData1, sliderData2, isLoading, isError, error };
};
