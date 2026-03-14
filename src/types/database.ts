export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          phone: string | null;
          role: "customer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          phone?: string | null;
          role?: "customer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          phone?: string | null;
          role?: "customer" | "admin";
          updated_at?: string;
        };
        Relationships: [];
      };
      addresses: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          recipient_name: string;
          phone: string;
          postal_code: string;
          address_line1: string;
          address_line2: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          label: string;
          recipient_name: string;
          phone: string;
          postal_code: string;
          address_line1: string;
          address_line2?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          label?: string;
          recipient_name?: string;
          phone?: string;
          postal_code?: string;
          address_line1?: string;
          address_line2?: string | null;
          is_default?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          detail_html: string;
          base_price: number;
          category: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string;
          detail_html?: string;
          base_price: number;
          category?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string;
          detail_html?: string;
          base_price?: number;
          category?: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      product_options: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          additional_price: number;
          stock: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          additional_price?: number;
          stock?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          additional_price?: number;
          stock?: number;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          url?: string;
          alt_text?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_tags: {
        Row: {
          id: string;
          product_id: string;
          tag: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          tag: string;
        };
        Update: {
          tag?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_tags_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      cart_items: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          option_id: string | null;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          option_id?: string | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          option_id?: string | null;
          quantity?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cart_items_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "product_options";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          order_number: string;
          status: "payment_completed" | "preparing" | "shipping" | "delivered" | "cancelled";
          recipient_name: string;
          phone: string;
          postal_code: string;
          address_line1: string;
          address_line2: string | null;
          total_amount: number;
          discount_amount: number;
          shipping_fee: number;
          final_amount: number;
          coupon_id: string | null;
          note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_number: string;
          status?: "payment_completed" | "preparing" | "shipping" | "delivered" | "cancelled";
          recipient_name: string;
          phone: string;
          postal_code: string;
          address_line1: string;
          address_line2?: string | null;
          total_amount: number;
          discount_amount?: number;
          shipping_fee?: number;
          final_amount: number;
          coupon_id?: string | null;
          note?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "payment_completed" | "preparing" | "shipping" | "delivered" | "cancelled";
          recipient_name?: string;
          phone?: string;
          postal_code?: string;
          address_line1?: string;
          address_line2?: string | null;
          total_amount?: number;
          discount_amount?: number;
          shipping_fee?: number;
          final_amount?: number;
          coupon_id?: string | null;
          note?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "coupons";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          option_id: string | null;
          product_name: string;
          option_name: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          option_id?: string | null;
          product_name: string;
          option_name?: string | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          product_name?: string;
          option_name?: string | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_option_id_fkey";
            columns: ["option_id"];
            isOneToOne: false;
            referencedRelation: "product_options";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: {
          id: string;
          order_id: string;
          method: "mock_card" | "mock_bank_transfer" | "mock_virtual_account";
          amount: number;
          status: "pending" | "completed" | "failed" | "refunded";
          transaction_id: string | null;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          method?: "mock_card" | "mock_bank_transfer" | "mock_virtual_account";
          amount: number;
          status?: "pending" | "completed" | "failed" | "refunded";
          transaction_id?: string | null;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          method?: "mock_card" | "mock_bank_transfer" | "mock_virtual_account";
          amount?: number;
          status?: "pending" | "completed" | "failed" | "refunded";
          transaction_id?: string | null;
          paid_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      shipments: {
        Row: {
          id: string;
          order_id: string;
          carrier: string;
          tracking_number: string | null;
          status: "preparing" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered";
          shipped_at: string | null;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          carrier?: string;
          tracking_number?: string | null;
          status?: "preparing" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered";
          shipped_at?: string | null;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          carrier?: string;
          tracking_number?: string | null;
          status?: "preparing" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered";
          shipped_at?: string | null;
          delivered_at?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shipments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      coupons: {
        Row: {
          id: string;
          code: string;
          name: string;
          type: "fixed" | "percent";
          discount_value: number;
          min_order_amount: number;
          max_discount_amount: number | null;
          product_id: string | null;
          starts_at: string;
          expires_at: string;
          max_uses: number | null;
          used_count: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          type: "fixed" | "percent";
          discount_value: number;
          min_order_amount?: number;
          max_discount_amount?: number | null;
          product_id?: string | null;
          starts_at: string;
          expires_at: string;
          max_uses?: number | null;
          used_count?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          code?: string;
          name?: string;
          type?: "fixed" | "percent";
          discount_value?: number;
          min_order_amount?: number;
          max_discount_amount?: number | null;
          product_id?: string | null;
          starts_at?: string;
          expires_at?: string;
          max_uses?: number | null;
          used_count?: number;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "coupons_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      user_coupons: {
        Row: {
          id: string;
          user_id: string;
          coupon_id: string;
          is_used: boolean;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          coupon_id: string;
          is_used?: boolean;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          is_used?: boolean;
          used_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_coupons_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_coupons_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "coupons";
            referencedColumns: ["id"];
          },
        ];
      };
      reviews: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          order_item_id: string | null;
          rating: number;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          order_item_id?: string | null;
          rating: number;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          rating?: number;
          content?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_order_item_id_fkey";
            columns: ["order_item_id"];
            isOneToOne: false;
            referencedRelation: "order_items";
            referencedColumns: ["id"];
          },
        ];
      };
      review_images: {
        Row: {
          id: string;
          review_id: string;
          url: string;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          review_id: string;
          url: string;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          url?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "review_images_review_id_fkey";
            columns: ["review_id"];
            isOneToOne: false;
            referencedRelation: "reviews";
            referencedColumns: ["id"];
          },
        ];
      };
      inquiries: {
        Row: {
          id: string;
          user_id: string;
          product_id: string | null;
          order_id: string | null;
          type: "product" | "shipping" | "general";
          title: string;
          content: string;
          status: "pending" | "answered" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id?: string | null;
          order_id?: string | null;
          type: "product" | "shipping" | "general";
          title: string;
          content: string;
          status?: "pending" | "answered" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          type?: "product" | "shipping" | "general";
          title?: string;
          content?: string;
          status?: "pending" | "answered" | "closed";
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiries_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiries_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      inquiry_replies: {
        Row: {
          id: string;
          inquiry_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          inquiry_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "inquiry_replies_inquiry_id_fkey";
            columns: ["inquiry_id"];
            isOneToOne: false;
            referencedRelation: "inquiries";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "inquiry_replies_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_logs: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          role: "user" | "bot" | "admin";
          message: string;
          escalated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          role: "user" | "bot" | "admin";
          message: string;
          escalated?: boolean;
          created_at?: string;
        };
        Update: {
          message?: string;
          escalated?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "chat_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          body_html: string;
          image_url: string | null;
          starts_at: string;
          ends_at: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string;
          body_html?: string;
          image_url?: string | null;
          starts_at: string;
          ends_at: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string;
          body_html?: string;
          image_url?: string | null;
          starts_at?: string;
          ends_at?: string;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_comments: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          content: string;
          created_at?: string;
        };
        Update: {
          content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_comments_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      event_coupons: {
        Row: {
          id: string;
          event_id: string;
          coupon_id: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          coupon_id: string;
        };
        Update: {
          event_id?: string;
          coupon_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_coupons_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_coupons_coupon_id_fkey";
            columns: ["coupon_id"];
            isOneToOne: false;
            referencedRelation: "coupons";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience type aliases
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
