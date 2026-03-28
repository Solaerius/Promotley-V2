# Promotley — Rollback Strategy

**Last updated:** 2026-03-27

---

## Overview

This document defines how to roll back Promotley to a previous working state in case of a failed deployment, broken migration, or critical incident.

---

## 1. Tagging Releases

Before every production deployment, create a git tag:

```bash
git tag -a v1.x.x -m "Release: brief description of changes"
git push origin v1.x.x
```

List tags: `git tag -l` | `git log --oneline --decorate`

---

## 2. Frontend Rollback

**Vercel (recommended host):**
1. Open Vercel dashboard → Project → Deployments
2. Find the last stable deployment
3. Click **...** → **Promote to Production**
4. Done — no code changes needed

**Manual git rollback:**
```bash
git checkout v1.x.x          # Switch to last stable tag
git push origin HEAD:main --force   # Only if necessary
# OR create a revert commit:
git revert HEAD --no-edit
git push origin main
```

---

## 3. Database Migration Rollback

Supabase does not automatically roll back migrations. For each migration that must be undone, a manual DOWN script must be run in the Supabase SQL Editor.

### Migration rollback scripts

| Migration | Description | DOWN Script |
|-----------|-------------|-------------|
| `20260327000001_add_missing_indexes.sql` | Adds performance indexes | Run: `DROP INDEX IF EXISTS idx_ai_chat_messages_user_id, idx_calendar_posts_user_id, idx_calendar_posts_date, idx_connections_user_id, idx_notifications_user_id, idx_notifications_created_at, idx_profiles_user_id, idx_social_stats_user_id_updated;` |

**How to run a DOWN script:**
1. Open Supabase Dashboard → SQL Editor
2. Paste and run the DOWN script
3. Verify with `\d table_name` or check the Table Editor

**WARNING:** Never roll back a migration that adds a column or table that production data depends on without first backing up the data.

---

## 4. Edge Function Rollback

Supabase Edge Functions are versioned per deployment.

```bash
# List deployed functions
supabase functions list

# Redeploy a specific function from a previous git commit
git checkout v1.x.x -- supabase/functions/ai-assistant/
supabase functions deploy ai-assistant
```

---

## 5. Incident Response Checklist

```
DETECT
  □ Alert received (Discord webhook / Sentry / user report)
  □ Confirm the issue is reproducible
  □ Identify scope: frontend only / edge function / database

ASSESS
  □ Is data being corrupted? → Stop writes immediately
  □ Is auth broken? → Roll back immediately
  □ Is it isolated to one feature? → Consider feature flag / disable

ROLLBACK DECISION
  □ Can be fixed forward in < 30 min? → Fix forward
  □ Data corruption risk? → Roll back database first
  □ Multiple systems affected? → Roll back all simultaneously

EXECUTE
  □ Announce in team Discord: "Rolling back to v1.x.x — ETA 5 min"
  □ Frontend: Promote previous Vercel deployment
  □ Database: Run DOWN migration script in SQL Editor
  □ Edge functions: Redeploy from previous git tag
  □ Verify: Check key user flows (login, dashboard, AI chat)

POST-MORTEM
  □ Document what went wrong
  □ Add the issue pattern to CLAUDE.md "Common Mistakes"
  □ Update this document if rollback process was unclear
```

---

## 6. Backup Strategy

- **Database:** Supabase provides automatic daily backups on Pro plan. For critical migrations, manually export with `pg_dump` before running.
- **Code:** GitHub is the source of truth. All production code is tagged.
- **Secrets:** Supabase secrets are managed in the Supabase dashboard — do not store in git.

---

## 7. Contacts

| Role | Contact |
|------|---------|
| Tech lead | Check your team's Discord |
| Supabase support | support.supabase.com |
| Stripe support | dashboard.stripe.com/support |
