
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminInit() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if the email exists in admins table
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select()
        .eq('email', email)
        .maybeSingle();

      if (adminError) {
        throw new Error('Error checking admin access');
      }

      if (!adminData) {
        throw new Error('This email is not authorized for admin access');
      }

      // Try to create the auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            is_admin: true
          }
        }
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Success",
        description: "Admin user created successfully. Please log in.",
      });

      navigate('/admin/login');
    } catch (error: any) {
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
            Initialize Admin User
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create your admin account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleInit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <Input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating admin user..." : "Create Admin User"}
          </Button>
        </form>
      </div>
    </div>
  );
}
