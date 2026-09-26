REVOKE ALL ON FUNCTION public.log_yzt_card_applications() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.log_yzt_card_applications() FROM anon;
REVOKE ALL ON FUNCTION public.log_yzt_card_applications() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.log_yzt_card_applications() TO service_role;