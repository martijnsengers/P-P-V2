
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreateWorkshopForm } from "./components/CreateWorkshopForm";
import { WorkshopsTable } from "./components/WorkshopsTable";
import { useToast } from "@/hooks/use-toast";
import type { Workshop } from "./types";

export default function WorkshopsPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const adminEmail = localStorage.getItem('adminEmail');
      
      if (!adminEmail) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select()
        .eq('email', adminEmail)
        .single();

      if (adminError) {
        console.error('Admin check error:', adminError);
        throw new Error('Unauthorized access');
      }

      if (!adminData) {
        throw new Error('Admin not found');
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        title: "Error",
        description: "Unauthorized access",
        variant: "destructive",
      });
      localStorage.removeItem('adminEmail'); // Clear invalid session
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  // Fetch workshops using our custom admin auth
  const { data: workshops, isLoading: isLoadingWorkshops } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const adminEmail = localStorage.getItem('adminEmail');
      if (!adminEmail) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Workshop[];
    },
    enabled: isAdmin, // Only run query when admin is authenticated
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    navigate("/admin/login");
    return null;
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

        {isLoadingWorkshops ? (
          <div>Loading workshops...</div>
        ) : (
          <>
            <CreateWorkshopForm />
            <WorkshopsTable workshops={workshops || []} />
          </>
        )}
      </div>
    </div>
  );
}
