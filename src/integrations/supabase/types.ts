export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string;
          admin_id: string;
          created_at: string;
          details: Json | null;
          id: string;
          target_user_id: string | null;
        };
        Insert: {
          action: string;
          admin_id: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          target_user_id?: string | null;
        };
        Update: {
          action?: string;
          admin_id?: string;
          created_at?: string;
          details?: Json | null;
          id?: string;
          target_user_id?: string | null;
        };
        Relationships: [];
      };
      compliance_documents: {
        Row: {
          attachment_name: string | null;
          created_at: string;
          expiry_date: string;
          id: string;
          issue_date: string | null;
          issuer: string | null;
          last_renewed_at: string | null;
          notes: string | null;
          reference: string;
          renewal_status: string;
          title: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          attachment_name?: string | null;
          created_at?: string;
          expiry_date: string;
          id?: string;
          issue_date?: string | null;
          issuer?: string | null;
          last_renewed_at?: string | null;
          notes?: string | null;
          reference: string;
          renewal_status?: string;
          title: string;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          attachment_name?: string | null;
          created_at?: string;
          expiry_date?: string;
          id?: string;
          issue_date?: string | null;
          issuer?: string | null;
          last_renewed_at?: string | null;
          notes?: string | null;
          reference?: string;
          renewal_status?: string;
          title?: string;
          type?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      document_reminders: {
        Row: {
          auto_renew: boolean;
          created_at: string;
          email_reports: boolean;
          phone: string;
          updated_at: string;
          user_id: string;
          whatsapp: boolean;
        };
        Insert: {
          auto_renew?: boolean;
          created_at?: string;
          email_reports?: boolean;
          phone?: string;
          updated_at?: string;
          user_id: string;
          whatsapp?: boolean;
        };
        Update: {
          auto_renew?: boolean;
          created_at?: string;
          email_reports?: boolean;
          phone?: string;
          updated_at?: string;
          user_id?: string;
          whatsapp?: boolean;
        };
        Relationships: [];
      };
      invoice_activities: {
        Row: {
          client_id: string | null;
          created_at: string;
          detail: string;
          id: string;
          invoice_id: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          detail?: string;
          id?: string;
          invoice_id?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          detail?: string;
          id?: string;
          invoice_id?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invoice_activities_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "invoice_clients";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "invoice_activities_invoice_id_fkey";
            columns: ["invoice_id"];
            isOneToOne: false;
            referencedRelation: "invoices";
            referencedColumns: ["id"];
          },
        ];
      };
      invoice_clients: {
        Row: {
          address: string | null;
          city: string | null;
          created_at: string;
          email: string | null;
          id: string;
          name: string;
          phone: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name: string;
          phone?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          address?: string | null;
          city?: string | null;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string;
          phone?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      invoice_templates: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          lines: Json;
          name: string;
          updated_at: string;
          usage_count: number;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          id?: string;
          lines?: Json;
          name: string;
          updated_at?: string;
          usage_count?: number;
          user_id: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          lines?: Json;
          name?: string;
          updated_at?: string;
          usage_count?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          client_id: string | null;
          created_at: string;
          due_date: string;
          id: string;
          invoice_number: string;
          issue_date: string;
          lines: Json;
          notes: string | null;
          paid_at: string | null;
          sent_at: string | null;
          status: string;
          subtotal: number;
          total: number;
          updated_at: string;
          user_id: string;
          vat: number;
        };
        Insert: {
          client_id?: string | null;
          created_at?: string;
          due_date: string;
          id?: string;
          invoice_number: string;
          issue_date?: string;
          lines?: Json;
          notes?: string | null;
          paid_at?: string | null;
          sent_at?: string | null;
          status?: string;
          subtotal?: number;
          total?: number;
          updated_at?: string;
          user_id: string;
          vat?: number;
        };
        Update: {
          client_id?: string | null;
          created_at?: string;
          due_date?: string;
          id?: string;
          invoice_number?: string;
          issue_date?: string;
          lines?: Json;
          notes?: string | null;
          paid_at?: string | null;
          sent_at?: string | null;
          status?: string;
          subtotal?: number;
          total?: number;
          updated_at?: string;
          user_id?: string;
          vat?: number;
        };
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey";
            columns: ["client_id"];
            isOneToOne: false;
            referencedRelation: "invoice_clients";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          account_type: string | null;
          add_ons: string[];
          avatar_url: string | null;
          business_name: string | null;
          created_at: string;
          email: string | null;
          employment_status: string | null;
          full_name: string | null;
          id: string;
          nin: string | null;
          onboarded: boolean;
          onboarding_step: string | null;
          organization: string | null;
          phone: string | null;
          state_of_residence: string | null;
          tin: string | null;
          updated_at: string;
        };
        Insert: {
          account_type?: string | null;
          add_ons?: string[];
          avatar_url?: string | null;
          business_name?: string | null;
          created_at?: string;
          email?: string | null;
          employment_status?: string | null;
          full_name?: string | null;
          id: string;
          nin?: string | null;
          onboarded?: boolean;
          onboarding_step?: string | null;
          organization?: string | null;
          phone?: string | null;
          state_of_residence?: string | null;
          tin?: string | null;
          updated_at?: string;
        };
        Update: {
          account_type?: string | null;
          add_ons?: string[];
          avatar_url?: string | null;
          business_name?: string | null;
          created_at?: string;
          email?: string | null;
          employment_status?: string | null;
          full_name?: string | null;
          id?: string;
          nin?: string | null;
          onboarded?: boolean;
          onboarding_step?: string | null;
          organization?: string | null;
          phone?: string | null;
          state_of_residence?: string | null;
          tin?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      receipts: {
        Row: {
          certified_date: string | null;
          created_at: string;
          declaration: boolean;
          employer: Json;
          id: string;
          landlord: Json;
          sig_mode: string | null;
          signature_data: string | null;
          status: string;
          taxpayer: Json;
          typed_signature: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          certified_date?: string | null;
          created_at?: string;
          declaration?: boolean;
          employer?: Json;
          id?: string;
          landlord?: Json;
          sig_mode?: string | null;
          signature_data?: string | null;
          status?: string;
          taxpayer?: Json;
          typed_signature?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          certified_date?: string | null;
          created_at?: string;
          declaration?: boolean;
          employer?: Json;
          id?: string;
          landlord?: Json;
          sig_mode?: string | null;
          signature_data?: string | null;
          status?: string;
          taxpayer?: Json;
          typed_signature?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          billing_cycle: string | null;
          cancel_at: string | null;
          created_at: string;
          current_period_end: string | null;
          current_period_start: string | null;
          id: string;
          plan: Database["public"]["Enums"]["subscription_plan"];
          provider: string | null;
          provider_subscription_id: string | null;
          status: Database["public"]["Enums"]["subscription_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          billing_cycle?: string | null;
          cancel_at?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          provider?: string | null;
          provider_subscription_id?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          billing_cycle?: string | null;
          cancel_at?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          current_period_start?: string | null;
          id?: string;
          plan?: Database["public"]["Enums"]["subscription_plan"];
          provider?: string | null;
          provider_subscription_id?: string | null;
          status?: Database["public"]["Enums"]["subscription_status"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      payment_transactions: {
        Row: {
          amount_kobo: number;
          billing_cycle: string | null;
          created_at: string;
          currency: string;
          id: string;
          metadata: Json | null;
          plan: string;
          provider: string;
          provider_reference: string | null;
          status: string;
          subscription_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount_kobo: number;
          billing_cycle?: string | null;
          created_at?: string;
          currency?: string;
          id?: string;
          metadata?: Json | null;
          plan: string;
          provider?: string;
          provider_reference?: string | null;
          status?: string;
          subscription_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          amount_kobo?: number;
          billing_cycle?: string | null;
          created_at?: string;
          currency?: string;
          id?: string;
          metadata?: Json | null;
          plan?: string;
          provider?: string;
          provider_reference?: string | null;
          status?: string;
          subscription_id?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      feature_usage: {
        Row: {
          count: number;
          feature: string;
          id: string;
          period_start: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          count?: number;
          feature: string;
          id?: string;
          period_start?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          count?: number;
          feature?: string;
          id?: string;
          period_start?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_notification_preferences: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          invoice_alerts: boolean;
          marketing_emails: boolean;
          subscription_alerts: boolean;
          tax_deadline_reminders: boolean;
          transactional_emails: boolean;
          unsubscribe_token: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          invoice_alerts?: boolean;
          marketing_emails?: boolean;
          subscription_alerts?: boolean;
          tax_deadline_reminders?: boolean;
          transactional_emails?: boolean;
          unsubscribe_token?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          invoice_alerts?: boolean;
          marketing_emails?: boolean;
          subscription_alerts?: boolean;
          tax_deadline_reminders?: boolean;
          transactional_emails?: boolean;
          unsubscribe_token?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      email_logs: {
        Row: {
          category: string;
          created_at: string;
          error: string | null;
          id: string;
          metadata: Json | null;
          provider: string;
          provider_message_id: string | null;
          recipient: string;
          status: string;
          subject: string;
          template_id: string;
          user_id: string | null;
        };
        Insert: {
          category?: string;
          created_at?: string;
          error?: string | null;
          id?: string;
          metadata?: Json | null;
          provider?: string;
          provider_message_id?: string | null;
          recipient: string;
          status?: string;
          subject: string;
          template_id: string;
          user_id?: string | null;
        };
        Update: {
          category?: string;
          created_at?: string;
          error?: string | null;
          id?: string;
          metadata?: Json | null;
          provider?: string;
          provider_message_id?: string | null;
          recipient?: string;
          status?: string;
          subject?: string;
          template_id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          admin_notes: string | null;
          category: string;
          client_type: string;
          created_at: string;
          email: string;
          id: string;
          message: string;
          metadata: Json | null;
          name: string;
          phone: string | null;
          priority: string;
          source: string;
          status: string;
          subject: string;
          ticket_id: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          admin_notes?: string | null;
          category?: string;
          client_type?: string;
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          metadata?: Json | null;
          name: string;
          phone?: string | null;
          priority?: string;
          source?: string;
          status?: string;
          subject: string;
          ticket_id: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          admin_notes?: string | null;
          category?: string;
          client_type?: string;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          metadata?: Json | null;
          name?: string;
          phone?: string | null;
          priority?: string;
          source?: string;
          status?: string;
          subject?: string;
          ticket_id?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      auth_verification_codes: {
        Row: {
          attempts: number;
          code: string;
          created_at: string;
          email: string;
          expires_at: string;
          id: string;
          metadata: Json | null;
          purpose: string;
          verified_at: string | null;
        };
        Insert: {
          attempts?: number;
          code: string;
          created_at?: string;
          email: string;
          expires_at: string;
          id?: string;
          metadata?: Json | null;
          purpose: string;
          verified_at?: string | null;
        };
        Update: {
          attempts?: number;
          code?: string;
          created_at?: string;
          email?: string;
          expires_at?: string;
          id?: string;
          metadata?: Json | null;
          purpose?: string;
          verified_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      submit_contact_message: {
        Args: {
          p_name: string;
          p_email: string;
          p_phone?: string | null;
          p_client_type?: string;
          p_category?: string;
          p_subject?: string;
          p_message?: string;
          p_user_id?: string | null;
          p_source?: string;
          p_metadata?: Json;
        };
        Returns: Json;
      };
      generate_auth_otp: {
        Args: {
          p_email: string;
          p_purpose: string;
          p_metadata?: Json;
        };
        Returns: Json;
      };
      verify_auth_otp: {
        Args: {
          p_email: string;
          p_code: string;
          p_purpose: string;
        };
        Returns: Json;
      };
      reset_password_with_otp: {
        Args: {
          p_email: string;
          p_code: string;
          p_new_password: string;
        };
        Returns: Json;
      };
    };
    Enums: {
      app_role: "admin" | "moderator" | "user";
      subscription_plan:
        "free" | "starter" | "pro" | "business" | "enterprise" | "deluxe" | "premium";
      subscription_status: "active" | "trialing" | "past_due" | "canceled" | "expired";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      subscription_plan: ["free", "starter", "pro", "business", "enterprise", "deluxe", "premium"],
      subscription_status: ["active", "trialing", "past_due", "canceled", "expired"],
    },
  },
} as const;
