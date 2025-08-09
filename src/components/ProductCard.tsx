import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import type { Product } from "@/data/incubatees";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

export const ProductCard: React.FC<{ product: Product; incubateeName: string }> = ({ product, incubateeName }) => {
  const { add } = useCart();

  const onAdd = () => {
    add(product);
    toast({ title: "Added to cart", description: `${product.name} added.` });
  };

  return (
    <Card className="group h-full overflow-hidden">
      <div className="relative">
        <img
          src={product.image}
          alt={`${product.name} by ${incubateeName}`}
          loading="lazy"
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="secondary">{product.category}</Badge>
        </div>
      </div>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold leading-tight">{product.name}</h3>
            <Link to={`/incubatees/${product.incubateeSlug}`} className="text-sm text-muted-foreground hover:text-foreground">
              {incubateeName}
            </Link>
          </div>
          <div className="text-right font-semibold">₦{product.price.toLocaleString()}</div>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onAdd}>Add to Cart</Button>
          <Link to={`/incubatees/${product.incubateeSlug}`}>
            <Button variant="outline">View</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
