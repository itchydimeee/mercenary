"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/types";

interface ProductDetailContentProps {
  productId: string;
  isAuthed: boolean;
}

export function ProductDetailContent({ productId, isAuthed }: ProductDetailContentProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-muted/30" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-muted/30" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-muted/30" />
            <div className="h-20 animate-pulse rounded bg-muted/30" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p className="mt-2 text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/shop" className="mt-6">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Back */}
      <Link href="/shop" className="mb-8 inline-flex">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Button>
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted/30">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <p>No Image</p>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-3xl font-bold uppercase tracking-wide sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-2xl font-semibold">
            ₱{product.price.toLocaleString()}
          </p>
          <p className="text-muted-foreground">
            Stock: {product.stock > 0 ? product.stock : "Out of stock"}
          </p>

          <Separator />

          <p className="leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide">
                Available Sizes
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Badge key={size} variant="outline" className="px-3 py-1">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Message Admin */}
          {isAuthed ? (
            <Link href={`/contact?product=${product.id}`}>
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                <MessageCircle className="h-5 w-5" />
                Message Admin
              </Button>
            </Link>
          ) : (
            <Link href={`/login?next=/shop/${product.id}`}>
              <Button size="lg" variant="outline" className="w-full gap-2 sm:w-auto">
                <MessageCircle className="h-5 w-5" />
                Sign in to Message Admin
              </Button>
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
