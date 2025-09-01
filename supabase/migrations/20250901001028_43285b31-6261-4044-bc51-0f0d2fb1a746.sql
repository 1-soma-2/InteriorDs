-- Fix the security warning by setting search_path for existing functions only
ALTER FUNCTION public.get_current_user_role() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;