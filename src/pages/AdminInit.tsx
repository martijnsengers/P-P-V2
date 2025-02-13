
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

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First check if any admin exists
      const { data: existingAdmins, error: checkError } = await supabase
        .from('admins')
        .select('id')
        .limit(1);

      if (checkError) throw checkError;
      
      if (existingAdmins && existingAdmins.length > 0) {
        throw new Error("An admin account already exists. Please use the login page.");
      }

      // Create the auth user
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!user) throw new Error("Failed to create user");

      // Create the admin record
      const { error: adminError } = await supabase
        .from('admins')
        .insert([
          { email: email }
        ]);

      if (adminError) {
        // If admin creation fails, try to clean up the auth user
        await supabase.auth.admin.deleteUser(user.id);
        throw adminError;
      }

      // Sign out after successful setup
      await supabase.auth.signOut();

      toast({
        title: "Admin setup complete",
        description: "You can now log in with your credentials.",
      });

      navigate('/admin/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      // Ensure user is signed out on any error
      await supabase.auth.signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Initial Admin Setup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Set up your admin account password
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSetup}>
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
                placeholder="Set your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Setting up..." : "Complete Setup"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
