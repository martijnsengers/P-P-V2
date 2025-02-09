
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate access code against workshops table
      const { data: workshop, error } = await supabase
        .from("workshops")
        .select("id, status")
        .eq("access_code", accessCode.trim())
        .single();

      if (error || !workshop) {
        toast({
          title: "Error",
          description: "Ongeldige toegangscode. Probeer het opnieuw.",
          variant: "destructive",
        });
        return;
      }

      if (!workshop.status) {
        toast({
          title: "Workshop niet actief",
          description: "Deze workshop is niet meer actief.",
          variant: "destructive",
        });
        return;
      }

      // Generate a unique user ID
      const userId = crypto.randomUUID();

      // Create initial submission record
      const { error: submissionError } = await supabase
        .from("submissions")
        .insert({
          user_id: userId,
          workshop_id: workshop.id,
        });

      if (submissionError) {
        console.error("Error creating submission:", submissionError);
        toast({
          title: "Error",
          description: "Er is een fout opgetreden. Probeer het opnieuw.",
          variant: "destructive",
        });
        return;
      }

      // Navigate to upload page with necessary IDs
      navigate("/admin/upload", {
        state: {
          userId,
          workshopId: workshop.id,
        },
      });

      toast({
        title: "Welkom",
        description: "Je bent succesvol ingelogd bij de workshop.",
      });

    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load font
    const loadFont = async () => {
      try {
        await document.fonts.load("800 1em 'Bricolage Grotesque'");
        await document.fonts.load("400 1em 'Bricolage Grotesque'");
        console.log("Fonts loaded successfully");
      } catch (error) {
        console.error("Error loading fonts:", error);
      }
    };
    loadFont();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#E1E6E0]">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <Header subtitle="Create and explore futuristic plant organisms" />

        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="accessCode"
                className="block text-sm font-medium text-primary"
              >
                Workshop Access Code
              </label>
              <Input
                id="accessCode"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full input-focus"
                placeholder="Enter your access code"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Bezig met inloggen..." : "Enter Workshop"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Index;
