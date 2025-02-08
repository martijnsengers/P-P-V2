
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";

interface Workshop {
  id: string;
  title: string;
  access_code: string;
  status: boolean;
  created_at: string;
}

export default function WorkshopsPage() {
  const [newTitle, setNewTitle] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch workshops
  const { data: workshops, isLoading } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Workshop[];
    },
  });

  // Create workshop
  const createWorkshop = useMutation({
    mutationFn: async (title: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

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
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      if (error.message.includes("Not authenticated")) {
        navigate("/admin/login");
      }
    },
  });

  // Toggle workshop status
  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from("workshops")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      toast({
        title: "Success",
        description: "Workshop status updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      if (error.message.includes("Not authenticated")) {
        navigate("/admin/login");
      }
    },
  });

  // Delete workshop
  const deleteWorkshop = useMutation({
    mutationFn: async (id: string) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Not authenticated");
      }

      const { error } = await supabase
        .from("workshops")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workshops"] });
      toast({
        title: "Success",
        description: "Workshop deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      if (error.message.includes("Not authenticated")) {
        navigate("/admin/login");
      }
    },
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">Loading...</div>
      </div>
    );
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

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Access Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workshops?.map((workshop) => (
                <TableRow key={workshop.id}>
                  <TableCell>{workshop.title}</TableCell>
                  <TableCell>{workshop.access_code}</TableCell>
                  <TableCell>
                    <Button
                      variant={workshop.status ? "default" : "secondary"}
                      onClick={() =>
                        toggleStatus.mutate({
                          id: workshop.id,
                          status: !workshop.status,
                        })
                      }
                      disabled={toggleStatus.isPending}
                    >
                      {workshop.status ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {new Date(workshop.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this workshop?"
                          )
                        ) {
                          deleteWorkshop.mutate(workshop.id);
                        }
                      }}
                      disabled={deleteWorkshop.isPending}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
