
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminInit from "./pages/AdminInit";
import AdminDashboard from "./pages/admin/Dashboard";
import WorkshopsPage from "./pages/admin/workshops";
import GalleryPage from "./pages/admin/gallery";
import UploadPage from "./pages/admin/upload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/init" element={<AdminInit />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/workshops" element={<WorkshopsPage />} />
          <Route path="/admin/gallery" element={<GalleryPage />} />
          <Route path="/admin/upload" element={<UploadPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
