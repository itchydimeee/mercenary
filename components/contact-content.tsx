"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LogIn, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  message: string;
  reply: string | null;
  status: string;
  created_at: string;
  product: { name: string } | null;
}

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  pending: "secondary",
  replied: "default",
  resolved: "outline",
};

interface ContactContentProps {
  user: { name: string; email: string } | null;
}

export function ContactContent({ user }: ContactContentProps) {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product");

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState("");

  const fetchHistory = useCallback(() => {
    if (!user) return;
    setLoadingHistory(true);
    fetch("/api/messages")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setMessages(data);
        setHistoryError("");
      })
      .catch(() => setHistoryError("Failed to load message history."))
      .finally(() => setLoadingHistory(false));
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name,
          email: user?.email,
          message,
          product_id: productId || null,
        }),
      });

      if (!res.ok) throw new Error();

      setMessage("");
      fetchHistory();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-2 text-3xl font-bold uppercase tracking-wide">Messages</h1>
      <p className="mb-8 text-muted-foreground">
        Send us a message and track your conversation history.
      </p>

      {/* Compose */}
      {!user ? (
        <div className="rounded-xl border border-border p-10 text-center">
          <LogIn className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Sign in to send a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You need to be logged in to contact us.
          </p>
          <Link href="/login" className="mt-6 inline-block">
            <Button>Log In</Button>
          </Link>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            {productId && (
              <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                📦 Regarding product: <span className="font-medium">{productId}</span>
              </div>
            )}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What would you like to ask?"
              rows={4}
              required
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Sending…" : "Send Message"}
            </Button>
          </form>

          {/* History */}
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold uppercase tracking-wide">History</h2>

            {loadingHistory && (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-muted/30" />
                ))}
              </div>
            )}

            {!loadingHistory && historyError && (
              <p className="text-sm text-destructive">{historyError}</p>
            )}

            {!loadingHistory && !historyError && messages.length === 0 && (
              <p className="text-sm text-muted-foreground">No messages yet. Send one above!</p>
            )}

            {!loadingHistory && !historyError && messages.length > 0 && (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="rounded-xl border border-border p-5">
                    <div className="mb-3 flex items-center justify-between">
                      {msg.product ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Package className="h-3.5 w-3.5" />
                          {msg.product.name}
                        </span>
                      ) : <span />}
                      <div className="flex items-center gap-3">
                        <Badge variant={statusVariant[msg.status] ?? "secondary"}>
                          {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="mb-2 rounded-lg bg-muted/40 p-4 text-sm">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">You</p>
                      <p>{msg.message}</p>
                    </div>

                    {msg.reply ? (
                      <div className="rounded-lg border border-border bg-background p-4 text-sm">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Mercenary</p>
                        <p>{msg.reply}</p>
                      </div>
                    ) : (
                      <p className="text-xs italic text-muted-foreground">Awaiting reply…</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
