
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Knowledge from "./pages/Knowledge";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import EventDetail from "./pages/EventDetail";
import KnowledgeDetail from "./pages/KnowledgeDetail";
import KnowledgeCatalog from "./pages/KnowledgeCatalog";
import { useState } from "react";

const App = () => {
  // Create a client instance that persists across renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/knowledge/catalog" element={<KnowledgeCatalog />} />
            <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
