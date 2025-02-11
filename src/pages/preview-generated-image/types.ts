
export type Submission = {
  id: string;
  user_id: string;
  created_at: string;
  type_organisme: string | null;
  kleur_organisme: string | null;
  hoe_groot_organisme: string | null;
  hoeveel_organism: string | null;
  beschrijving_landschap_user: string | null;
  kenmerken_user: string | null;
  feedback_vraag1: string | null;
  feedback_antwoord1: string | null;
  feedback_vraag2: string | null;
  feedback_antwoord2: string | null;
  adjust_organisme: boolean | null;
  ai_description: string | null;
  ai_model_image_analyse: string | null;
  ai_prompt: string | null;
  ai_model_prompt_generation: string | null;
  ai_model_image_generation: string | null;
  ai_image_ratio: string | null;
  ai_image_url: string | null;
  summary: string | null;
  url_original_image: string | null;
  workshop_id: string | null;
};

