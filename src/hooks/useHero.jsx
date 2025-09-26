import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

const fetchSlides = async () => {

    const STRAPI_BACKEND_URL = import.meta.env.VITE_HOME_API
    const res = await fetch(`${STRAPI_BACKEND_URL}/slider`);
    if (!res.ok) throw new Error(`Error: ${res.status} ${res.statusText}`);

    const apiRes = await res.json();
    console.log('APi Response', apiRes)
    // Simplify data: only heading, paragraph, slug, image
    return apiRes.map(slide => ({
        heading: slide.heading,
        paragraph: slide.paragraph,
        slug: slide.slug,
        top: slide.top,
        image: slide.image
    }));
};

export const useHeroSlides = () => {
    const { data: slides = [], isLoading, isError, error } = useQuery({
        queryKey: ['hero-slides'],
        queryFn: fetchSlides,

    });

    // Separate slides into top and non-top
    const sliderData1 = useMemo(() => slides?.filter(slide => slide.top), [slides]);
    const sliderData2 = useMemo(() => slides?.filter(slide => !slide.top), [slides]);

    return { sliderData1, sliderData2, isLoading, isError, error };
};
