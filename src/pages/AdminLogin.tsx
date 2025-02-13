
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First sign in the user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!signInData.user) throw new Error('Login failed');

      console.log('Auth successful, checking admin status via RPC');

      // Check if the user is an admin using our security definer RPC function
      const { data: isAdmin, error: adminCheckError } = await supabase
        .rpc('check_is_admin', { user_email: email });

      console.log('Admin check result:', { isAdmin, adminCheckError });

      if (adminCheckError) {
        console.error('Admin check error:', adminCheckError);
        // Sign out if there was an error checking admin status
        await supabase.auth.signOut();
        throw new Error(`Failed to verify admin status: ${adminCheckError.message}`);
      }

      if (!isAdmin) {
        // If not an admin, sign out and throw error
        await supabase.auth.signOut();
        throw new Error('Unauthorized access. Only admins can login here.');
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
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
            Admin Login
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
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

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link 
            to="/admin/init" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            First time setup? Click here
          </Link>
        </div>
      </div>
    </div>
  );
}
