DROP POLICY "Authenticated users can create orders" ON public.swish_orders;

CREATE POLICY "Users can create own orders"
ON public.swish_orders FOR INSERT
WITH CHECK (
  user_id IS NULL OR user_id = auth.uid()
);