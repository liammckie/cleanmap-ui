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
      audit_checklist_items: {
        Row: {
          answer: string | null
          comments: string | null
          created_at: string
          id: string
          question: string
          score: number | null
          updated_at: string
          work_order_id: string
        }
        Insert: {
          answer?: string | null
          comments?: string | null
          created_at?: string
          id?: string
          question: string
          score?: number | null
          updated_at?: string
          work_order_id: string
        }
        Update: {
          answer?: string | null
          comments?: string | null
          created_at?: string
          id?: string
          question?: string
          score?: number | null
          updated_at?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_checklist_items_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          billing_address_city: string
          billing_address_postcode: string
          billing_address_state: string
          billing_address_street: string
          business_number: string | null
          company_name: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          industry: string | null
          notes: string | null
          on_hold_reason: string | null
          payment_terms: string
          region: string | null
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
        }
        Insert: {
          billing_address_city: string
          billing_address_postcode: string
          billing_address_state: string
          billing_address_street: string
          business_number?: string | null
          company_name: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          on_hold_reason?: string | null
          payment_terms: string
          region?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Update: {
          billing_address_city?: string
          billing_address_postcode?: string
          billing_address_state?: string
          billing_address_street?: string
          business_number?: string | null
          company_name?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          on_hold_reason?: string | null
          payment_terms?: string
          region?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          client_id: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_primary: boolean | null
          last_name: string
          notes: string | null
          phone: string | null
          position: string | null
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_primary?: boolean | null
          last_name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_primary?: boolean | null
          last_name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_change_logs: {
        Row: {
          approval_status: string | null
          change_date: string
          change_type: string
          changed_by: string | null
          contract_id: string
          created_at: string
          effective_date: string
          id: string
          new_value: string | null
          old_value: string | null
          updated_at: string
        }
        Insert: {
          approval_status?: string | null
          change_date?: string
          change_type: string
          changed_by?: string | null
          contract_id: string
          created_at?: string
          effective_date: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          updated_at?: string
        }
        Update: {
          approval_status?: string | null
          change_date?: string
          change_type?: string
          changed_by?: string | null
          contract_id?: string
          created_at?: string
          effective_date?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_change_logs_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contract_sites: {
        Row: {
          contract_id: string
          created_at: string
          id: string
          site_id: string
          updated_at: string
        }
        Insert: {
          contract_id: string
          created_at?: string
          id?: string
          site_id: string
          updated_at?: string
        }
        Update: {
          contract_id?: string
          created_at?: string
          id?: string
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_sites_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contract_sites_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          base_fee: number
          billing_frequency: string
          client_id: string
          contract_number: string
          contract_type: string
          created_at: string
          end_date: string | null
          id: string
          next_review_date: string | null
          payment_terms: string | null
          renewal_terms: string | null
          scope_of_work: string
          sla_kpi: string | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"]
          under_negotiation: boolean | null
          updated_at: string
        }
        Insert: {
          base_fee: number
          billing_frequency: string
          client_id: string
          contract_number: string
          contract_type: string
          created_at?: string
          end_date?: string | null
          id?: string
          next_review_date?: string | null
          payment_terms?: string | null
          renewal_terms?: string | null
          scope_of_work: string
          sla_kpi?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"]
          under_negotiation?: boolean | null
          updated_at?: string
        }
        Update: {
          base_fee?: number
          billing_frequency?: string
          client_id?: string
          contract_number?: string
          contract_type?: string
          created_at?: string
          end_date?: string | null
          id?: string
          next_review_date?: string | null
          payment_terms?: string | null
          renewal_terms?: string | null
          scope_of_work?: string
          sla_kpi?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"]
          under_negotiation?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
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
          end_of_employment_date: string | null
          end_of_employment_reason: string | null
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
          end_of_employment_date?: string | null
          end_of_employment_reason?: string | null
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
          end_of_employment_date?: string | null
          end_of_employment_reason?: string | null
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
      leads: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          converted_client_id: string | null
          converted_quote_id: string | null
          created_at: string
          created_by: string
          id: string
          lead_name: string
          next_action: string | null
          next_action_date: string | null
          notes: string | null
          potential_value: number
          source: Database["public"]["Enums"]["lead_source"] | null
          stage: Database["public"]["Enums"]["lead_stage"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          converted_client_id?: string | null
          converted_quote_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          lead_name: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          potential_value?: number
          source?: Database["public"]["Enums"]["lead_source"] | null
          stage?: Database["public"]["Enums"]["lead_stage"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          converted_client_id?: string | null
          converted_quote_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          lead_name?: string
          next_action?: string | null
          next_action_date?: string | null
          notes?: string | null
          potential_value?: number
          source?: Database["public"]["Enums"]["lead_source"] | null
          stage?: Database["public"]["Enums"]["lead_stage"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_converted_client_id_fkey"
            columns: ["converted_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_converted_quote_id_fkey"
            columns: ["converted_quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
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
      quote_line_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          quantity: number
          quote_id: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          quantity?: number
          quote_id: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          quantity?: number
          quote_id?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_line_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_sites: {
        Row: {
          created_at: string
          id: string
          quote_id: string
          site_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          quote_id: string
          site_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          quote_id?: string
          site_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_sites_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_sites_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: string | null
          converted_contract_id: string | null
          converted_work_order_id: string | null
          created_at: string
          created_by: string
          id: string
          internal_cost_estimate: number | null
          issue_date: string
          lead_id: string | null
          notes: string | null
          quote_number: string
          service_description: string
          service_request_id: string | null
          status: Database["public"]["Enums"]["quote_status"]
          total_amount: number
          updated_at: string
          valid_until: string
        }
        Insert: {
          client_id?: string | null
          converted_contract_id?: string | null
          converted_work_order_id?: string | null
          created_at?: string
          created_by: string
          id?: string
          internal_cost_estimate?: number | null
          issue_date: string
          lead_id?: string | null
          notes?: string | null
          quote_number: string
          service_description: string
          service_request_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          total_amount?: number
          updated_at?: string
          valid_until: string
        }
        Update: {
          client_id?: string | null
          converted_contract_id?: string | null
          converted_work_order_id?: string | null
          created_at?: string
          created_by?: string
          id?: string
          internal_cost_estimate?: number | null
          issue_date?: string
          lead_id?: string | null
          notes?: string | null
          quote_number?: string
          service_description?: string
          service_request_id?: string | null
          status?: Database["public"]["Enums"]["quote_status"]
          total_amount?: number
          updated_at?: string
          valid_until?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_converted_contract_id_fkey"
            columns: ["converted_contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_converted_work_order_id_fkey"
            columns: ["converted_work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_templates: {
        Row: {
          created_at: string
          default_assignee: string | null
          id: string
          next_occurrence_date: string
          preferred_time: string | null
          recurrence_rule: string
          site_id: string
          task_description: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_assignee?: string | null
          id?: string
          next_occurrence_date: string
          preferred_time?: string | null
          recurrence_rule: string
          site_id: string
          task_description: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_assignee?: string | null
          id?: string
          next_occurrence_date?: string
          preferred_time?: string | null
          recurrence_rule?: string
          site_id?: string
          task_description?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_templates_default_assignee_fkey"
            columns: ["default_assignee"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_templates_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          billable: boolean | null
          client_id: string
          client_notes: string | null
          created_at: string
          decision_notes: string | null
          id: string
          preferred_date: string | null
          quote_id: string | null
          request_date: string
          reviewed_by: string | null
          service_details: string
          site_id: string
          status: Database["public"]["Enums"]["service_request_status"]
          updated_at: string
          work_order_id: string | null
        }
        Insert: {
          billable?: boolean | null
          client_id: string
          client_notes?: string | null
          created_at?: string
          decision_notes?: string | null
          id?: string
          preferred_date?: string | null
          quote_id?: string | null
          request_date?: string
          reviewed_by?: string | null
          service_details: string
          site_id: string
          status?: Database["public"]["Enums"]["service_request_status"]
          updated_at?: string
          work_order_id?: string | null
        }
        Update: {
          billable?: boolean | null
          client_id?: string
          client_notes?: string | null
          created_at?: string
          decision_notes?: string | null
          id?: string
          preferred_date?: string | null
          quote_id?: string | null
          request_date?: string
          reviewed_by?: string | null
          service_details?: string
          site_id?: string
          status?: Database["public"]["Enums"]["service_request_status"]
          updated_at?: string
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          address_city: string
          address_postcode: string
          address_state: string
          address_street: string
          client_id: string
          coordinates: string | null
          created_at: string
          id: string
          region: string | null
          service_start_date: string
          site_manager_id: string | null
          site_name: string
          site_type: string
          special_instructions: string | null
          status: Database["public"]["Enums"]["site_status"]
          updated_at: string
        }
        Insert: {
          address_city: string
          address_postcode: string
          address_state: string
          address_street: string
          client_id: string
          coordinates?: string | null
          created_at?: string
          id?: string
          region?: string | null
          service_start_date: string
          site_manager_id?: string | null
          site_name: string
          site_type: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["site_status"]
          updated_at?: string
        }
        Update: {
          address_city?: string
          address_postcode?: string
          address_state?: string
          address_street?: string
          client_id?: string
          coordinates?: string | null
          created_at?: string
          id?: string
          region?: string | null
          service_start_date?: string
          site_manager_id?: string | null
          site_name?: string
          site_type?: string
          special_instructions?: string | null
          status?: Database["public"]["Enums"]["site_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sites_site_manager_id_fkey"
            columns: ["site_manager_id"]
            isOneToOne: false
            referencedRelation: "contacts"
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
      work_order_assignments: {
        Row: {
          assignment_type: string
          created_at: string
          employee_id: string
          id: string
          updated_at: string
          work_order_id: string
        }
        Insert: {
          assignment_type: string
          created_at?: string
          employee_id: string
          id?: string
          updated_at?: string
          work_order_id: string
        }
        Update: {
          assignment_type?: string
          created_at?: string
          employee_id?: string
          id?: string
          updated_at?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_assignments_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_notes: {
        Row: {
          author_id: string | null
          created_at: string
          id: string
          note: string
          updated_at: string
          visibility: string
          work_order_id: string
        }
        Insert: {
          author_id?: string | null
          created_at?: string
          id?: string
          note: string
          updated_at?: string
          visibility?: string
          work_order_id: string
        }
        Update: {
          author_id?: string | null
          created_at?: string
          id?: string
          note?: string
          updated_at?: string
          visibility?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_notes_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          actual_duration: number | null
          audit_followup_required: boolean | null
          audit_score: number | null
          category: Database["public"]["Enums"]["work_order_category"]
          client_signoff: boolean | null
          completed_by: string | null
          completion_status: string | null
          completion_timestamp: string | null
          contract_id: string | null
          created_at: string
          description: string
          due_date: string
          id: string
          outcome_notes: string | null
          priority: Database["public"]["Enums"]["work_order_priority"]
          recurring_template_id: string | null
          scheduled_start: string
          site_id: string
          status: Database["public"]["Enums"]["work_order_status"]
          title: string
          updated_at: string
        }
        Insert: {
          actual_duration?: number | null
          audit_followup_required?: boolean | null
          audit_score?: number | null
          category: Database["public"]["Enums"]["work_order_category"]
          client_signoff?: boolean | null
          completed_by?: string | null
          completion_status?: string | null
          completion_timestamp?: string | null
          contract_id?: string | null
          created_at?: string
          description: string
          due_date: string
          id?: string
          outcome_notes?: string | null
          priority?: Database["public"]["Enums"]["work_order_priority"]
          recurring_template_id?: string | null
          scheduled_start: string
          site_id: string
          status?: Database["public"]["Enums"]["work_order_status"]
          title: string
          updated_at?: string
        }
        Update: {
          actual_duration?: number | null
          audit_followup_required?: boolean | null
          audit_score?: number | null
          category?: Database["public"]["Enums"]["work_order_category"]
          client_signoff?: boolean | null
          completed_by?: string | null
          completion_status?: string | null
          completion_timestamp?: string | null
          contract_id?: string | null
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          outcome_notes?: string | null
          priority?: Database["public"]["Enums"]["work_order_priority"]
          recurring_template_id?: string | null
          scheduled_start?: string
          site_id?: string
          status?: Database["public"]["Enums"]["work_order_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_recurring_template_id_fkey"
            columns: ["recurring_template_id"]
            isOneToOne: false
            referencedRelation: "recurring_templates"
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
      get_employee_status_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_employment_termination_reason_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_employment_type_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_lead_source_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_lead_stage_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_lead_status_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_quote_status_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_site_counts: {
        Args: {
          group_field: string
        }
        Returns: {
          group_value: string
          count: number
        }[]
      }
      get_work_order_category_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_work_order_priority_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
      get_work_order_status_enum: {
        Args: Record<PropertyKey, never>
        Returns: string[]
      }
    }
    Enums: {
      client_status: "Active" | "On Hold"
      contract_status: "Active" | "Expiring" | "Expired" | "Terminated"
      employee_status: "Onboarding" | "Active" | "Terminated"
      employment_termination_reason:
        | "Resignation"
        | "Contract End"
        | "Termination"
        | "Retirement"
        | "Other"
      employment_type: "Full-time" | "Part-time" | "Contractor"
      lead_source:
        | "Referral"
        | "Website"
        | "Cold Call"
        | "Event"
        | "Partner"
        | "Other"
      lead_stage: "Discovery" | "Proposal" | "Negotiation" | "Won" | "Lost"
      lead_status: "Open" | "Closed-Won" | "Closed-Lost"
      pay_cycle: "Weekly" | "Fortnightly" | "Monthly"
      quote_status: "Draft" | "Sent" | "Accepted" | "Rejected"
      review_type: "Probation" | "Quarterly" | "Annual" | "Special"
      service_request_status:
        | "Pending Review"
        | "Quoted"
        | "Approved"
        | "Scheduled"
        | "Rejected"
      site_status: "Active" | "Inactive" | "Pending Launch" | "Suspended"
      task_status: "Pending" | "In Progress" | "Completed"
      timesheet_status: "Pending Approval" | "Approved" | "Rejected"
      work_order_category: "Routine Clean" | "Ad-hoc Request" | "Audit"
      work_order_priority: "Low" | "Medium" | "High"
      work_order_status:
        | "Scheduled"
        | "In Progress"
        | "Completed"
        | "Overdue"
        | "Cancelled"
        | "On Hold"
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
