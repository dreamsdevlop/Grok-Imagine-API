import { useEffect } from "react";
import { useParams } from "wouter";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import TopBar from "@/components/TopBar";
import GlowCard from "@/components/GlowCard";
import EmptyState from "@/components/EmptyState";
import ImageGrid from "@/components/ImageGrid";
import CopyButton from "@/components/CopyButton";
import { useImageGeneration } from "@/hooks/use-images";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import { ImageIcon, AlertTriangle, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

function toDate(createdAt: unknown) {
  const d = createdAt instanceof Date ? createdAt : new Date(String(createdAt));
  return isNaN(d.getTime()) ? new Date() : d;
}

export default function HistoryDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLoc] = useLocation();
  const q = useImageGeneration(id);

  useEffect(() => {
    // if id missing, bounce
    if (!id) setLoc("/history");
  }, [id, setLoc]);

  return (
    <AppShell>
      <Seo
        title="Imagine Studio — Generation detail"
        description="View a single generation: prompt, model, size, and the full image set."
      />

      <TopBar
        title={
          <span>
            Generation <span className="text-gradient">detail</span>
          </span>
        }
        subtitle="A focused view for one run—perfect for reviewing outputs."
        right={
          <Button
            type="button"
            variant="secondary"
            className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 ring-focus"
            onClick={() => setLoc("/history")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        }
      />

      <main className="relative z-[1] max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <GlowCard className="p-5 sm:p-6 lg:p-7">
          {q.isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-7 w-1/2 bg-white/5" />
              <Skeleton className="h-4 w-3/4 bg-white/5" />
              <Separator className="my-2 bg-white/10" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="aspect-square rounded-3xl bg-white/5" />
                <Skeleton className="aspect-square rounded-3xl bg-white/5" />
              </div>
            </div>
          ) : q.isError ? (
            <EmptyState
              icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
              title="Failed to load"
              description={(q.error as Error)?.message ?? "Unknown error"}
            >
              <Button
                type="button"
                className="rounded-2xl"
                onClick={() => q.refetch()}
              >
                Try again
              </Button>
            </EmptyState>
          ) : !q.data ? (
            <EmptyState
              icon={<ImageIcon className="h-6 w-6 text-muted-foreground" />}
              title="Not found"
              description="This generation doesn’t exist (or was deleted)."
            >
              <Button
                type="button"
                className="rounded-2xl"
                onClick={() => setLoc("/history")}
              >
                Back to history
              </Button>
            </EmptyState>
          ) : (
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl">Prompt</div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {format(toDate(q.data.createdAt), "PPpp")}
                  </p>
                </div>
                <CopyButton text={q.data.prompt} />
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full border border-white/10 bg-white/5">
                    {q.data.model}
                  </Badge>
                  <Badge className="rounded-full border border-white/10 bg-white/5">
                    {q.data.size}
                  </Badge>
                  <Badge className="rounded-full border border-white/10 bg-white/5">
                    {q.data.images.length} img
                  </Badge>
                </div>
                <div className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                  {q.data.prompt}
                </div>
              </div>

              <ImageGrid images={q.data.images} testId="grid-images" />

              {q.data.error ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm">
                  <div className="font-semibold text-destructive">Server error</div>
                  <div className="mt-1 text-muted-foreground">{q.data.error}</div>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 ring-focus"
                  onClick={() => setLoc("/history")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to history
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
      </main>
    </AppShell>
  );
}
