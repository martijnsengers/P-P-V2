
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      // First check if the user exists and email is verified
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers();
      
      const userExists = users?.find(user => user.email === email);
      
      if (!userExists) {
        throw new Error('No admin account found with this email');
      }

      if (!userExists.email_confirmed_at) {
        throw new Error('Please check your email and verify your account before logging in');
      }

      // Then try to sign in
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      // Then check if the user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admins')
        .select('email, id')
        .eq('email', email)
        .maybeSingle();

      if (adminError) {
        throw new Error('Error checking admin credentials');
      }

      if (!adminData) {
        // If the user exists but is not an admin, sign them out
        await supabase.auth.signOut();
        throw new Error('User is not authorized as admin');
      }

      // Store admin session
      localStorage.setItem('adminSession', JSON.stringify({ 
        email: adminData.email,
        id: adminData.id
      }));

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || 'Invalid login credentials',
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
            Admin Portal
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please sign in with your admin credentials
          </p>
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

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
