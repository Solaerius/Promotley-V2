-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for making HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule OAuth state cleanup to run every 15 minutes
SELECT cron.schedule(
  'cleanup-oauth-states-every-15min',
  '*/15 * * * *', -- Every 15 minutes
  $$
  SELECT
    net.http_post(
        url:='https://fmvbzhlqzzwzciqgbzgp.supabase.co/functions/v1/cleanup-oauth-states',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtdmJ6aGxxenp3emNpcWdiemdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMjExMTMsImV4cCI6MjA3NDg5NzExM30.wLjl4fNlmlsFxQCveTQvAm8FfQHJZcKa2Oi7B6xi1DI"}'::jsonb,
        body:=concat('{"triggered_at": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);