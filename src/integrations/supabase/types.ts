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
      allowances: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          name: string
          unit: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id: string
          name: string
          unit: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_details: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string | null
          phone: string | null
          postcode: string | null
          state: string | null
          tax_id: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          postcode?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string | null
          phone?: string | null
          postcode?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      business_documents: {
        Row: {
          created_at: string
          document_number: string | null
          expiry_date: string | null
          file_url: string | null
          id: string
          issue_date: string | null
          issuer: string | null
          location_id: string
          name: string
          notes: string | null
          reminder_days: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          location_id: string
          name: string
          notes?: string | null
          reminder_days?: number | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_number?: string | null
          expiry_date?: string | null
          file_url?: string | null
          id?: string
          issue_date?: string | null
          issuer?: string | null
          location_id?: string
          name?: string
          notes?: string | null
          reminder_days?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_documents_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "business_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_locations: {
        Row: {
          address: string
          city: string | null
          country: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          manager_id: string | null
          name: string
          notes: string | null
          opening_hours: string | null
          phone: string | null
          postcode: string | null
          state: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          manager_id?: string | null
          name: string
          notes?: string | null
          opening_hours?: string | null
          phone?: string | null
          postcode?: string | null
          state?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          city?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          manager_id?: string | null
          name?: string
          notes?: string | null
          opening_hours?: string | null
          phone?: string | null
          postcode?: string | null
          state?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          contact_name: string
          created_at: string
          custom_id: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          postcode: string | null
          state: string | null
          status: string
          updated_at: string
          user_id: string
          xero_contact_id: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_name: string
          created_at?: string
          custom_id?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
          xero_contact_id?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_name?: string
          created_at?: string
          custom_id?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          xero_contact_id?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          created_at: string
          department: string | null
          email: string | null
          entity_id: string
          entity_type: string
          id: string
          is_flat_rate: boolean | null
          is_primary: boolean | null
          monthly_cost: number | null
          name: string
          notes: string | null
          phone: string | null
          role: string
          services: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          email?: string | null
          entity_id: string
          entity_type: string
          id?: string
          is_flat_rate?: boolean | null
          is_primary?: boolean | null
          monthly_cost?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          role: string
          services?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          is_flat_rate?: boolean | null
          is_primary?: boolean | null
          monthly_cost?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          services?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contractor_documents: {
        Row: {
          contractor_id: string
          created_at: string
          document_type: string
          expiry_date: string | null
          file_path: string | null
          id: string
          issue_date: string | null
          name: string
          notes: string | null
          reminder_days: number | null
          status: string
          updated_at: string
        }
        Insert: {
          contractor_id: string
          created_at?: string
          document_type: string
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          issue_date?: string | null
          name: string
          notes?: string | null
          reminder_days?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          contractor_id?: string
          created_at?: string
          document_type?: string
          expiry_date?: string | null
          file_path?: string | null
          id?: string
          issue_date?: string | null
          name?: string
          notes?: string | null
          reminder_days?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_documents_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_history: {
        Row: {
          contractor_data: Json
          contractor_id: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          version_number: number
        }
        Insert: {
          contractor_data: Json
          contractor_id: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          version_number: number
        }
        Update: {
          contractor_data?: Json
          contractor_id?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "contractor_history_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_payments: {
        Row: {
          amount: number
          contractor_id: string
          created_at: string
          id: string
          invoice_number: string | null
          notes: string | null
          payment_date: string
          payment_method: string | null
          payment_status: string
          site_id: string | null
          updated_at: string
          work_order_id: string | null
        }
        Insert: {
          amount: number
          contractor_id: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date: string
          payment_method?: string | null
          payment_status?: string
          site_id?: string | null
          updated_at?: string
          work_order_id?: string | null
        }
        Update: {
          amount?: number
          contractor_id?: string
          created_at?: string
          id?: string
          invoice_number?: string | null
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          payment_status?: string
          site_id?: string | null
          updated_at?: string
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_payments_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_payments_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_payments_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_site_assignments: {
        Row: {
          contract_value: number | null
          contractor_id: string
          created_at: string
          end_date: string | null
          id: string
          payment_status: string | null
          payment_terms: string | null
          role: string
          site_id: string
          start_date: string | null
          updated_at: string
        }
        Insert: {
          contract_value?: number | null
          contractor_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          payment_status?: string | null
          payment_terms?: string | null
          role: string
          site_id: string
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          contract_value?: number | null
          contractor_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          payment_status?: string | null
          payment_terms?: string | null
          role?: string
          site_id?: string
          start_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contractor_site_assignments_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_site_assignments_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      contractors: {
        Row: {
          abn: string | null
          address: string | null
          business_name: string
          city: string | null
          contact_name: string
          contractor_type: string
          created_at: string
          day_rate: number | null
          email: string | null
          hourly_rate: number | null
          id: string
          notes: string | null
          phone: string | null
          postcode: string | null
          rating: number | null
          specialty: string[] | null
          state: string | null
          status: string
          tax_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          abn?: string | null
          address?: string | null
          business_name: string
          city?: string | null
          contact_name: string
          contractor_type: string
          created_at?: string
          day_rate?: number | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          rating?: number | null
          specialty?: string[] | null
          state?: string | null
          status?: string
          tax_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          abn?: string | null
          address?: string | null
          business_name?: string
          city?: string | null
          contact_name?: string
          contractor_type?: string
          created_at?: string
          day_rate?: number | null
          email?: string | null
          hourly_rate?: number | null
          id?: string
          notes?: string | null
          phone?: string | null
          postcode?: string | null
          rating?: number | null
          specialty?: string[] | null
          state?: string | null
          status?: string
          tax_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      invoice_line_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          tax_type: string | null
          unit_price: number
          updated_at: string
          xero_account_code: string | null
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          tax_type?: string | null
          unit_price?: number
          updated_at?: string
          xero_account_code?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          tax_type?: string | null
          unit_price?: number
          updated_at?: string
          xero_account_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          created_by: string | null
          due_date: string | null
          gst_inclusive: boolean
          id: string
          invoice_date: string
          invoice_number: string | null
          notes: string | null
          site_id: string | null
          status: string
          sync_status: string | null
          updated_at: string
          work_order_id: string | null
          xero_invoice_id: string | null
          xero_synced_at: string | null
        }
        Insert: {
          amount?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          gst_inclusive?: boolean
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          notes?: string | null
          site_id?: string | null
          status?: string
          sync_status?: string | null
          updated_at?: string
          work_order_id?: string | null
          xero_invoice_id?: string | null
          xero_synced_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          gst_inclusive?: boolean
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          notes?: string | null
          site_id?: string | null
          status?: string
          sync_status?: string | null
          updated_at?: string
          work_order_id?: string | null
          xero_invoice_id?: string | null
          xero_synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      overhead_profiles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          labor_percentage: number
          name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          labor_percentage?: number
          name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          labor_percentage?: number
          name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      quote_shifts: {
        Row: {
          allowances: Json | null
          break_duration: number | null
          created_at: string
          day: string
          employment_type: string
          end_time: string
          estimated_cost: number | null
          id: string
          level: number
          location: string | null
          notes: string | null
          number_of_cleaners: number | null
          quote_id: string | null
          start_time: string
          updated_at: string
        }
        Insert: {
          allowances?: Json | null
          break_duration?: number | null
          created_at?: string
          day: string
          employment_type: string
          end_time: string
          estimated_cost?: number | null
          id?: string
          level: number
          location?: string | null
          notes?: string | null
          number_of_cleaners?: number | null
          quote_id?: string | null
          start_time: string
          updated_at?: string
        }
        Update: {
          allowances?: Json | null
          break_duration?: number | null
          created_at?: string
          day?: string
          employment_type?: string
          end_time?: string
          estimated_cost?: number | null
          id?: string
          level?: number
          location?: string | null
          notes?: string | null
          number_of_cleaners?: number | null
          quote_id?: string | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_shifts_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_subcontractors: {
        Row: {
          cost: number
          created_at: string
          description: string | null
          frequency: string | null
          id: string
          name: string
          quote_id: string | null
          updated_at: string
        }
        Insert: {
          cost?: number
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          name: string
          quote_id?: string | null
          updated_at?: string
        }
        Update: {
          cost?: number
          created_at?: string
          description?: string | null
          frequency?: string | null
          id?: string
          name?: string
          quote_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_subcontractors_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_name: string | null
          contract_length: number | null
          contract_length_unit: string | null
          created_at: string
          created_by: string | null
          end_date: string | null
          expiry_date: string | null
          id: string
          labor_cost: number | null
          margin_amount: number | null
          margin_percentage: number | null
          name: string
          notes: string | null
          overhead_cost: number | null
          overhead_percentage: number | null
          overhead_profile: string | null
          site_name: string | null
          start_date: string | null
          status: string
          subcontractor_cost: number | null
          total_cost: number | null
          total_price: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_name?: string | null
          contract_length?: number | null
          contract_length_unit?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          expiry_date?: string | null
          id?: string
          labor_cost?: number | null
          margin_amount?: number | null
          margin_percentage?: number | null
          name: string
          notes?: string | null
          overhead_cost?: number | null
          overhead_percentage?: number | null
          overhead_profile?: string | null
          site_name?: string | null
          start_date?: string | null
          status?: string
          subcontractor_cost?: number | null
          total_cost?: number | null
          total_price?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_name?: string | null
          contract_length?: number | null
          contract_length_unit?: string | null
          created_at?: string
          created_by?: string | null
          end_date?: string | null
          expiry_date?: string | null
          id?: string
          labor_cost?: number | null
          margin_amount?: number | null
          margin_percentage?: number | null
          name?: string
          notes?: string | null
          overhead_cost?: number | null
          overhead_percentage?: number | null
          overhead_profile?: string | null
          site_name?: string | null
          start_date?: string | null
          status?: string
          subcontractor_cost?: number | null
          total_cost?: number | null
          total_price?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      site_additional_contracts: {
        Row: {
          auto_renew: boolean | null
          billing_cycle: string | null
          contract_number: string | null
          contract_type: string
          created_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          renewal_terms: string | null
          site_id: string | null
          start_date: string | null
          termination_period: string | null
          updated_at: string | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          auto_renew?: boolean | null
          billing_cycle?: string | null
          contract_number?: string | null
          contract_type: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          renewal_terms?: string | null
          site_id?: string | null
          start_date?: string | null
          termination_period?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          auto_renew?: boolean | null
          billing_cycle?: string | null
          contract_number?: string | null
          contract_type?: string
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          renewal_terms?: string | null
          site_id?: string | null
          start_date?: string | null
          termination_period?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "site_additional_contracts_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_billing_lines: {
        Row: {
          amount: number
          annual_amount: number | null
          created_at: string | null
          description: string
          frequency: string | null
          id: string
          is_recurring: boolean | null
          monthly_amount: number | null
          on_hold: boolean | null
          site_id: string | null
          updated_at: string | null
          weekly_amount: number | null
        }
        Insert: {
          amount?: number
          annual_amount?: number | null
          created_at?: string | null
          description: string
          frequency?: string | null
          id?: string
          is_recurring?: boolean | null
          monthly_amount?: number | null
          on_hold?: boolean | null
          site_id?: string | null
          updated_at?: string | null
          weekly_amount?: number | null
        }
        Update: {
          amount?: number
          annual_amount?: number | null
          created_at?: string | null
          description?: string
          frequency?: string | null
          id?: string
          is_recurring?: boolean | null
          monthly_amount?: number | null
          on_hold?: boolean | null
          site_id?: string | null
          updated_at?: string | null
          weekly_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "site_billing_lines_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      site_contract_history: {
        Row: {
          contract_details: Json
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          site_id: string
          version_number: number
        }
        Insert: {
          contract_details: Json
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          site_id: string
          version_number: number
        }
        Update: {
          contract_details?: Json
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          site_id?: string
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "site_contract_history_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          address: string
          annual_revenue: number | null
          billing_details: Json | null
          billing_hold_end_date: string | null
          billing_hold_start_date: string | null
          billing_on_hold: boolean | null
          city: string
          client_id: string
          contract_details: Json | null
          created_at: string
          custom_id: string | null
          email: string | null
          has_subcontractors: boolean | null
          id: string
          job_specifications: Json | null
          monthly_cost: number | null
          monthly_revenue: number | null
          name: string
          periodicals: Json | null
          phone: string | null
          postcode: string
          replenishables: Json | null
          representative: string
          security_details: Json | null
          state: string
          status: string
          subcontractors: Json | null
          updated_at: string
          user_id: string
          weekly_revenue: number | null
        }
        Insert: {
          address: string
          annual_revenue?: number | null
          billing_details?: Json | null
          billing_hold_end_date?: string | null
          billing_hold_start_date?: string | null
          billing_on_hold?: boolean | null
          city: string
          client_id: string
          contract_details?: Json | null
          created_at?: string
          custom_id?: string | null
          email?: string | null
          has_subcontractors?: boolean | null
          id?: string
          job_specifications?: Json | null
          monthly_cost?: number | null
          monthly_revenue?: number | null
          name: string
          periodicals?: Json | null
          phone?: string | null
          postcode: string
          replenishables?: Json | null
          representative: string
          security_details?: Json | null
          state: string
          status?: string
          subcontractors?: Json | null
          updated_at?: string
          user_id: string
          weekly_revenue?: number | null
        }
        Update: {
          address?: string
          annual_revenue?: number | null
          billing_details?: Json | null
          billing_hold_end_date?: string | null
          billing_hold_start_date?: string | null
          billing_on_hold?: boolean | null
          city?: string
          client_id?: string
          contract_details?: Json | null
          created_at?: string
          custom_id?: string | null
          email?: string | null
          has_subcontractors?: boolean | null
          id?: string
          job_specifications?: Json | null
          monthly_cost?: number | null
          monthly_revenue?: number | null
          name?: string
          periodicals?: Json | null
          phone?: string | null
          postcode?: string
          replenishables?: Json | null
          representative?: string
          security_details?: Json | null
          state?: string
          status?: string
          subcontractors?: Json | null
          updated_at?: string
          user_id?: string
          weekly_revenue?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      subcontractors: {
        Row: {
          business_name: string
          contact_name: string
          contractor_id: string | null
          created_at: string
          custom_services: string | null
          email: string | null
          id: string
          is_flat_rate: boolean | null
          monthly_cost: number | null
          phone: string | null
          services: Json | null
          site_id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          business_name: string
          contact_name: string
          contractor_id?: string | null
          created_at?: string
          custom_services?: string | null
          email?: string | null
          id?: string
          is_flat_rate?: boolean | null
          monthly_cost?: number | null
          phone?: string | null
          services?: Json | null
          site_id: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          business_name?: string
          contact_name?: string
          contractor_id?: string | null
          created_at?: string
          custom_services?: string | null
          email?: string | null
          id?: string
          is_flat_rate?: boolean | null
          monthly_cost?: number | null
          phone?: string | null
          services?: Json | null
          site_id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subcontractors_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subcontractors_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      user_integrations: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string | null
          id: string
          provider: string
          refresh_token: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at?: string | null
          id?: string
          provider: string
          refresh_token?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          provider?: string
          refresh_token?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          custom_id: string | null
          daily_summary: boolean | null
          email: string
          first_name: string | null
          full_name: string
          id: string
          last_login: string | null
          last_name: string | null
          notes: string | null
          phone: string | null
          role_id: string | null
          status: string
          territories: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          custom_id?: string | null
          daily_summary?: boolean | null
          email: string
          first_name?: string | null
          full_name: string
          id: string
          last_login?: string | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          role_id?: string | null
          status?: string
          territories?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          custom_id?: string | null
          daily_summary?: boolean | null
          email?: string
          first_name?: string | null
          full_name?: string
          id?: string
          last_login?: string | null
          last_name?: string | null
          notes?: string | null
          phone?: string | null
          role_id?: string | null
          status?: string
          territories?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          permissions: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          permissions?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          permissions?: Json
          updated_at?: string
        }
        Relationships: []
      }
      work_orders: {
        Row: {
          actual_cost: number | null
          assigned_to: string | null
          attachments: Json | null
          billing_amount: number | null
          completion_date: string | null
          created_at: string
          created_by: string
          description: string
          due_date: string | null
          estimated_cost: number | null
          id: string
          priority: string
          purchase_order_number: string | null
          requires_purchase_order: boolean
          site_id: string
          status: string
          sync_status: string | null
          title: string
          updated_at: string
          xero_invoice_id: string | null
          xero_purchase_order_id: string | null
          xero_synced_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          assigned_to?: string | null
          attachments?: Json | null
          billing_amount?: number | null
          completion_date?: string | null
          created_at?: string
          created_by: string
          description: string
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          priority: string
          purchase_order_number?: string | null
          requires_purchase_order?: boolean
          site_id: string
          status: string
          sync_status?: string | null
          title: string
          updated_at?: string
          xero_invoice_id?: string | null
          xero_purchase_order_id?: string | null
          xero_synced_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          assigned_to?: string | null
          attachments?: Json | null
          billing_amount?: number | null
          completion_date?: string | null
          created_at?: string
          created_by?: string
          description?: string
          due_date?: string | null
          estimated_cost?: number | null
          id?: string
          priority?: string
          purchase_order_number?: string | null
          requires_purchase_order?: boolean
          site_id?: string
          status?: string
          sync_status?: string | null
          title?: string
          updated_at?: string
          xero_invoice_id?: string | null
          xero_purchase_order_id?: string | null
          xero_synced_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "subcontractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_if_user_is_admin: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      get_auth_user: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_setting_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_admin_status: {
        Args: {
          user_uuid: string
        }
        Returns: boolean
      }
      get_user_policy_level: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: {
          user_uuid: string
        }
        Returns: string
      }
      is_user_accessing_own_profile: {
        Args: {
          profile_id: string
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
