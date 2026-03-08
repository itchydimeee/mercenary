"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function MessagesContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/messages")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load messages");
        return res.json();
      })
      .then(setMessages)
      .catch(() => setError("Failed to load messages. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-wide">Messages</h1>
          <p className="mt-1 text-muted-foreground">Your conversation history with us.</p>
        </div>
        <Link href="/contact">
          <Button className="gap-2">
            <MessageCircle className="h-4 w-4" />
            New Message
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl border border-border bg-muted/30" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && messages.length === 0 && (
        <div className="rounded-xl border border-border p-12 text-center">
          <MessageCircle className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">No messages yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Have a question? Send us a message and we&apos;ll get back to you.
          </p>
          <Link href="/contact" className="mt-6 inline-block">
            <Button variant="outline">Send a Message</Button>
          </Link>
        </div>
      )}

      {!loading && !error && messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="rounded-xl border border-border p-6">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {msg.product && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Package className="h-3.5 w-3.5" />
                      {msg.product.name}
                    </span>
                  )}
                </div>
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

              {/* User message */}
              <div className="mb-3 rounded-lg bg-muted/40 p-4 text-sm">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  You
                </p>
                <p>{msg.message}</p>
              </div>

              {/* Reply */}
              {msg.reply && (
                <div className="rounded-lg border border-border bg-background p-4 text-sm">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Mercenary
                  </p>
                  <p>{msg.reply}</p>
                </div>
              )}

              {!msg.reply && (
                <p className="text-xs text-muted-foreground italic">Awaiting reply…</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
