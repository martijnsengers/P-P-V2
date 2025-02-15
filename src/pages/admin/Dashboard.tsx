
import { useEffect, useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/admin/login');
        return;
      }

      // Use the RPC function instead of direct table query
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('check_admin_access');

      if (adminError || !isAdmin) {
        throw new Error('Unauthorized access');
      }

      setIsAdmin(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unauthorized access",
        variant: "destructive",
      });
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center">
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Link to="/admin/workshops">
              <div className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-900">Workshops</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage workshops, create new ones, and control access codes
                </p>
              </div>
            </Link>
            
            <Link to="/admin/gallery">
              <div className="bg-white overflow-hidden shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-900">User Gallery</h3>
                <p className="mt-2 text-sm text-gray-500">
                  View submitted organisms and generated images
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
