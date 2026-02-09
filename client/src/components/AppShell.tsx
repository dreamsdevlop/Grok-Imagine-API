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
  LayoutDashboard,
  MessageSquare,
  Video,
  Wand2,
  FolderOpen,
  Box,
  Settings,
  HelpCircle,
  BarChart3,
  Swords,
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
          <span className="text-gradient font-serif uppercase tracking-tighter">
            STUDIO
          </span>
        </div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">Multi-Model AI</div>
      </div>
    </div>
  );
}

export default function AppShell({ children }: PropsWithChildren) {
  const [loc] = useLocation();
  const active = useMemo(() => {
    if (loc === "/") return "dashboard";
    if (loc === "/generator") return "generator";
    if (loc === "/chat") return "chat";
    if (loc === "/video") return "video";
    if (loc === "/history") return "history";
    if (loc === "/projects") return "projects";
    if (loc === "/tools") return "tools";
    if (loc === "/models") return "models";
    if (loc === "/settings") return "settings";
    if (loc === "/analytics") return "analytics";
    if (loc === "/comparison") return "comparison";
    return "";
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
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 mb-2 px-3">
                Overview
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "dashboard"}
                      tooltip="Dashboard"
                    >
                      <Link href="/" className="group">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 mb-2 px-3">
                Studio Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "generator"}
                      tooltip="Images"
                    >
                      <Link href="/generator" className="group">
                        <ImageIcon className="h-4 w-4" />
                        <span>Images</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "chat"}
                      tooltip="AI Chat"
                    >
                      <Link href="/chat" className="group">
                        <MessageSquare className="h-4 w-4" />
                        <span>AI Chat</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "video"}
                      tooltip="Video Engine"
                    >
                      <Link href="/video" className="group">
                        <Video className="h-4 w-4" />
                        <span>Video</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "comparison"}
                      tooltip="Model Battleground"
                    >
                      <Link href="/comparison" className="group">
                        <Swords className="h-4 w-4" />
                        <span>Battleground</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "tools"}
                      tooltip="AI Toolkit"
                    >
                      <Link href="/tools" className="group text-muted-foreground">
                        <Wand2 className="h-4 w-4" />
                        <span>Toolkit</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 mb-2 px-3">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "projects"}
                      tooltip="Projects"
                    >
                      <Link href="/projects" className="group">
                        <FolderOpen className="h-4 w-4" />
                        <span>Projects</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "models"}
                      tooltip="Model Shelf"
                    >
                      <Link href="/models" className="group text-muted-foreground">
                        <Box className="h-4 w-4" />
                        <span>Marketplace</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "analytics"}
                      tooltip="Usage Statistics"
                    >
                      <Link href="/analytics" className="group">
                        <BarChart3 className="h-4 w-4" />
                        <span>Analytics</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "history"}
                      tooltip="History"
                    >
                      <Link href="/history" className="group">
                        <History className="h-4 w-4" />
                        <span>History List</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground/60 mb-2 px-3">
                System
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={active === "settings"}
                      tooltip="Configuration"
                    >
                      <Link href="/settings" className="group">
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      tooltip="Documentation"
                    >
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-white/40 cursor-not-allowed">
                        <HelpCircle className="h-4 w-4" />
                        <span>Help</span>
                      </div>
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
