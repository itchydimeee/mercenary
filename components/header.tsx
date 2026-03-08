"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navLinks = [
  { href: "/home", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

interface HeaderProps {
  user: { name: string; email: string; profile_picture: string } | null;
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors ${
        isLanding
          ? "border-transparent bg-transparent"
          : "border-border bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href={user ? "/home" : "/"} className="text-xl font-bold uppercase tracking-widest">
          Mercenary
        </Link>

        {/* Desktop Nav */}
        {user && (
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium uppercase tracking-wide transition-colors hover:text-foreground ${
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {user ? (
            <Link href="/profile">
              <Button variant="ghost" size="icon" aria-label="Profile">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="hidden sm:inline-flex">
                Get Started
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          {user && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground md:hidden" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </span>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="mt-8 flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`text-lg font-medium uppercase tracking-wide transition-colors hover:text-foreground ${
                        pathname === link.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}
