export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          image_url: string
          title: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          image_url: string
          title: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          image_url?: string
          title?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          adjust_organisme: boolean | null
          ai_description: string | null
          ai_image_ratio: string | null
          ai_image_url: string | null
          ai_model_image_analyse: string | null
          ai_model_image_generation: string | null
          ai_model_prompt_generation: string | null
          ai_prompt: string | null
          beschrijving_landschap_user: string | null
          created_at: string
          feedback_antwoord1: string | null
          feedback_antwoord2: string | null
          feedback_vraag1: string | null
          feedback_vraag2: string | null
          hoe_groot_organisme: string | null
          hoeveel_organism: string | null
          id: string
          kenmerken_user: string | null
          kleur_organisme: string | null
          type_organisme: string | null
          url_original_image: string | null
          user_id: string
          workshop_id: string | null
        }
        Insert: {
          adjust_organisme?: boolean | null
          ai_description?: string | null
          ai_image_ratio?: string | null
          ai_image_url?: string | null
          ai_model_image_analyse?: string | null
          ai_model_image_generation?: string | null
          ai_model_prompt_generation?: string | null
          ai_prompt?: string | null
          beschrijving_landschap_user?: string | null
          created_at?: string
          feedback_antwoord1?: string | null
          feedback_antwoord2?: string | null
          feedback_vraag1?: string | null
          feedback_vraag2?: string | null
          hoe_groot_organisme?: string | null
          hoeveel_organism?: string | null
          id?: string
          kenmerken_user?: string | null
          kleur_organisme?: string | null
          type_organisme?: string | null
          url_original_image?: string | null
          user_id: string
          workshop_id?: string | null
        }
        Update: {
          adjust_organisme?: boolean | null
          ai_description?: string | null
          ai_image_ratio?: string | null
          ai_image_url?: string | null
          ai_model_image_analyse?: string | null
          ai_model_image_generation?: string | null
          ai_model_prompt_generation?: string | null
          ai_prompt?: string | null
          beschrijving_landschap_user?: string | null
          created_at?: string
          feedback_antwoord1?: string | null
          feedback_antwoord2?: string | null
          feedback_vraag1?: string | null
          feedback_vraag2?: string | null
          hoe_groot_organisme?: string | null
          hoeveel_organism?: string | null
          id?: string
          kenmerken_user?: string | null
          kleur_organisme?: string | null
          type_organisme?: string | null
          url_original_image?: string | null
          user_id?: string
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          access_code: string
          created_at: string
          id: string
          status: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          access_code: string
          created_at?: string
          id?: string
          status?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          access_code?: string
          created_at?: string
          id?: string
          status?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hash_password: {
        Args: {
          password: string
        }
        Returns: string
      }
      is_admin: {
        Args: {
          user_email: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
