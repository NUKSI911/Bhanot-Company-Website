"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const ProductImages = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <Image
        className="min-h-[300px] object-cover object-center"
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
      />
      <div className="flex gap-4">
        {images.map((image, index) => (
          <div
            className={cn("cursor-pointer border hover:border-orange-600 rounded overflow-clip",index === current && "border-orange-500")}
            key={index}
            onClick={() => setCurrent(index)}
          >
            <Image src={image} alt="image" className="" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
