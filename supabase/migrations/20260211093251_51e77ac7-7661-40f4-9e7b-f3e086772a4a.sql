
-- Step 1: Fix swish_orders SELECT policies
DROP POLICY IF EXISTS "Admins can view all orders" ON public.swish_orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.swish_orders;

CREATE POLICY "Admins can view all orders"
ON public.swish_orders FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own orders"
ON public.swish_orders FOR SELECT
USING (auth.uid() = user_id);

-- Step 2: Fix swish_orders UPDATE policy
DROP POLICY IF EXISTS "Admins can update orders" ON public.swish_orders;

CREATE POLICY "Admins can update orders"
ON public.swish_orders FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 3: Add admin policies on users table
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all users"
ON public.users FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
