-- Allow organization members to view basic info (email, avatar) of other members in the same org
CREATE POLICY "Org members can view other org members basic info"
ON public.users
FOR SELECT
USING (
  EXISTS (
    SELECT 1 
    FROM organization_members om1
    JOIN organization_members om2 ON om1.organization_id = om2.organization_id
    WHERE om1.user_id = auth.uid() 
      AND om2.user_id = users.id
  )
);