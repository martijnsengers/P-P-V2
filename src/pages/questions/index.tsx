
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";

const formSchema = z.object({
  type_organisme: z.enum([
    "Struik of Boom",
    "Mos",
    "Varen",
    "Alg",
    "Cactus",
    "Bloemplant",
    "Het lijkt op geen enkel bestaand organisme",
  ]),
  kleur_organisme: z.string().min(1, "Vul een kleur in"),
  hoe_groot_organisme: z.enum([
    "1 nanometer",
    "1 micrometer",
    "1 meter",
    "10 meter",
    "1 kilometer",
  ]),
  hoeveel_organism: z.enum(["Solitair", "Multiple"]),
  beschrijving_landschap_user: z.string().min(1, "Beschrijf het landschap"),
  kenmerken_user: z.string().min(1, "Beschrijf de kenmerken"),
});

type FormType = z.infer<typeof formSchema>;

export default function QuestionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get session data from localStorage
  const getSessionData = () => {
    const session = localStorage.getItem('workshopSession');
    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ongeldige sessie. Start opnieuw.",
      });
      navigate("/");
      return null;
    }
    return JSON.parse(session);
  };

  useEffect(() => {
    // Verify session and submission on component mount
    const verifySession = async () => {
      const session = getSessionData();
      if (!session) return;

      try {
        // Verify the submission exists
        const { data: existingSubmission, error: fetchError } = await supabase
          .from("submissions")
          .select("id")
          .eq("user_id", session.userId)
          .eq("workshop_id", session.workshopId)
          .maybeSingle();

        if (fetchError || !existingSubmission) {
          console.error("Error fetching submission:", fetchError);
          toast({
            title: "Error",
            description: "Kon de inzending niet vinden. Start opnieuw.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }
      } catch (error) {
        console.error("Session verification error:", error);
        toast({
          title: "Error",
          description: "Er is een fout opgetreden. Start opnieuw.",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    verifySession();
  }, [navigate, toast]);

  // Initialize form
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type_organisme: undefined,
      kleur_organisme: "",
      hoe_groot_organisme: undefined,
      hoeveel_organism: undefined,
      beschrijving_landschap_user: "",
      kenmerken_user: "",
    },
  });

  async function onSubmit(data: FormType) {
    const session = getSessionData();
    if (!session) return;

    setIsLoading(true);
    console.log("Submitting form with data:", { ...session, ...data });

    try {
      // Update Supabase submissions
      const { error: updateError } = await supabase
        .from("submissions")
        .update({
          type_organisme: data.type_organisme,
          kleur_organisme: data.kleur_organisme,
          hoe_groot_organisme: data.hoe_groot_organisme,
          hoeveel_organism: data.hoeveel_organism,
          beschrijving_landschap_user: data.beschrijving_landschap_user,
          kenmerken_user: data.kenmerken_user,
        })
        .eq("user_id", session.userId)
        .eq("workshop_id", session.workshopId);

      if (updateError) {
        console.error("Error updating submission:", updateError);
        throw new Error("Kon de inzending niet bijwerken");
      }

      console.log("Successfully updated submission");

      toast({
        title: "Succes",
        description: "Je antwoorden zijn succesvol opgeslagen.",
      });

      // Navigate to loading page
      navigate("/loading-questions");
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#E1E6E0]">
      <Header subtitle="Create and explore futuristic plant organisms" />
      <div className="w-full max-w-2xl space-y-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Type Organisme */}
            <FormField
              control={form.control}
              name="type_organisme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Type organisme</FormLabel>
                  <p className="text-sm text-muted-foreground mb-2">
                    Wat voor type organisme is het, waar lijkt het op?
                  </p>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer type organisme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Struik of Boom">Struik of Boom</SelectItem>
                      <SelectItem value="Mos">Mos</SelectItem>
                      <SelectItem value="Varen">Varen</SelectItem>
                      <SelectItem value="Alg">Alg</SelectItem>
                      <SelectItem value="Cactus">Cactus</SelectItem>
                      <SelectItem value="Bloemplant">Bloemplant</SelectItem>
                      <SelectItem value="Het lijkt op geen enkel bestaand organisme">
                        Het lijkt op geen enkel bestaand organisme
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kleur */}
            <FormField
              control={form.control}
              name="kleur_organisme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Kleur</FormLabel>
                  <p className="text-sm text-muted-foreground mb-2">
                    Welke kleur heeft jouw organisme?
                  </p>
                  <FormControl>
                    <Input placeholder="Vul een kleur in" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grootte */}
            <FormField
              control={form.control}
              name="hoe_groot_organisme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Grootte</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer grootte" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1 nanometer">1 nanometer</SelectItem>
                      <SelectItem value="1 micrometer">1 micrometer</SelectItem>
                      <SelectItem value="1 meter">1 meter</SelectItem>
                      <SelectItem value="10 meter">10 meter</SelectItem>
                      <SelectItem value="1 kilometer">1 kilometer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Aantal */}
            <FormField
              control={form.control}
              name="hoeveel_organism"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Aantal</FormLabel>
                  <p className="text-sm text-muted-foreground mb-2">
                    Hoeveel zie ik er?
                  </p>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer aantal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Solitair">Solitair</SelectItem>
                      <SelectItem value="Multiple">Multiple</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Landschap */}
            <FormField
              control={form.control}
              name="beschrijving_landschap_user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Landschap</FormLabel>
                  <p className="text-sm text-muted-foreground mb-2">
                    Beschrijf het landschap of de omgeving van het organisme
                  </p>
                  <FormControl>
                    <Textarea
                      placeholder="Beschrijf het landschap..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Kenmerken */}
            <FormField
              control={form.control}
              name="kenmerken_user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Kenmerken</FormLabel>
                  <p className="text-sm text-muted-foreground mb-2">
                    Beschrijf de kenmerken van het organisme, wat maakt het bijzonder?
                  </p>
                  <FormControl>
                    <Textarea
                      placeholder="Beschrijf de kenmerken..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Bezig met versturen...
                </>
              ) : (
                "Verstuur"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
