
import { z } from "zod";

export const formSchema = z.object({
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

export type FormType = z.infer<typeof formSchema>;
