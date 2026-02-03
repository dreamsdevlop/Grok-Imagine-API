import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Generator from "@/pages/Generator";
import History from "@/pages/History";
import HistoryDetail from "@/pages/HistoryDetail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Generator} />
      <Route path="/history" component={History} />
      <Route path="/history/:id" component={HistoryDetail} />
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
