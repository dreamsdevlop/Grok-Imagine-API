import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Generator from "@/pages/Generator";
import Chat from "@/pages/Chat";
import VideoGenerator from "@/pages/VideoGenerator";
import History from "@/pages/History";
import HistoryDetail from "@/pages/HistoryDetail";
import Dashboard from "@/pages/Dashboard";
import Models from "./pages/Models";
import Projects from "./pages/Projects";
import Tools from "./pages/Tools";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import ModelComparison from "./pages/ModelComparison";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/generator" component={Generator} />
      <Route path="/chat" component={Chat} />
      <Route path="/video" component={VideoGenerator} />
      <Route path="/history" component={History} />
      <Route path="/history/:id" component={HistoryDetail} />
      <Route path="/tools" component={Tools} />
      <Route path="/projects" component={Projects} />
      <Route path="/models" component={Models} />
      <Route path="/settings" component={Settings} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/comparison" component={ModelComparison} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
