import { PropsWithChildren, useMemo } from "react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  History,
  ImageIcon,
  Sparkles,
  ExternalLink,
  Github,
  Keyboard,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          "relative grid h-10 w-10 place-items-center rounded-2xl",
          "bg-gradient-to-br from-primary/25 via-primary/10 to-accent/20",
          "ring-1 ring-white/10 shadow-[0_18px_55px_rgba(0,0,0,.55)]",
        )}
      >
        <Sparkles className="h-5 w-5 text-primary" />
        <div className="pointer-events-none absolute -inset-1 rounded-[18px] bg-gradient-to-br from-primary/25 to-accent/20 blur-xl opacity-70" />
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-semibold tracking-tight">
          <span className="text-gradient" style={{ fontFamily: "var(--font-serif)" }}>
            Imagine Studio
          </span>
        </div>
        <div className="text-xs text-muted-foreground">Grok-style generations</div>
      </div>
    </div>
  );
}

export default function AppShell({ children }: PropsWithChildren) {
  const [loc] = useLocation();
  const active = useMemo(() => {
    if (loc.startsWith("/history")) return "history";
    return "generator";
  }, [loc]);

  return (
    <div className="min-h-dvh bg-aurora grain">
      <SidebarProvider defaultOpen>
        <Sidebar className="border-sidebar-border/80 bg-sidebar/40 backdrop-blur-xl">
          <SidebarHeader className="px-3 py-4">
            <div className="flex items-center justify-between gap-3">
              <Brand />
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarTrigger
                    className={cn(
                      "ring-focus",
                      "rounded-xl border border-white/10 bg-white/5 shadow-sm",
                      "hover:bg-white/8 transition-colors",
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>Toggle sidebar</TooltipContent>
              </Tooltip>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] tracking-widest text-muted-foreground/90">
                Workspace
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "generator"}
                      tooltip="Generator"
                    >
                      <Link
                        href="/"
                        data-testid="link-generator"
                        className="group"
                      >
                        <ImageIcon className="h-4 w-4" />
                        <span>Generator</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "history"}
                      tooltip="History"
                    >
                      <Link href="/history" data-testid="link-history">
                        <History className="h-4 w-4" />
                        <span>History</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="px-2 py-4">
              <div className="surface-glass rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 ring-1 ring-white/10">
                    <Keyboard className="h-4 w-4 text-primary/90" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">Pro tips</div>
                    <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                      <li>Use vivid nouns + lighting + lens.</li>
                      <li>Try: “editorial”, “macro”, “cinematic”.</li>
                      <li>Generate 2–4 then curate.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <div className="surface-glass rounded-2xl p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold">Local build</div>
                  <div className="text-[11px] text-muted-foreground">
                    API via <span className="text-foreground/90">/api</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 ring-focus"
                        onClick={() => window.open("https://rapidapi.com/", "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>RapidAPI</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 ring-focus"
                        onClick={() => window.open("https://github.com/", "_blank")}
                      >
                        <Github className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Repo</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Separator className="my-3 bg-white/10" />
              <div className="text-[11px] text-muted-foreground">
                Crafted UI •{" "}
                <span className="text-foreground/80">Imagine Studio</span>
              </div>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset className="relative z-[1]">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
