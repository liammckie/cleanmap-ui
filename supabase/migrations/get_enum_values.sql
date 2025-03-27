
-- Function to get client status enum values
CREATE OR REPLACE FUNCTION public.get_client_status_enum()
RETURNS SETOF text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT unnest(enum_range(NULL::public.client_status)::text[]);
END;
$$;

-- Function to get site status enum values
CREATE OR REPLACE FUNCTION public.get_site_status_enum()
RETURNS SETOF text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT unnest(enum_range(NULL::public.site_status)::text[]);
END;
$$;

-- Function to get contract status enum values
CREATE OR REPLACE FUNCTION public.get_contract_status_enum()
RETURNS SETOF text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT unnest(enum_range(NULL::public.contract_status)::text[]);
END;
$$;

-- Function to get work order status enum values
CREATE OR REPLACE FUNCTION public.get_work_order_status_enum()
RETURNS SETOF text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT unnest(enum_range(NULL::public.work_order_status)::text[]);
END;
$$;

-- Function to get work order category enum values
CREATE OR REPLACE FUNCTION public.get_work_order_category_enum()
RETURNS SETOF text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT unnest(enum_range(NULL::public.work_order_category)::text[]);
END;
$$;

-- Function to get work order priority enum values
CREATE OR REPLACE FUNCTION public.get_work_order_priority_enum()
RETURNS SETOF text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT unnest(enum_range(NULL::public.work_order_priority)::text[]);
END;
$$;

-- Function to get service request status enum values
CREATE OR REPLACE FUNCTION public.get_service_request_status_enum()
RETURNS SETOF text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY SELECT unnest(enum_range(NULL::public.service_request_status)::text[]);
END;
$$;
