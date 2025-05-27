export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      menu_items: {
        Row: {
          id: number
          name: string
          price: number
          description: string | null
          image_url: string | null
          category_id: number
          created_at: string
          is_available: boolean
        }
        Insert: {
          id?: number
          name: string
          price: number
          description?: string | null
          image_url?: string | null
          category_id: number
          created_at?: string
          is_available?: boolean
        }
        Update: {
          id?: number
          name?: string
          price?: number
          description?: string | null
          image_url?: string | null
          category_id?: number
          created_at?: string
          is_available?: boolean
        }
      }
      orders: {
        Row: {
          id: number
          customer_name: string
          customer_phone: string
          customer_address: string | null
          total_amount: number
          status: string
          created_at: string
          notes: string | null
        }
        Insert: {
          id?: number
          customer_name: string
          customer_phone: string
          customer_address?: string | null
          total_amount: number
          status?: string
          created_at?: string
          notes?: string | null
        }
        Update: {
          id?: number
          customer_name?: string
          customer_phone?: string
          customer_address?: string | null
          total_amount?: number
          status?: string
          created_at?: string
          notes?: string | null
        }
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          menu_item_id: number
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id: number
          menu_item_id: number
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          menu_item_id?: number
          quantity?: number
          price?: number
          created_at?: string
        }
      }
    }
  }
}