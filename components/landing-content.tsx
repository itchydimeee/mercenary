import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingContent() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 text-center">
      {/* Logo / Brand */}
      <h1 className="text-4xl font-bold uppercase tracking-[0.2em] xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
        Mercenary
      </h1>

      {/* Tagline */}
      <p className="mt-4 text-lg text-muted-foreground sm:text-xl md:text-2xl">
        Strength Unseen
      </p>

      {/* CTA */}
      <Link href="/home" className="mt-10">
        <Button size="lg" className="gap-2 rounded-md px-8 py-6 text-base font-semibold uppercase tracking-wide">
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
    </main>
  );
}
