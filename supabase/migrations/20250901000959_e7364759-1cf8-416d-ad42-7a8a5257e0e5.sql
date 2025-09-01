-- Fix the security warning by setting search_path for our functions
ALTER FUNCTION public.get_current_user_role() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;