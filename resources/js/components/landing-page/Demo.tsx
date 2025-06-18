'use client';

import Autoplay from 'embla-carousel-autoplay';
import * as React from 'react';
import { Carousel, CarouselContent, CarouselItem } from '../ui/carousel';

const images = ['https://placehold.co/600x400?text=Demo+1', 'https://placehold.co/600x400?text=Demo+2', 'https://placehold.co/600x400?text=Demo+3'];

export function Demo() {
    const plugin = React.useRef(
        Autoplay({
            delay: 2000,
            stopOnInteraction: true,
        }),
    );

    return (
        <Carousel
            plugins={[plugin.current]}
            opts={{
                align: 'center',
                loop: true,
            }}
            className="w-full max-w-lg"
        >
            <CarouselContent>
                {images.map((src, index) => (
                    <CarouselItem key={index}>
                        <img src={src} alt={`Demo ${index + 1}`} className="w-full rounded shadow-lg" />
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
