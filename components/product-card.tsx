import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden rounded-xl border transition-all hover:scale-[1.03] hover:shadow-lg">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <p className="text-sm">No Image</p>
          </div>
        )}
      </div>

      <CardContent className="space-y-2 p-4">
        <h3 className="font-bold">{product.name}</h3>
        <p className="text-lg font-semibold">₱{product.price.toLocaleString()}</p>
        <Link href={`/shop/${product.id}`}>
          <Button variant="outline" className="mt-2 w-full">
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
