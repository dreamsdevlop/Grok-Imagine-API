import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import GlowCard from "@/components/GlowCard";
import EmptyState from "@/components/EmptyState";
import ImageGrid from "@/components/ImageGrid";
import { useImageGenerations } from "@/hooks/use-images";
import { Link, useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, ImageIcon, Search, ChevronRight, XCircle } from "lucide-react";

function toDate(createdAt: unknown) {
  const d = createdAt instanceof Date ? createdAt : new Date(String(createdAt));
  return isNaN(d.getTime()) ? new Date() : d;
}

export default function History() {
  const [loc, setLoc] = useLocation();
  const { data, isLoading, isError, error, refetch } = useImageGenerations();
  const [q, setQ] = useState("");

  const selectedId = useMemo(() => {
    const m = loc.match(/^\/history\/([^/]+)$/);
    return m?.[1] ?? null;
  }, [loc]);

  const items = useMemo(() => {
    const list = data ?? [];
    const query = q.trim().toLowerCase();
    const filtered =
      query.length === 0
        ? list
        : list.filter((it) => {
            const s = `${it.prompt} ${it.model} ${it.size}`.toLowerCase();
            return s.includes(query);
          });

    return filtered
      .slice()
      .sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime());
  }, [data, q]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return (data ?? []).find((x) => x.id === selectedId) ?? null;
  }, [data, selectedId]);

  return (
    <AppShell>
      <Seo
        title="Imagine Studio — History"
        description="Browse your generation history. Filter by prompt or model, and open any run to view its images."
      />

      <TopBar
        title={
          <span>
            Generation <span className="text-gradient">history</span>
          </span>
        }
        subtitle="A curated ledger of your prompts, models, and outputs."
        right={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 ring-focus"
              onClick={() => refetch()}
            >
              Refresh
            </Button>
            <Button
              type="button"
              className="rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_18px_55px_rgba(0,0,0,.55)] hover:-translate-y-0.5 transition-all ring-focus"
              onClick={() => setLoc("/")}
            >
              New generation
            </Button>
          </div>
        }
      />

      <main className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6 lg:gap-8 items-start">
          <GlowCard className="p-5 sm:p-6 lg:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg sm:text-xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
                  Library
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search prompts, then open any card to inspect.
                </p>
              </div>
              <Badge className="rounded-full border border-white/10 bg-white/5 text-foreground/85">
                {items.length} item{items.length === 1 ? "" : "s"}
              </Badge>
            </div>

            <div className="mt-5 flex items-center gap-2">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by prompt, model, size…"
                  className={cn(
                    "h-11 pl-10 pr-10 rounded-2xl",
                    "bg-white/[0.03] border-white/10",
                    "focus-visible:ring-4 focus-visible:ring-ring/20 focus-visible:border-primary/40",
                  )}
                />
                {q.length > 0 ? (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setQ("")}
                    aria-label="Clear search"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            <Separator className="my-5 bg-white/10" />

            <div className="pretty-scroll max-h-[60vh] overflow-auto pr-1">
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-12 w-12 rounded-2xl bg-white/5" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4 bg-white/5" />
                          <Skeleton className="h-3 w-1/2 bg-white/5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <EmptyState
                  icon={<ImageIcon className="h-6 w-6 text-destructive" />}
                  title="Couldn’t load history"
                  description={(error as Error)?.message ?? "Unknown error"}
                >
                  <Button
                    type="button"
                    className="rounded-2xl"
                    onClick={() => refetch()}
                  >
                    Try again
                  </Button>
                </EmptyState>
              ) : items.length === 0 ? (
                <EmptyState
                  icon={<Clock className="h-6 w-6 text-primary" />}
                  title="No generations found"
                  description={
                    q.trim()
                      ? "No results match your search. Try fewer keywords."
                      : "Your history will appear here after you generate your first image."
                  }
                >
                  <Button
                    type="button"
                    className="rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    onClick={() => setLoc("/")}
                  >
                    Generate now
                  </Button>
                </EmptyState>
              ) : (
                <div className="space-y-3">
                  {items.map((it) => {
                    const when = formatDistanceToNow(toDate(it.createdAt), { addSuffix: true });
                    const isSelected = selectedId === it.id;
                    const thumb = it.images?.[0];

                    return (
                      <button
                        key={it.id}
                        data-testid={`card-history-${it.id}`}
                        type="button"
                        onClick={() => setLoc(`/history/${it.id}`)}
                        className={cn(
                          "w-full text-left rounded-3xl p-4",
                          "border transition-all duration-200",
                          isSelected
                            ? "border-primary/40 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/.20),transparent_55%)]"
                            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:-translate-y-[1px]",
                          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/20",
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            {thumb ? (
                              <img
                                src={`data:${thumb.mimeType};base64,${thumb.dataBase64}`}
                                alt="Thumbnail"
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center">
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-sm font-semibold text-foreground/95">
                              {it.prompt}
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                                {it.model}
                              </span>
                              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                                {it.size}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {when}
                              </span>
                            </div>
                          </div>

                          <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </GlowCard>

          <GlowCard className="p-5 sm:p-6 lg:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg sm:text-xl font-bold" style={{ fontFamily: "var(--font-serif)" }}>
                  Details
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open a generation to view all images.
                </p>
              </div>

              {selected ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Badge className="rounded-full border border-white/10 bg-white/5">
                    {selected.images.length} img
                  </Badge>
                  <Link
                    href="/"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Generate more
                  </Link>
                </div>
              ) : null}
            </div>

            <Separator className="my-5 bg-white/10" />

            {!selected ? (
              <EmptyState
                icon={<ImageIcon className="h-6 w-6 text-primary" />}
                title="Select a generation"
                description="Click a card in the library to preview the full set here."
              />
            ) : (
              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-foreground/95">
                      Prompt
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="rounded-full border border-white/10 bg-white/5">
                        {selected.model}
                      </Badge>
                      <Badge className="rounded-full border border-white/10 bg-white/5">
                        {selected.size}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap">
                    {selected.prompt}
                  </div>
                </div>

                <ImageGrid images={selected.images} testId="grid-images" />

                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 ring-focus"
                    onClick={() => setLoc("/history")}
                  >
                    Back to list
                  </Button>
                  <Button
                    type="button"
                    className="rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-[0_18px_55px_rgba(0,0,0,.55)] hover:-translate-y-0.5 transition-all ring-focus"
                    onClick={() => setLoc("/")}
                  >
                    New generation
                  </Button>
                </div>
              </div>
            )}
          </GlowCard>
        </div>
      </main>
    </AppShell>
  );
}
