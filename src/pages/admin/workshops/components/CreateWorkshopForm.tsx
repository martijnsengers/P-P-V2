
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, checkAdminStatus } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function CreateWorkshopForm() {
  const [newTitle, setNewTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleAdminError = async (error: Error) => {
    const isAdmin = await checkAdminStatus();
    if (!isAdmin) {
      localStorage.removeItem('adminEmail');
      navigate("/admin/login");
      toast({
        title: "Authentication Error",
        description: "Please log in again as admin",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createWorkshop = useMutation({
    mutationFn: async (title: string) => {
      const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const { data, error } = await supabase
        .from("workshops")
        .insert([{ title, access_code: accessCode }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      setNewTitle("");
      toast({
        title: "Success",
        description: "Workshop created successfully",
      });
    },
    onError: handleAdminError
  });

  const handleCreateWorkshop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workshop title",
        variant: "destructive",
      });
      return;
    }
    createWorkshop.mutate(newTitle);
  };

  return (
    <form onSubmit={handleCreateWorkshop} className="mb-8">
      <div className="flex gap-4">
        <Input
          type="text"
          placeholder="Enter workshop title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="max-w-md"
        />
        <Button type="submit" disabled={createWorkshop.isPending}>
          <Plus className="w-4 h-4 mr-2" />
          {createWorkshop.isPending ? "Creating..." : "Create Workshop"}
        </Button>
      </div>
    </form>
  );
}
