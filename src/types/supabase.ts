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
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          due_date: string
          created_at: string
          category: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          due_date: string
          created_at?: string
          category: string
          status: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          due_date?: string
          created_at?: string
          category?: string
          status?: string
          user_id?: string
        }
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
  }
}