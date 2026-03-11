

# Add "Clear Notifications" Button

## What
Add a "Rensa alla" (Clear all) button to the notification dropdown that deletes all notifications for the current user. This requires both a database change (RLS policy to allow DELETE) and UI/hook changes.

## Changes

### 1. Database Migration
The `notifications` table currently blocks DELETE. Add an RLS policy allowing users to delete their own notifications:

```sql
CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING (auth.uid() = user_id);
```

### 2. `useNotifications` Hook
Add a `clearAll` function that deletes all notifications for the current user via `supabase.from("notifications").delete().eq("user_id", user.id)`, then sets local state to `[]`.

Export `clearAll` from the hook.

### 3. `DashboardNavbar.tsx` (both dropdown instances)
In the notification header area (lines ~216-225 and ~442-451), add a "Rensa alla" button next to "Markera alla som lästa" when `notifications.length > 0`. Use a small `Trash2` icon + text. The button calls `clearAll()`.

Layout: flex row with both action buttons separated by a divider or gap.

