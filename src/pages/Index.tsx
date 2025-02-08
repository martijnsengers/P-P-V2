
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Leaf } from "lucide-react";

const Index = () => {
  const [accessCode, setAccessCode] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter an access code",
        variant: "destructive",
      });
      return;
    }
    
    // Here we'll later implement proper access code validation
    // For now, we'll just accept any non-empty code
    toast({
      title: "Success",
      description: "Welcome to Planten en Planeten Image Generator",
    });
    
    // Redirect to upload page
    navigate("/admin/upload");
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
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Leaf className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold text-primary">
            Planten en Planeten Image Generator
          </h1>
          <p className="text-base text-muted-foreground">
            Create and explore futuristic plant organisms
          </p>
        </div>

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
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              Enter Workshop
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Index;
