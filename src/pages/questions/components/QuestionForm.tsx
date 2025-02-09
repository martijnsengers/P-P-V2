
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { FormType, formSchema } from "../types";

interface QuestionFormProps {
  onSubmit: (data: FormType) => void;
  isLoading: boolean;
}

export const QuestionForm = ({ onSubmit, isLoading }: QuestionFormProps) => {
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

  return (
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
  );
};
