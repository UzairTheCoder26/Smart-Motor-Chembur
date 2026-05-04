-- Security hardening:
-- Disable public "first admin bootstrap" policy.

DROP POLICY IF EXISTS "Allow first admin bootstrap" ON public.user_roles;
