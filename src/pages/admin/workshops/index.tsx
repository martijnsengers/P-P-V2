
import { useEffect } from "react";
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

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/admin/login");
          return;
        }

        // Verify admin access
        const { data: isAdmin, error: adminError } = await supabase
          .rpc('check_admin_access');

        if (adminError || !isAdmin) {
          throw new Error('Unauthorized access');
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
        navigate("/admin/login");
      }
    };
    checkAuth();
  }, [navigate, toast]);

  // Fetch workshops
  const { data: workshops, isLoading } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Workshop[];
    },
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
