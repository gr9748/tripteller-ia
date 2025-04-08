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
      flights: {
        Row: {
          airline: string | null
          arrival_city: string
          arrival_date: string
          booking_status: string | null
          created_at: string | null
          departure_city: string
          departure_date: string
          id: string
          price: number
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          airline?: string | null
          arrival_city: string
          arrival_date: string
          booking_status?: string | null
          created_at?: string | null
          departure_city: string
          departure_date: string
          id?: string
          price: number
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          airline?: string | null
          arrival_city?: string
          arrival_date?: string
          booking_status?: string | null
          created_at?: string | null
          departure_city?: string
          departure_date?: string
          id?: string
          price?: number
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flights_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          booking_status: string | null
          check_in: string
          check_out: string
          created_at: string | null
          guests: number
          id: string
          location: string
          name: string
          price_per_night: number
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          booking_status?: string | null
          check_in: string
          check_out: string
          created_at?: string | null
          guests?: number
          id?: string
          location: string
          name: string
          price_per_night: number
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          booking_status?: string | null
          check_in?: string
          check_out?: string
          created_at?: string | null
          guests?: number
          id?: string
          location?: string
          name?: string
          price_per_night?: number
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotels_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          booking_status: string | null
          created_at: string | null
          cuisine_type: string | null
          guests: number
          id: string
          location: string
          name: string
          price_range: string
          reservation_date: string
          trip_id: string
          updated_at: string | null
        }
        Insert: {
          booking_status?: string | null
          created_at?: string | null
          cuisine_type?: string | null
          guests?: number
          id?: string
          location: string
          name: string
          price_range: string
          reservation_date: string
          trip_id: string
          updated_at?: string | null
        }
        Update: {
          booking_status?: string | null
          created_at?: string | null
          cuisine_type?: string | null
          guests?: number
          id?: string
          location?: string
          name?: string
          price_range?: string
          reservation_date?: string
          trip_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurants_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_plans: {
        Row: {
          ai_response: Json | null
          budget: number
          created_at: string
          destination: string
          end_date: string
          id: string
          interests: string | null
          source: string
          start_date: string
          travelers: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_response?: Json | null
          budget: number
          created_at?: string
          destination: string
          end_date: string
          id?: string
          interests?: string | null
          source: string
          start_date: string
          travelers: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_response?: Json | null
          budget?: number
          created_at?: string
          destination?: string
          end_date?: string
          id?: string
          interests?: string | null
          source?: string
          start_date?: string
          travelers?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          budget: number
          created_at: string | null
          end_date: string
          id: string
          start_date: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          budget?: number
          created_at?: string | null
          end_date: string
          id?: string
          start_date: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          budget?: number
          created_at?: string | null
          end_date?: string
          id?: string
          start_date?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
