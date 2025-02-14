
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminInit() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check current auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: isAdmin } = await supabase.rpc('is_admin_user');
        if (!isAdmin) {
          // For first admin creation, we don't redirect non-admins
          const { count } = await supabase
            .from('admins')
            .select('*', { count: 'exact', head: true });
          
          if (count && count > 0) {
            toast({
              title: "Unauthorized",
              description: "You must be an admin to create new admin users.",
              variant: "destructive",
            });
            navigate('/admin/login');
          }
        }
        setCurrentUser(session.user.email || null);
      }
    };
    checkAuth();
  }, [navigate, toast]);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First create the auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error("Failed to create user");

      // Check if this is the first admin
      const { count } = await supabase
        .from('admins')
        .select('*', { count: 'exact', head: true });

      let success;
      if (!count || count === 0) {
        // Create first admin using the security definer function
        const { data: created, error: firstAdminError } = await supabase
          .rpc('create_first_admin', {
            admin_email: newAdminEmail
          });
        
        if (firstAdminError) {
          console.error("First admin creation error:", firstAdminError);
          throw firstAdminError;
        }
        
        success = created;
      } else {
        // Create subsequent admin using the other function
        const { data: created, error: adminError } = await supabase
          .rpc('create_admin', {
            admin_email: newAdminEmail,
            creator_email: currentUser
          });
        
        if (adminError) {
          console.error("Admin creation error:", adminError);
          throw adminError;
        }
        
        success = created;
      }

      if (!success) {
        throw new Error("Failed to create admin record");
      }

      // Sign in the user immediately after creation
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: newAdminEmail,
        password: newAdminPassword,
      });

      if (signInError) throw signInError;

      toast({
        title: "Success",
        description: "New admin user created successfully.",
      });

      // Clear the form
      setNewAdminEmail("");
      setNewAdminPassword("");
      
      // Redirect to dashboard
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error("Full error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create New Admin User
          </h2>
          {currentUser ? (
            <p className="mt-2 text-center text-sm text-gray-600">
              Logged in as: <span className="font-semibold">{currentUser}</span>
            </p>
          ) : (
            <p className="mt-2 text-center text-sm text-gray-600">
              Please <a href="/admin/login" className="text-blue-600 hover:text-blue-500">log in</a> first
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSetup}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="newAdminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                New Admin Email
              </label>
              <Input
                id="newAdminEmail"
                type="email"
                required
                placeholder="New admin email address"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="newAdminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Admin Password
              </label>
              <Input
                id="newAdminPassword"
                type="password"
                required
                placeholder="Set password for new admin"
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create New Admin"}
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
