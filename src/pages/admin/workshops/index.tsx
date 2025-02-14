
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateWorkshopForm } from "./components/CreateWorkshopForm";
import { WorkshopsTable } from "./components/WorkshopsTable";
import { useToast } from "@/hooks/use-toast";
import type { Workshop } from "./types";

export default function WorkshopsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const checkAuth = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return false;
      }

      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_admin_user');

      if (adminError || !isAdmin) {
        throw new Error('Unauthorized access');
      }

      return true;
    } catch (error: any) {
      console.error('Auth check error:', error);
      toast({
        title: "Error",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/admin/login");
      return false;
    }
  }, [navigate, toast]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const { data: workshops, isLoading } = useQuery({
    queryKey: ["workshops"],
    queryFn: async ({ signal }) => {
      const isAuthorized = await checkAuth();
      if (!isAuthorized) {
        throw new Error('Not authorized');
      }

      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Workshops fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to fetch workshops",
          variant: "destructive",
        });
        return [];
      }

      return data as Workshop[];
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Workshops</h1>
          <Button onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <CreateWorkshopForm />
        <WorkshopsTable workshops={workshops || []} />
      </div>
    </div>
  );
}
