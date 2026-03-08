import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest">
              Mercenary
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Strength Unseen. Minimal tactical clothing for those who move in silence.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Navigation
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/home" className="transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="transition-colors hover:text-foreground">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide">
              Follow Us
            </h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Mercenary. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
