"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

const ProductCarousel = ({ data }: { data: Product[] }) => {
  return (
    <Carousel
      className="w-full mb-12"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: 2000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((x) => (
          <CarouselItem key={x.id}>
            <Link href={`/product/${x.slug}`}>
              <Image
                src={`/images/${x.banner}`}
                alt={x.name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 flex items-end justify-center">
                <h2 className="bg-gray-900 bg-opacity-50 text-2xl font-bold px-2 text-white">
                  {x.name}
                </h2>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext />
      <CarouselPrevious />
    </Carousel>
  );
};

export default ProductCarousel;
