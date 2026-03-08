"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactContentProps {
  user: { name: string; email: string } | null;
}

export function ContactContent({ user }: ContactContentProps) {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          product_id: productId || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      setSubmitted(true);
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold uppercase tracking-wide">
        Got Questions?
      </h1>
      <p className="mb-8 text-muted-foreground">
        Send us a message and we&apos;ll get back to you.
      </p>

      {submitted ? (
        <div className="rounded-xl border border-border p-8 text-center">
          <h2 className="text-xl font-semibold">Message Sent!</h2>
          <p className="mt-2 text-muted-foreground">
            We&apos;ll get back to you as soon as possible.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setSubmitted(false)}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {productId && (
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              📦 Regarding product: <span className="font-medium">{productId}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like to ask?"
              rows={5}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
      )}
    </main>
  );
}
