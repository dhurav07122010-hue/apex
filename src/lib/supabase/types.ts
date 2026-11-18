export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_allowlist: {
        Row: {
          id: string;
          email: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_name: string | null;
          color: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_name?: string | null;
          color?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon_name?: string | null;
          color?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          slug: string;
          title: string;
          subtitle: string | null;
          author: string;
          author_bio: string | null;
          category_id: string;
          price: number;
          original_price: number | null;
          rating: number;
          review_count: number;
          published_year: number;
          page_count: number;
          file_size: string;
          language: string;
          format: string;
          isbn: string | null;
          badge: string | null;
          short_description: string;
          description: string;
          features: Json;
          table_of_contents: Json;
          preview_chapters: Json;
          storage_path: string | null;
          cover_image_url: string | null;
          cover_gradient: Json | null;
          is_published: boolean;
          is_featured: boolean;
          is_bestseller: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          subtitle?: string | null;
          author: string;
          author_bio?: string | null;
          category_id: string;
          price?: number;
          original_price?: number | null;
          rating?: number;
          review_count?: number;
          published_year?: number;
          page_count?: number;
          file_size?: string;
          language?: string;
          format?: string;
          isbn?: string | null;
          badge?: string | null;
          short_description: string;
          description: string;
          features?: Json;
          table_of_contents?: Json;
          preview_chapters?: Json;
          storage_path?: string | null;
          cover_image_url?: string | null;
          cover_gradient?: Json | null;
          is_published?: boolean;
          is_featured?: boolean;
          is_bestseller?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          user_id: string | null;
          customer_email: string;
          customer_name: string | null;
          total_amount: number;
          currency: string;
          status: string;
          payment_method: string;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          user_id?: string | null;
          customer_email: string;
          customer_name?: string | null;
          total_amount: number;
          currency?: string;
          status?: string;
          payment_method?: string;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Insert"]>;
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          title: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          title: string;
          price: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Insert"]>;
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          gateway: string;
          gateway_order_id: string | null;
          gateway_payment_id: string | null;
          gateway_signature: string | null;
          amount: number;
          currency: string;
          status: string;
          raw_response: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          gateway: string;
          gateway_order_id?: string | null;
          gateway_payment_id?: string | null;
          gateway_signature?: string | null;
          amount: number;
          currency?: string;
          status: string;
          raw_response?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
      };
      purchase_entitlements: {
        Row: {
          id: string;
          user_id: string | null;
          customer_email: string;
          product_id: string;
          order_id: string;
          is_active: boolean;
          download_count: number;
          max_downloads: number;
          last_downloaded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          customer_email: string;
          product_id: string;
          order_id: string;
          is_active?: boolean;
          download_count?: number;
          max_downloads?: number;
          last_downloaded_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["purchase_entitlements"]["Insert"]>;
      };
      download_logs: {
        Row: {
          id: string;
          entitlement_id: string;
          product_id: string;
          user_id: string | null;
          customer_email: string;
          ip_address: string | null;
          user_agent: string | null;
          downloaded_at: string;
        };
        Insert: {
          id?: string;
          entitlement_id: string;
          product_id: string;
          user_id?: string | null;
          customer_email: string;
          ip_address?: string | null;
          user_agent?: string | null;
          downloaded_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["download_logs"]["Insert"]>;
      };
      webhook_events: {
        Row: {
          id: string;
          gateway: string;
          event_id: string;
          event_type: string;
          payload: Json;
          processed: boolean;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          gateway?: string;
          event_id: string;
          event_type: string;
          payload: Json;
          processed?: boolean;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["webhook_events"]["Insert"]>;
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
      };
    };
  };
}
