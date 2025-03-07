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
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
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
          latin_name: string | null
          summary: string | null
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
          latin_name?: string | null
          summary?: string | null
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
          latin_name?: string | null
          summary?: string | null
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
      video_submissions: {
        Row: {
          ai_generated_image_url: string | null
          ai_video_url: string | null
          cloudinary_id: string | null
          cloudinary_url: string | null
          created_at: string
          id: string
          latin_name: string | null
          organism_type: string | null
          replicate_prediction_id: string | null
          replicate_status: string | null
          user_id: string | null
          video_status: string | null
          workshop_id: string | null
        }
        Insert: {
          ai_generated_image_url?: string | null
          ai_video_url?: string | null
          cloudinary_id?: string | null
          cloudinary_url?: string | null
          created_at?: string
          id?: string
          latin_name?: string | null
          organism_type?: string | null
          replicate_prediction_id?: string | null
          replicate_status?: string | null
          user_id?: string | null
          video_status?: string | null
          workshop_id?: string | null
        }
        Update: {
          ai_generated_image_url?: string | null
          ai_video_url?: string | null
          cloudinary_id?: string | null
          cloudinary_url?: string | null
          created_at?: string
          id?: string
          latin_name?: string | null
          organism_type?: string | null
          replicate_prediction_id?: string | null
          replicate_status?: string | null
          user_id?: string | null
          video_status?: string | null
          workshop_id?: string | null
        }
        Relationships: []
      }
      workshop_videos_metadata: {
        Row: {
          cloudinary_public_id: string | null
          created_at: string
          id: number
          status: string | null
          video_type: string | null
        }
        Insert: {
          cloudinary_public_id?: string | null
          created_at?: string
          id?: number
          status?: string | null
          video_type?: string | null
        }
        Update: {
          cloudinary_public_id?: string | null
          created_at?: string
          id?: number
          status?: string | null
          video_type?: string | null
        }
        Relationships: []
      }
      workshops: {
        Row: {
          access_code: string
          completed_video_count: number | null
          created_at: string
          expected_video_count: number | null
          failed_video_count: number | null
          id: string
          minimum_videos_required: number | null
          outtro_video_ready: boolean | null
          processed_for_video: boolean | null
          status: boolean | null
          title: string
          updated_at: string
          video_generation_timeout: string | null
          workshop_video_url: string | null
        }
        Insert: {
          access_code: string
          completed_video_count?: number | null
          created_at?: string
          expected_video_count?: number | null
          failed_video_count?: number | null
          id?: string
          minimum_videos_required?: number | null
          outtro_video_ready?: boolean | null
          processed_for_video?: boolean | null
          status?: boolean | null
          title: string
          updated_at?: string
          video_generation_timeout?: string | null
          workshop_video_url?: string | null
        }
        Update: {
          access_code?: string
          completed_video_count?: number | null
          created_at?: string
          expected_video_count?: number | null
          failed_video_count?: number | null
          id?: string
          minimum_videos_required?: number | null
          outtro_video_ready?: boolean | null
          processed_for_video?: boolean | null
          status?: boolean | null
          title?: string
          updated_at?: string
          video_generation_timeout?: string | null
          workshop_video_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_admin_access_via_header: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_admin_status: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_is_admin: {
        Args: {
          user_email: string
        }
        Returns: boolean
      }
      create_admin: {
        Args: {
          admin_email: string
          creator_email: string
        }
        Returns: boolean
      }
      create_first_admin: {
        Args: {
          admin_email: string
        }
        Returns: boolean
      }
      get_admin_by_email: {
        Args: {
          email_param: string
        }
        Returns: {
          email: string
        }[]
      }
      hash_password: {
        Args: {
          password: string
        }
        Returns: string
      }
      is_admin:
        | {
            Args: Record<PropertyKey, never>
            Returns: boolean
          }
        | {
            Args: {
              user_email: string
            }
            Returns: boolean
          }
      is_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      verify_password: {
        Args: {
          input_password: string
          hashed_password: string
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
