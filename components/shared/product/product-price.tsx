import { cn } from "@/lib/utils";

const ProductPrice = ({
  price,
  className,
}: {
  price: number;
  className?: string;
}) => {
  const stringValue = price.toFixed(2);
  const [int, float] = stringValue.split(".");

  return (
    <p className={cn("text-2xl", className)}>
      <span className="text-sm align-super">$</span>
      {int}<span className="text-sm align-super">.{float}</span>
    </p>
  );
};

export default ProductPrice;
