
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Workshop } from "../types";
import { WorkshopSubmissionsList } from "./WorkshopSubmissionsList";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface WorkshopsTableProps {
  workshops: Workshop[];
}

export function WorkshopsTable({ workshops }: WorkshopsTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [expandedWorkshops, setExpandedWorkshops] = useState<string[]>([]);

  const toggleExpand = (workshopId: string) => {
    setExpandedWorkshops(prev =>
      prev.includes(workshopId)
        ? prev.filter(id => id !== workshopId)
        : [...prev, workshopId]
    );
  };

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

  return (
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
          {workshops.map((workshop) => (
            <Collapsible
              key={workshop.id}
              open={expandedWorkshops.includes(workshop.id)}
              onOpenChange={() => toggleExpand(workshop.id)}
            >
              <TableRow>
                <TableCell>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                      <span className="mr-2">{workshop.title}</span>
                      {expandedWorkshops.includes(workshop.id) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </TableCell>
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
              <CollapsibleContent className="px-4 py-4 bg-gray-50">
                <WorkshopSubmissionsList workshopId={workshop.id} />
              </CollapsibleContent>
            </Collapsible>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
