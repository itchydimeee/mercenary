import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeaturedProducts } from "@/components/featured-products";

interface HomeContentProps {
  userName: string | null;
}

export function HomeContent({ userName }: HomeContentProps) {
  return (
    <main>
      {/* Hero Section */}
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:px-8">
        {/* Left – Text */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          {userName && (
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Welcome back, {userName}
            </p>
          )}
          <h1 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
            Mercenary
          </h1>
          <p className="text-xl text-muted-foreground sm:text-2xl">
            Strength Unseen.
          </p>
          <p className="max-w-md text-muted-foreground">
            Minimal tactical clothing for those who move in silence. Designed for precision, built for everyday wear.
          </p>
          <Link href="/shop">
            <Button size="lg" className="mt-4 gap-2 rounded-md px-8 py-6 text-base font-semibold uppercase tracking-wide">
              View Collection
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Right – Featured Image Placeholder */}
        <div className="flex flex-1 items-center justify-center">
          <div className="aspect-square w-full max-w-md rounded-xl border border-border bg-muted/30 p-8">
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <p className="text-center text-sm">Featured Product Image</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            Featured Designs
          </h2>
          <Link href="/shop">
            <Button variant="outline" className="gap-2">
              View More
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <FeaturedProducts />
      </section>

      {/* Social Links */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold uppercase tracking-wide">
          Follow Us
        </h2>
        <div className="mt-4 flex items-center justify-center gap-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Facebook
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Instagram
          </a>
        </div>
      </section>
    </main>
  );
}
