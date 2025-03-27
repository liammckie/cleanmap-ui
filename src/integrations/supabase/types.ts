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
      employees: {
        Row: {
          address_city: string
          address_postcode: string
          address_state: string
          address_street: string
          bank_account_number: string
          bank_bsb: string
          contact_email: string
          contact_phone: string
          created_at: string
          date_of_birth: string
          department: string
          employee_id: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          first_name: string
          id: string
          job_title: string
          last_name: string
          pay_cycle: Database["public"]["Enums"]["pay_cycle"]
          pay_rate: number
          start_date: string
          status: Database["public"]["Enums"]["employee_status"]
          super_fund_name: string
          super_member_number: string
          tax_id: string
          updated_at: string
          user_account_id: string | null
          wage_classification: string
        }
        Insert: {
          address_city: string
          address_postcode: string
          address_state: string
          address_street: string
          bank_account_number: string
          bank_bsb: string
          contact_email: string
          contact_phone: string
          created_at?: string
          date_of_birth: string
          department: string
          employee_id: string
          employment_type: Database["public"]["Enums"]["employment_type"]
          first_name: string
          id?: string
          job_title: string
          last_name: string
          pay_cycle: Database["public"]["Enums"]["pay_cycle"]
          pay_rate: number
          start_date: string
          status?: Database["public"]["Enums"]["employee_status"]
          super_fund_name: string
          super_member_number: string
          tax_id: string
          updated_at?: string
          user_account_id?: string | null
          wage_classification: string
        }
        Update: {
          address_city?: string
          address_postcode?: string
          address_state?: string
          address_street?: string
          bank_account_number?: string
          bank_bsb?: string
          contact_email?: string
          contact_phone?: string
          created_at?: string
          date_of_birth?: string
          department?: string
          employee_id?: string
          employment_type?: Database["public"]["Enums"]["employment_type"]
          first_name?: string
          id?: string
          job_title?: string
          last_name?: string
          pay_cycle?: Database["public"]["Enums"]["pay_cycle"]
          pay_rate?: number
          start_date?: string
          status?: Database["public"]["Enums"]["employee_status"]
          super_fund_name?: string
          super_member_number?: string
          tax_id?: string
          updated_at?: string
          user_account_id?: string | null
          wage_classification?: string
        }
        Relationships: []
      }
      onboarding_tasks: {
        Row: {
          approval_needed: boolean
          assigned_to: string
          completed_date: string | null
          created_at: string
          created_by: string
          due_date: string
          employee_id: string
          id: string
          status: Database["public"]["Enums"]["task_status"]
          task_description: string
          updated_at: string
        }
        Insert: {
          approval_needed?: boolean
          assigned_to: string
          completed_date?: string | null
          created_at?: string
          created_by: string
          due_date: string
          employee_id: string
          id?: string
          status?: Database["public"]["Enums"]["task_status"]
          task_description: string
          updated_at?: string
        }
        Update: {
          approval_needed?: boolean
          assigned_to?: string
          completed_date?: string | null
          created_at?: string
          created_by?: string
          due_date?: string
          employee_id?: string
          id?: string
          status?: Database["public"]["Enums"]["task_status"]
          task_description?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_tasks_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          comments: string
          created_at: string
          employee_id: string
          goals: string | null
          id: string
          rating: number
          review_date: string
          review_type: Database["public"]["Enums"]["review_type"]
          reviewer_id: string
          updated_at: string
        }
        Insert: {
          comments: string
          created_at?: string
          employee_id: string
          goals?: string | null
          id?: string
          rating: number
          review_date: string
          review_type: Database["public"]["Enums"]["review_type"]
          reviewer_id: string
          updated_at?: string
        }
        Update: {
          comments?: string
          created_at?: string
          employee_id?: string
          goals?: string | null
          id?: string
          rating?: number
          review_date?: string
          review_type?: Database["public"]["Enums"]["review_type"]
          reviewer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheets: {
        Row: {
          approved_by: string | null
          break_duration: number
          created_at: string
          date: string
          employee_id: string
          end_time: string
          hours_worked: number
          id: string
          payroll_processed: boolean
          site_id: string | null
          start_time: string
          status: Database["public"]["Enums"]["timesheet_status"]
          updated_at: string
          work_order_id: string | null
        }
        Insert: {
          approved_by?: string | null
          break_duration?: number
          created_at?: string
          date: string
          employee_id: string
          end_time: string
          hours_worked: number
          id?: string
          payroll_processed?: boolean
          site_id?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["timesheet_status"]
          updated_at?: string
          work_order_id?: string | null
        }
        Update: {
          approved_by?: string | null
          break_duration?: number
          created_at?: string
          date?: string
          employee_id?: string
          end_time?: string
          hours_worked?: number
          id?: string
          payroll_processed?: boolean
          site_id?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["timesheet_status"]
          updated_at?: string
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      training_records: {
        Row: {
          certificate_id: string | null
          completion_date: string
          created_at: string
          document_id: string | null
          employee_id: string
          expiry_date: string | null
          id: string
          provider: string
          score: number | null
          training_name: string
          updated_at: string
        }
        Insert: {
          certificate_id?: string | null
          completion_date: string
          created_at?: string
          document_id?: string | null
          employee_id: string
          expiry_date?: string | null
          id?: string
          provider: string
          score?: number | null
          training_name: string
          updated_at?: string
        }
        Update: {
          certificate_id?: string | null
          completion_date?: string
          created_at?: string
          document_id?: string | null
          employee_id?: string
          expiry_date?: string | null
          id?: string
          provider?: string
          score?: number | null
          training_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
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
      employee_status: "Onboarding" | "Active" | "Terminated"
      employment_type: "Full-time" | "Part-time" | "Contractor"
      pay_cycle: "Weekly" | "Fortnightly" | "Monthly"
      review_type: "Probation" | "Quarterly" | "Annual" | "Special"
      task_status: "Pending" | "In Progress" | "Completed"
      timesheet_status: "Pending Approval" | "Approved" | "Rejected"
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
