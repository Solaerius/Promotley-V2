# Promotley Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two silent social-data error toasts, build an organization setup wizard, redesign the public landing page and dashboard, update the demo page, and add a post-OAuth org selection screen.

**Architecture:** Six sequential feature areas; Tasks 1→2→3→4→5→6 must run in order (Task 4 modifies Dashboard.tsx which Task 1 already touches — preserve Task 1 changes). No test framework exists; verification is `npm run build` + `npm run dev` visual check. All UI text in Swedish with correct Å/Ä/Ö.

**Tech Stack:** React 18 + TypeScript + Vite, Tailwind CSS + shadcn/ui, Supabase (Postgres + RLS + Edge Functions), React Query, Framer Motion, lucide-react.

**Spec:** `docs/superpowers/specs/2026-03-19-promotley-rebuild-design.md`

---

## File Map

| File | Action | Task |
|------|--------|------|
| `src/hooks/useTikTokData.ts` | Modify — add `enabled` option | 1 |
| `src/hooks/useMetaData.ts` | Modify — add `enabled` option | 1 |
| `src/pages/Dashboard.tsx` | Modify — pass `enabled` flags (Task 1), then full UI rebuild (Task 4) | 1, 4 |
| `supabase/migrations/20260319120000_add_organization_profiles.sql` | Create — new table + RLS | 2 |
| `src/pages/CreateOrganization.tsx` | Replace — 4-step wizard | 2 |
| `src/components/LogoStrip.tsx` | Create — infinite scroll logo band | 3 |
| `src/components/Navbar.tsx` | Replace — transparent → frosted glass on scroll | 3 |
| `src/components/Hero.tsx` | Replace — two-column layout with OAuth buttons | 3 |
| `src/pages/Index.tsx` | Modify — insert `<LogoStrip />` after `<Hero />` | 3 |
| `src/pages/Auth.tsx` | Modify — fix OAuth `redirectTo` for Google + Apple | 3 |
| `src/data/demoData.ts` | Modify — add `demoAIResponses` object | 5 |
| `src/pages/Demo.tsx` | Modify — first-click response display, second-click modal | 5 |
| `src/components/OAuthLandingScreen.tsx` | Create — register vs join decision screen | 6 |
| `src/pages/AuthCallback.tsx` | Modify — OAuth provider branch + org membership check | 6 |

---

## Task 1: Fix TikTok + Meta Silent Error Toasts

**Files:**
- Modify: `src/hooks/useTikTokData.ts`
- Modify: `src/hooks/useMetaData.ts`
- Modify: `src/pages/Dashboard.tsx`

- [ ] **Step 1: Add `enabled` option to `useTikTokData`**

Open `src/hooks/useTikTokData.ts`. Change the hook signature and `useEffect` as follows:

```ts
// Change the export line from:
export const useTikTokData = () => {
// To:
export const useTikTokData = ({ enabled = true }: { enabled?: boolean } = {}) => {
```

Change the `loading` initial state:
```ts
// Change from:
const [loading, setLoading] = useState(!_cache);
// To:
const [loading, setLoading] = useState(!_cache && enabled);
```

Change the `useEffect` at the bottom of the hook:
```ts
// Change from:
useEffect(() => {
  const isStale = Date.now() - _cacheTime > STALE_MS;
  if (_cache && !isStale) {
    return;
  }
  fetchTikTokData();
}, []);
// To:
useEffect(() => {
  if (!enabled) return;
  const isStale = Date.now() - _cacheTime > STALE_MS;
  if (_cache && !isStale) {
    return;
  }
  fetchTikTokData();
}, [enabled]);
```

**Note on `[enabled]` dep array:** When `enabled` transitions `false → true` (connections load + TikTok connected), the effect fires and starts a fetch — correct. The module-level `_inflight` deduplication prevents duplicate parallel fetches. In normal usage `enabled` is stable once `true` (connections don't flap), so the race risk is negligible. Do not change this dep array — it is intentional.

- [ ] **Step 2: Add `enabled` option to `useMetaData`**

Open `src/hooks/useMetaData.ts`. Apply the same pattern:

```ts
// Change signature from:
export const useMetaData = () => {
// To:
export const useMetaData = ({ enabled = true }: { enabled?: boolean } = {}) => {
```

Change `loading` initial state:
```ts
// Change from:
const [loading, setLoading] = useState(true);
// To:
const [loading, setLoading] = useState(false);
```

Change `useEffect`:
```ts
// Change from:
useEffect(() => {
  fetchMetaData();
}, []);
// To:
useEffect(() => {
  if (!enabled) return;
  setLoading(true);
  fetchMetaData();
}, [enabled]);
```

- [ ] **Step 3: Update Dashboard.tsx to pass `enabled` flags**

Open `src/pages/Dashboard.tsx`. Find the three hook calls near the top of the component body (around lines 50–53):

```ts
// Change from:
const tiktokData = useTikTokData();
const metaData = useMetaData();
// To:
const { isConnected, loading: connectionsLoading } = useConnections();
const tiktokData = useTikTokData({ enabled: !connectionsLoading && isConnected("tiktok") });
const metaData = useMetaData({ enabled: !connectionsLoading && (isConnected("meta_ig") || isConnected("meta_fb")) });
```

Remove the old standalone `const { isConnected, connections } = useConnections();` line if it exists (the new line above replaces it — check for duplicates).

- [ ] **Step 4: Verify — TypeScript build check**

```bash
npm run build
```

Expected: no TypeScript errors related to the hook signatures.

- [ ] **Step 5: Verify — no error toasts on fresh account**

```bash
npm run dev
```

Sign in as a new user with no connected social accounts. Open Dashboard. Verify: zero "Kunde inte hämta TikTok-data" or "Kunde inte hämta Meta-data" toast messages appear.

- [ ] **Step 6: Commit**

```bash
rtk git add src/hooks/useTikTokData.ts src/hooks/useMetaData.ts src/pages/Dashboard.tsx && rtk git commit -m "fix: suppress social data error toasts when no accounts connected"
```

---

## Task 2A: Supabase Migration — organization_profiles table

**Files:**
- Create: `supabase/migrations/20260319120000_add_organization_profiles.sql`

- [ ] **Step 1: Create migration file**

Create `supabase/migrations/20260319120000_add_organization_profiles.sql` with:

```sql
-- Create organization_profiles table (1:1 with organizations)
create table public.organization_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  industry text,
  website text,
  city text,
  target_audience text,
  unique_properties text,
  tone text,
  goals text,
  instagram_handle text,
  tiktok_handle text,
  facebook_handle text,
  linkedin_handle text,
  x_handle text,
  newsletter_opt_in boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.organization_profiles enable row level security;

-- Members can read
create policy "Members can view org profile"
  on public.organization_profiles for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
    )
  );

-- Founders/admins can insert (note: includes 'founder' role)
create policy "Admins can insert org profile"
  on public.organization_profiles for insert
  with check (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
        and role in ('founder', 'admin', 'owner')
    )
  );

-- Founders/admins can update
create policy "Admins can update org profile"
  on public.organization_profiles for update
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
        and role in ('founder', 'admin', 'owner')
    )
  )
  with check (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
        and role in ('founder', 'admin', 'owner')
    )
  );
```

- [ ] **Step 2: Apply migration to Supabase**

```bash
npx supabase db push
```

Expected: migration applies without errors. If Supabase CLI is not linked, run:
```bash
npx supabase link --project-ref $(cat supabase/.temp/project-ref)
npx supabase db push
```

- [ ] **Step 3: Commit migration file**

```bash
rtk git add supabase/migrations/20260319120000_add_organization_profiles.sql && rtk git commit -m "feat: add organization_profiles table with RLS"
```

---

## Task 2B: Organization Setup Wizard

**Files:**
- Replace: `src/pages/CreateOrganization.tsx`

- [ ] **Step 1: Rewrite CreateOrganization.tsx as a 4-step wizard**

Replace the entire file with:

```tsx
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Building2, Check, Loader2, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Grundinfo" },
  { id: 2, label: "Marknadsföring" },
  { id: 3, label: "Sociala medier" },
  { id: 4, label: "Villkor" },
];

interface FormData {
  // Step 1
  orgName: string;
  industry: string;
  website: string;
  city: string;
  // Step 2
  targetAudience: string;
  uniqueProperties: string;
  tone: string;
  goals: string;
  // Step 3
  instagramHandle: string;
  tiktokHandle: string;
  facebookHandle: string;
  linkedinHandle: string;
  xHandle: string;
  // Step 4
  acceptTerms: boolean;
  newsletterOptIn: boolean;
}

const INITIAL_FORM: FormData = {
  orgName: "", industry: "", website: "", city: "",
  targetAudience: "", uniqueProperties: "", tone: "", goals: "",
  instagramHandle: "", tiktokHandle: "", facebookHandle: "", linkedinHandle: "", xHandle: "",
  acceptTerms: false, newsletterOptIn: false,
};

// Required fields per step
const REQUIRED: Record<number, (keyof FormData)[]> = {
  1: ["orgName"],
  2: ["targetAudience", "uniqueProperties"],
  3: [],
  4: ["acceptTerms"],
};

function RequiredStar() {
  return <span className="text-orange-500 ml-0.5">★</span>;
}

function AutoTextarea({ value, onChange, placeholder, id }: {
  value: string; onChange: (v: string) => void; placeholder: string; id: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <textarea
      ref={ref}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none overflow-hidden min-h-[64px]"
    />
  );
}

export default function CreateOrganization() {
  const { createOrganization } = useOrganization();
  const { session } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Set<keyof FormData>>(new Set());
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const firstErrorRef = useRef<HTMLElement | null>(null);

  const set = (key: keyof FormData) => (value: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const isStepValid = (s: number) => {
    return REQUIRED[s].every(field => {
      const val = form[field];
      return typeof val === "boolean" ? val : (val as string).trim().length > 0;
    });
  };

  const validateCurrentStep = () => {
    const missing = new Set<keyof FormData>();
    REQUIRED[step].forEach(field => {
      const val = form[field];
      const empty = typeof val === "boolean" ? !val : !(val as string).trim();
      if (empty) missing.add(field);
    });
    setErrors(missing);
    return missing.size === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;
    setCompletedSteps(prev => new Set([...prev, step]));
    setErrors(new Set());
    setStep(s => s + 1);
  };

  const handlePrev = () => {
    setErrors(new Set());
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    const newAttempts = submitAttempts + 1;
    setSubmitAttempts(newAttempts);

    if (!validateCurrentStep()) {
      if (newAttempts >= 2) {
        // Scroll to first error and pulse it
        setTimeout(() => {
          const el = document.querySelector('[data-error="true"]') as HTMLElement;
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("animate-pulse");
            setTimeout(() => el.classList.remove("animate-pulse"), 1500);
          }
        }, 50);
      }
      return;
    }

    if (!session) return;
    setIsSubmitting(true);

    try {
      const orgId = await createOrganization(form.orgName.trim());
      if (!orgId) throw new Error("Org creation failed");

      // Insert organization_profiles row
      // RLS requires 'founder' role — the create_organization_with_founder RPC adds the user
      // as 'founder' atomically before this insert, so the policy will pass.
      const { error: profileError } = await supabase.from("organization_profiles").insert({
        organization_id: orgId,
        industry: form.industry || null,
        website: form.website || null,
        city: form.city || null,
        target_audience: form.targetAudience || null,
        unique_properties: form.uniqueProperties || null,
        tone: form.tone || null,
        goals: form.goals || null,
        instagram_handle: form.instagramHandle || null,
        tiktok_handle: form.tiktokHandle || null,
        facebook_handle: form.facebookHandle || null,
        linkedin_handle: form.linkedinHandle || null,
        x_handle: form.xHandle || null,
        newsletter_opt_in: form.newsletterOptIn,
      });

      if (profileError) {
        // Non-fatal: org was created, profile insert failed (RLS or DB issue)
        console.error("Failed to save org profile:", profileError);
        // Still navigate — org exists, profile data can be filled in Settings
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldError = (key: keyof FormData) => errors.has(key);

  const inputClass = (key: keyof FormData) =>
    cn("w-full", fieldError(key) && "border-red-500 focus-visible:ring-red-500");

  return (
    <div className="min-h-screen flex bg-background">
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-start py-12 px-4">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src={logo} alt="Promotley" className="w-10 h-10" />
          <span className="font-bold text-xl">Promotley</span>
        </Link>

        <div className="w-full max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Konfigurera ditt företag</h1>
              <p className="text-sm text-muted-foreground">Steg {step} av {STEPS.length}</p>
            </div>
          </div>

          {/* Step 1: Grundinfo */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="orgName">Företagsnamn<RequiredStar /></Label>
                <Input
                  id="orgName"
                  className={inputClass("orgName")}
                  data-error={fieldError("orgName") || undefined}
                  placeholder='T.ex. "Stockholms Kaffet UF"'
                  value={form.orgName}
                  onChange={e => set("orgName")(e.target.value)}
                />
                {fieldError("orgName") && <p className="text-xs text-red-500 mt-1">Obligatoriskt fält</p>}
              </div>
              <div>
                <Label htmlFor="industry">Bransch</Label>
                <Input
                  id="industry"
                  placeholder='T.ex. "Livsmedel & dryck", "Mode", "Teknik"'
                  value={form.industry}
                  onChange={e => set("industry")(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="website">Webbplats</Label>
                <Input
                  id="website"
                  placeholder="T.ex. www.mittuforetag.se"
                  value={form.website}
                  onChange={e => set("website")(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">Stad</Label>
                <Input
                  id="city"
                  placeholder='T.ex. "Stockholm", "Göteborg"'
                  value={form.city}
                  onChange={e => set("city")(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Marknadsföring */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <Label htmlFor="targetAudience">Målgrupp<RequiredStar /></Label>
                <AutoTextarea
                  id="targetAudience"
                  value={form.targetAudience}
                  onChange={v => set("targetAudience")(v)}
                  placeholder='T.ex. "Ungdomar 16–25 år i Stockholm som är intresserade av hållbarhet och lokal mat"'
                />
                {fieldError("targetAudience") && <p className="text-xs text-red-500 mt-1">Obligatoriskt fält</p>}
              </div>
              <div>
                <Label htmlFor="uniqueProperties">Unika egenskaper<RequiredStar /></Label>
                <AutoTextarea
                  id="uniqueProperties"
                  value={form.uniqueProperties}
                  onChange={v => set("uniqueProperties")(v)}
                  placeholder='T.ex. "Vi rostar lokalt, all förpackning är återvinningsbar och vi donerar 5% till välgörenhet"'
                />
                {fieldError("uniqueProperties") && <p className="text-xs text-red-500 mt-1">Obligatoriskt fält</p>}
              </div>
              <div>
                <Label htmlFor="tone">Tonalitet</Label>
                <Input
                  id="tone"
                  placeholder='T.ex. "Vänlig och inspirerande", "Professionell men jordnära"'
                  value={form.tone}
                  onChange={e => set("tone")(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="goals">Marknadsföringsmål</Label>
                <AutoTextarea
                  id="goals"
                  value={form.goals}
                  onChange={v => set("goals")(v)}
                  placeholder='T.ex. "Öka Instagram-följarna med 500 på 3 månader och driva trafik till vår webbshop"'
                />
              </div>
            </div>
          )}

          {/* Step 3: Sociala medier */}
          {step === 3 && (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Ange era sociala medier-handles så att AI:n kan skräddarsy innehåll för er. Du kan också lägga till dessa senare.
              </p>
              {[
                { key: "instagramHandle" as keyof FormData, label: "Instagram", placeholder: "@mittuforetag" },
                { key: "tiktokHandle" as keyof FormData, label: "TikTok", placeholder: "@mittuforetag" },
                { key: "facebookHandle" as keyof FormData, label: "Facebook", placeholder: "facebook.com/mittuforetag" },
                { key: "linkedinHandle" as keyof FormData, label: "LinkedIn", placeholder: "linkedin.com/company/mittuforetag" },
                { key: "xHandle" as keyof FormData, label: "X (Twitter)", placeholder: "@mittuforetag" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <Label htmlFor={key}>{label}</Label>
                  <Input
                    id={key}
                    placeholder={placeholder}
                    value={form[key] as string}
                    onChange={e => set(key)(e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Villkor */}
          {step === 4 && (
            <div className="space-y-6">
              <div
                data-error={fieldError("acceptTerms") || undefined}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border",
                  fieldError("acceptTerms") ? "border-red-500 bg-red-500/5" : "border-border"
                )}
              >
                <Checkbox
                  id="acceptTerms"
                  checked={form.acceptTerms}
                  onCheckedChange={v => set("acceptTerms")(!!v)}
                />
                <Label htmlFor="acceptTerms" className="cursor-pointer leading-relaxed">
                  Jag accepterar Promotleys{" "}
                  <Link to="/terms-of-service" className="underline text-primary" target="_blank">
                    villkor och regler
                  </Link>
                  <RequiredStar />
                </Label>
              </div>
              {fieldError("acceptTerms") && (
                <p className="text-xs text-red-500 -mt-4">Du måste acceptera villkoren för att fortsätta</p>
              )}

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
                <Checkbox
                  id="newsletter"
                  checked={form.newsletterOptIn}
                  onCheckedChange={v => set("newsletterOptIn")(!!v)}
                />
                <Label htmlFor="newsletter" className="cursor-pointer leading-relaxed">
                  Ta emot nyhetsbrev med tips och nyheter om Promotley (valfritt)
                </Label>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={handlePrev} disabled={isSubmitting}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Föregående
              </Button>
            )}
            {step < STEPS.length ? (
              <Button
                type="button"
                className="flex-1"
                onClick={handleNext}
                disabled={!isStepValid(step)}
              >
                Nästa
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                type="button"
                className="flex-1"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Skapar...</>
                ) : (
                  "Skapa företaget nu"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Right: Vertical progress bar */}
      <div className="hidden lg:flex flex-col items-center py-12 px-8 border-l border-border/50 w-56 gap-0">
        <div className="relative flex flex-col items-center gap-0 w-full">
          {STEPS.map((s, i) => {
            const isComplete = completedSteps.has(s.id);
            const isActive = step === s.id;
            const isFuture = step < s.id;
            return (
              <div key={s.id} className="flex flex-col items-center w-full">
                <div className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all duration-300 z-10",
                  isComplete ? "bg-green-500 border-green-500 text-white" : "",
                  isActive ? "bg-primary border-primary text-white" : "",
                  isFuture ? "bg-background border-border text-muted-foreground" : "",
                )}>
                  {isComplete ? <Check className="h-4 w-4" /> : s.id}
                </div>
                <span className={cn(
                  "text-xs mt-1 mb-1 font-medium text-center",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}>
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div className={cn(
                    "w-0.5 h-8 transition-colors duration-500",
                    isComplete ? "bg-green-500" : "bg-border"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 3: Verify wizard flow manually**

```bash
npm run dev
```

Navigate to `/organization/new`. Walk through all 4 steps:
- Step 1: Verify "Nästa" is disabled with empty Företagsnamn; enable once filled.
- Step 2: Verify both required fields block "Nästa".
- Step 3: Verify all fields optional, "Nästa" always enabled.
- Step 4: Verify "Skapa företaget nu" blocked until checkbox checked.
- Submit: verify redirect to `/dashboard` and no console errors.

- [ ] **Step 4: Commit**

```bash
rtk git add src/pages/CreateOrganization.tsx && rtk git commit -m "feat: replace CreateOrganization with 4-step onboarding wizard"
```

---

## Task 3A: LogoStrip Component

**Files:**
- Create: `src/components/LogoStrip.tsx`

- [ ] **Step 1: Create LogoStrip.tsx**

```tsx
import { forwardRef } from "react";

// Simple SVG inline logos for the strip
const logos = [
  { name: "Meta", svg: <svg viewBox="0 0 48 48" fill="none" className="h-6"><path d="M24 8C15.163 8 8 15.163 8 24s7.163 16 16 16 16-7.163 16-16S32.837 8 24 8zm-4 22.4c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm8 0c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" fill="currentColor"/></svg> },
  { name: "TikTok", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg> },
  { name: "OpenAI", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg> },
  { name: "Instagram", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { name: "Facebook", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { name: "LinkedIn", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { name: "X", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { name: "Swish", svg: <svg viewBox="0 0 60 60" fill="none" className="h-6"><circle cx="30" cy="30" r="30" fill="#4ABFAA"/><path d="M20 30c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10S20 35.523 20 30z" fill="white"/></svg> },
  { name: "Claude", svg: <svg viewBox="0 0 24 24" fill="currentColor" className="h-6"><path d="M11.999 2C6.477 2 2 6.477 2 12s4.477 10 9.999 10C17.523 22 22 17.523 22 12S17.523 2 11.999 2zm4.4 14.4a.8.8 0 0 1-1.131 0l-3.27-3.27-3.268 3.27a.8.8 0 0 1-1.132-1.131l3.27-3.269-3.27-3.269a.8.8 0 0 1 1.132-1.131L12 10.868l3.268-3.268a.8.8 0 0 1 1.131 1.131L13.131 12l3.268 3.269a.8.8 0 0 1 0 1.131z"/></svg> },
];

// Duplicate for seamless loop
const allLogos = [...logos, ...logos];

const LogoStrip = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden py-8 border-y border-white/5"
      style={{ background: 'hsl(240 50% 4%)' }}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, hsl(240 50% 4%), transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, hsl(240 50% 4%), transparent)' }} />

      <div
        className="flex gap-12 items-center"
        style={{
          animation: 'logoScroll 30s linear infinite',
          width: 'max-content',
        }}
      >
        {allLogos.map((logo, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-70 transition-opacity duration-300"
            style={{ color: 'white', minWidth: '64px' }}
          >
            {logo.svg}
            <span className="text-xs font-medium" style={{ color: 'hsl(0 0% 100% / 0.5)' }}>
              {logo.name}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes logoScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
});

LogoStrip.displayName = "LogoStrip";
export default LogoStrip;
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: no errors.

---

## Task 3B: Rebuild Navbar

**Files:**
- Replace: `src/components/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar.tsx**

```tsx
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface NavbarProps {
  logoStripRef?: React.RefObject<HTMLDivElement>;
}

const Navbar = ({ logoStripRef }: NavbarProps) => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!logoStripRef?.current) {
      // Fallback: scroll threshold
      const onScroll = () => setScrolled(window.scrollY > 80);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 }
    );
    observer.observe(logoStripRef.current);
    return () => observer.disconnect();
  }, [logoStripRef]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/70 backdrop-blur-xl shadow-lg border-b border-white/10"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Promotley" className="h-8 w-8" />
            <span className="font-bold text-lg text-white">Promotley</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/pricing" className="text-sm text-white/70 hover:text-white transition-colors">
              Pris
            </Link>
            <Link to="/demo" className="text-sm text-white/70 hover:text-white transition-colors">
              Demo
            </Link>
            <a href="#om-oss" className="text-sm text-white/70 hover:text-white transition-colors">
              Om oss
            </a>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=login">
                  <Button size="sm" variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                    Logga in
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium">
                    Registrera
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-white/10 mt-4 flex flex-col gap-2">
            <Link to="/pricing" className="py-2 text-sm text-white/80 hover:text-white" onClick={() => setMobileOpen(false)}>Pris</Link>
            <Link to="/demo" className="py-2 text-sm text-white/80 hover:text-white" onClick={() => setMobileOpen(false)}>Demo</Link>
            <a href="#om-oss" className="py-2 text-sm text-white/80 hover:text-white" onClick={() => setMobileOpen(false)}>Om oss</a>
            <div className="flex flex-col gap-2 pt-3 border-t border-white/10 mt-2">
              {user ? (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-white text-black">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth?mode=login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full text-white hover:bg-white/10">Logga in</Button>
                  </Link>
                  <Link to="/auth?mode=register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-white text-black">Registrera</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
```

---

## Task 3C: Rebuild Hero

**Files:**
- Replace: `src/components/Hero.tsx`

- [ ] **Step 1: Rewrite Hero.tsx**

```tsx
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Platform SVG logos
const TikTokLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
);

const OAuthButton = ({
  onClick, logo, label, delay
}: { onClick: () => void; logo: React.ReactNode; label: string; delay: number }) => (
  <motion.button
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    onClick={onClick}
    className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-white text-sm font-medium backdrop-blur-sm"
  >
    {logo}
    <span>{label}</span>
  </motion.button>
);

const Hero = () => {
  const { toast } = useToast();

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast({ title: "Fel", description: error.message, variant: "destructive" });
  };

  const handleApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast({ title: "Fel", description: error.message, variant: "destructive" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(260 70% 18%) 0%, hsl(240 50% 6%) 55%, hsl(240 50% 3%) 100%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Heading */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1
                className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none"
                style={{ color: 'hsl(0 0% 98%)' }}
              >
                Marknadsför
                <br />
                <span style={{ color: 'hsl(260 70% 65%)' }}>nu</span>
              </h1>
              <p className="text-lg md:text-xl font-light max-w-lg" style={{ color: 'hsl(0 0% 70%)' }}>
                Gör marknadsföringen rätt med våra verktyg — AI-driven strategi, captions och analys för svenska företag.
              </p>
            </motion.div>
          </div>

          {/* Right: OAuth buttons */}
          <div className="flex flex-col gap-3 max-w-sm lg:ml-auto w-full">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm mb-2 font-medium"
              style={{ color: 'hsl(0 0% 55%)' }}
            >
              Kom igång på sekunder
            </motion.p>

            <OAuthButton
              onClick={() => window.location.href = '/auth'}
              logo={<TikTokLogo />}
              label="Fortsätt med TikTok"
              delay={0.35}
            />
            <OAuthButton
              onClick={handleGoogle}
              logo={<GoogleLogo />}
              label="Fortsätt med Google"
              delay={0.45}
            />
            <OAuthButton
              onClick={handleApple}
              logo={<AppleLogo />}
              label="Fortsätt med Apple"
              delay={0.55}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <a
                href="/auth?mode=register"
                className="text-xs underline-offset-4 hover:underline"
                style={{ color: 'hsl(0 0% 45%)' }}
              >
                Registrera med e-post
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
```

---

## Task 3D: Wire LogoStrip into Index.tsx + fix Auth.tsx redirectTo

**Files:**
- Modify: `src/pages/Index.tsx`
- Modify: `src/pages/Auth.tsx`

- [ ] **Step 1: Update Index.tsx to import and render LogoStrip**

In `src/pages/Index.tsx`:

Add import at top:
```tsx
import { useRef } from "react";
import LogoStrip from "@/components/LogoStrip";
```

Pass `logoStripRef` to `Navbar` and insert `LogoStrip` after `Hero`:
```tsx
const Index = () => {
  const logoStripRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen relative" style={{ background: 'hsl(240 50% 4%)' }}>
      {/* grid texture stays */}
      <Navbar logoStripRef={logoStripRef} />
      <Hero />
      <LogoStrip ref={logoStripRef} />
      {/* rest of sections unchanged */}
```

- [ ] **Step 2: Fix Auth.tsx OAuth redirectTo**

Open `src/pages/Auth.tsx`. Find both OAuth handler functions. Change `redirectTo: window.location.origin` to `redirectTo: \`${window.location.origin}/auth/callback\`` in both `handleGoogleLogin` (around line 251) and `handleAppleLogin` (around line 274).

```ts
// In handleGoogleLogin:
options: { redirectTo: `${window.location.origin}/auth/callback` },
// In handleAppleLogin:
options: { redirectTo: `${window.location.origin}/auth/callback` },
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

- [ ] **Step 4: Visual check**

```bash
npm run dev
```

Verify:
1. Landing page shows two-column hero with three OAuth buttons stacked on right
2. Infinite logo strip scrolls smoothly below hero
3. Navbar is transparent at top; becomes frosted glass after scrolling past logo strip
4. "Pris", "Demo", "Om oss" in nav links

- [ ] **Step 5: Commit Tasks 3A–3D**

```bash
rtk git add src/components/LogoStrip.tsx src/components/Navbar.tsx src/components/Hero.tsx src/pages/Index.tsx src/pages/Auth.tsx && rtk git commit -m "feat: redesign landing page — new navbar, hero, logo strip, fix OAuth redirectTo"
```

---

## Task 4: Dashboard UI Rebuild

**Files:**
- Modify: `src/pages/Dashboard.tsx` (preserve Task 1 enabled-flag changes; rebuild all JSX/styling)

**Important:** Task 1 already modified the hook calls at the top of Dashboard. When rewriting, keep the `enabled` flag pattern intact:
```ts
const { isConnected, loading: connectionsLoading } = useConnections();
const tiktokData = useTikTokData({ enabled: !connectionsLoading && isConnected("tiktok") });
const metaData = useMetaData({ enabled: !connectionsLoading && (isConnected("meta_ig") || isConnected("meta_fb")) });
```

- [ ] **Step 1: Rewrite Dashboard.tsx JSX — minimal/premium design**

Replace all JSX from the `return (` statement onward with the new design below. Keep all hooks, data processing logic, and `useEffect` blocks above the return unchanged (except for the Task 1 hook changes already in place).

The new `return (`:

```tsx
return (
  <DashboardLayout>
    <div className="min-h-screen p-6 space-y-6 font-poppins" style={{ background: 'hsl(240 20% 4%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Hej, {user?.user_metadata?.full_name?.split(" ")[0] || "där"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Här är din marknadsföringsöversikt
          </p>
        </div>
        <Link to="/ai">
          <Button size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            AI-verktyg
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Totala följare",
            value: formatNumber(totalFollowers),
            icon: Users,
            color: STAT_COLORS.primary,
          },
          {
            label: "Tillgängliga krediter",
            value: credits?.available_credits ?? "–",
            icon: Zap,
            color: STAT_COLORS.amber,
          },
          {
            label: "Kommande inlägg",
            value: upcomingPosts.length,
            icon: Calendar,
            color: STAT_COLORS.teal,
          },
          {
            label: "Anslutna konton",
            value: connections.length,
            icon: TrendingUp,
            color: STAT_COLORS.violet,
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`rounded-xl border p-4 ${color.bg} ${color.border}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
              <Icon className={`h-4 w-4 ${color.text}`} />
            </div>
            <p className={`text-2xl font-bold ${color.text}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Platform data row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* TikTok */}
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TikTokIcon className="h-5 w-5" />
            <h2 className="font-semibold text-sm">TikTok</h2>
          </div>
          {!isConnected("tiktok") ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">Inget TikTok-konto anslutet</p>
              <Link to="/account">
                <Button size="sm" variant="outline">Anslut konto</Button>
              </Link>
            </div>
          ) : tiktokData.loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Följare", value: formatNumber(tiktokData.user?.follower_count ?? 0) },
                { label: "Videor", value: tiktokData.user?.video_count ?? 0 },
                { label: "Gillade", value: formatNumber(tiktokData.user?.likes_count ?? 0) },
                { label: "Följer", value: tiktokData.user?.following_count ?? 0 },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-lg font-semibold mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instagram/Meta */}
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Instagram className="h-5 w-5 text-pink-400" />
            <h2 className="font-semibold text-sm">Instagram</h2>
          </div>
          {!isConnected("meta_ig") ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-3">Inget Instagram-konto anslutet</p>
              <Link to="/account">
                <Button size="sm" variant="outline">Anslut konto</Button>
              </Link>
            </div>
          ) : metaData.loading ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin h-6 w-6 rounded-full border-2 border-pink-400 border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Följare", value: formatNumber(metaData.instagram?.followers_count ?? 0) },
                { label: "Följer", value: metaData.instagram?.follows_count ?? 0 },
                { label: "Inlägg", value: metaData.instagram?.media_count ?? 0 },
                { label: "@handle", value: `@${metaData.instagram?.username ?? "–"}` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-lg font-semibold mt-0.5 truncate">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Follower history chart */}
      {followerHistory.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            Följarutveckling
          </h2>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={followerHistory}>
              <defs>
                <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Area type="monotone" dataKey="followers" stroke="hsl(var(--primary))" fill="url(#fg)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Upcoming posts */}
      {upcomingPosts.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-teal-400" />
            Kommande inlägg
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {upcomingPosts.map(post => (
              <div key={post.id} className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  {format(new Date(post.date), "d MMM", { locale: sv })}
                </p>
                <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                {post.platform && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    {post.platform}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent activity */}
      {recentActivity.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-5">
          <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Senaste aktivitet
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(activity.time), { addSuffix: true, locale: sv })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { label: "Skapa caption", icon: MessageSquare, href: "/ai/caption", color: "text-orange-400" },
          { label: "Hashtag-förslag", icon: CheckCircle2, href: "/ai/hashtags", color: "text-blue-400" },
          { label: "Kampanjstrategi", icon: ArrowRight, href: "/ai/campaign", color: "text-violet-400" },
        ].map(({ label, icon: Icon, href, color }) => (
          <Link key={label} to={href}>
            <div className="rounded-xl border border-border/50 bg-card hover:bg-card/80 transition-colors p-4 flex items-center gap-3 group">
              <Icon className={`h-5 w-5 ${color}`} />
              <span className="text-sm font-medium">{label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  </DashboardLayout>
);
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: no errors. If any import is missing, add it to the import block at the top of Dashboard.tsx.

- [ ] **Step 3: Visual check**

```bash
npm run dev
```

Navigate to `/dashboard`. Verify: minimal dark design, stat cards, platform sections show "Anslut konto" when no accounts connected (no error toasts), charts render when data available.

- [ ] **Step 4: Commit**

```bash
rtk git add src/pages/Dashboard.tsx && rtk git commit -m "feat: full dashboard UI rebuild — minimal premium design"
```

---

## Task 5A: Demo Data — Add AI Responses

**Files:**
- Modify: `src/data/demoData.ts`

- [ ] **Step 1: Add demoAIResponses to demoData.ts**

Open `src/data/demoData.ts`. Append the following export at the end of the file:

```ts
export const demoAIResponses: Record<string, string> = {
  caption: `✨ Caption för @stockholmskaffet:\n\n"Måndag smakar bättre med rätt kaffe ☕ Vi har precis fått in vår nya single origin från Etiopien — blommig, ljus och helt underbar. Kom in och prova, vi bjuder på det första provsmakat hela måndag förmiddag!\n\n#stockholmskaffet #nytkaffe #etiopiskkaffe #specialtykaffe #stockholm #kaffeälskare #mondaymood #lokalkaffe"`,

  hashtags: `🏷️ Rekommenderade hashtags för Stockholms Kaffet:\n\n**Volym (1M+):** #kaffe #coffee #fika #stockholm\n**Medel (100k–1M):** #specialtycoffee #kaffekultur #stockholmcafe #swedishcoffee\n**Nisch (<100k):** #stockholmskaffet #etiopiskkaffe #singleorigincoffee #kafferostning\n\n💡 Tips: Mixa 3–4 volymtaggar med 4–5 nischtaggar för bäst organisk räckvidd på Instagram.`,

  contentIdeas: `💡 5 Content-idéer för Stockholms Kaffet:\n\n1. **"Bakom kulisserna"** — Visa rostningsprocessen i en 30 sek Reel. Autentiskt och delbart.\n2. **"Kaffekunskap"** — Förklara skillnaden mellan washed och natural process. Bygger expertposition.\n3. **"Kundporträtt"** — Intervjua en stamkund om deras morgonrutin. Stärker community-känslan.\n4. **"Produktteaser"** — En 3-delad story-serie inför nästa säsongskaffe. Skapar förväntning.\n5. **"Before/after"** — Visa kaffebönan från farm till kopp i ett enda inlägg. Storytelling som säljer.`,

  weeklyPlan: `📅 Veckoplanen för Stockholms Kaffet (v.12):\n\n**Måndag:** Instagram-Reel — Lansering av ny etiopisk single origin\n**Tisdag:** Story-poll — "Filter eller espresso?" (ökar engagemang)\n**Onsdag:** Inlägg — Bakom kulisserna i rostningen\n**Torsdag:** TikTok — "3 saker du inte visste om kaffe"\n**Fredag:** Story — Helgmeny + påminnelse om öppettider\n**Lördag:** Reel — Kundmoment / café-stämning\n**Söndag:** Citat-inlägg — Veckans kaffetanke\n\n⏰ Bästa publiceringstider: 7–9 och 17–19 för din målgrupp.`,

  campaign: `🎯 Kampanjstrategi: Påsklansering 2025\n\n**Mål:** Öka butiksbesök +20% under påskhelgen\n**Målgrupp:** Stockholmare 25–45 år, kaffeintresserade\n\n**Fas 1 – Teaser (v.13):** "Något nytt är på väg" — mystiska stories, inga detaljer\n**Fas 2 – Lansering (v.14):** Påskkaffe + limited edition påse, Reel + pressmeddelande\n**Fas 3 – Avslutning (v.15):** "Sista chansen" + UGC från kunder, avsluta med tackinlägg\n\n**Kanaler:** Instagram (primär), TikTok (räckvidd), e-post (lojala kunder)\n**Budget:** 80% organiskt, 20% boostat innehåll på Meta\n**KPI:er:** Räckvidd, butiksbesök, UGC-andel`,

  ufTips: `🚀 UF-tips för Stockholms Kaffet:\n\n1. **Mässor:** Anmäl er till UF-mässan i god tid — er monter är ert varumärke inför jury och besökare\n2. **Årsredovisning:** Börja dokumentera försäljning och marknadsföringsinsatser redan nu, inte sista veckan\n3. **Sociala medier:** Visa UF-resan! Följare älskar autentiska "vi bygger ett företag"-berättelser\n4. **Samarbeten:** Ta kontakt med andra UF-företag för cross-promo — inga konkurrenter, bara partners\n5. **Prissättning:** Räkna alltid in din arbetstid i priset. Sälj inte för billigt — det undervärderar hela UF-rörelsen`,
};
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

---

## Task 5B: Update Demo.tsx Interaction Model

**Files:**
- Modify: `src/pages/Demo.tsx`

- [ ] **Step 1: Add AI response display state and import**

At the top of `src/pages/Demo.tsx`, add the `demoAIResponses` import:
```ts
import {
  demoCompany, demoStats, demoSocialStats, demoChartData,
  demoCalendarPosts, demoSalesRadar, demoAIAnalysis, demoChatMessages,
  DEMO_LIMIT_MESSAGE, demoAIResponses,
} from '@/data/demoData';
```

Add state for showing responses and modal:
```ts
const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
const [showRegisterModal, setShowRegisterModal] = useState(false);
const [pendingResponseKey, setPendingResponseKey] = useState<string | null>(null);
```

- [ ] **Step 2: Replace handleDemoClick with new interaction logic**

Replace the existing `handleDemoClick` function:
```ts
const handleAIToolClick = useCallback((key: string) => {
  const count = (clickCounts[key] || 0) + 1;
  setClickCounts(prev => ({ ...prev, [key]: count }));

  if (count === 1) {
    // First click: show pre-saved response
    const response = demoAIResponses[key];
    if (response) {
      setAiResponses(prev => ({ ...prev, [key]: response }));
    }
  } else {
    // Second+ click: show register modal
    setShowRegisterModal(true);
  }
}, [clickCounts]);
```

- [ ] **Step 3: Add register modal JSX**

Add the modal just before the closing `</div>` of the Demo component's return:

```tsx
{/* Register Modal */}
{showRegisterModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    onClick={() => setShowRegisterModal(false)}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border/50 rounded-2xl p-8 max-w-sm w-full text-center"
      onClick={e => e.stopPropagation()}
    >
      <h2 className="text-xl font-bold mb-2">Vill du se mer?</h2>
      <p className="text-muted-foreground text-sm mb-6">
        Skapa ett gratis konto för att använda alla funktioner utan begränsningar.
      </p>

      <div className="flex flex-col gap-3">
        {/* Google */}
        <button
          onClick={async () => {
            const { supabase } = await import('@/integrations/supabase/client');
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: `${window.location.origin}/auth/callback` },
            });
          }}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-sm font-medium"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Skapa ett konto med Google
        </button>

        {/* Apple */}
        <button
          onClick={async () => {
            const { supabase } = await import('@/integrations/supabase/client');
            supabase.auth.signInWithOAuth({
              provider: 'apple',
              options: { redirectTo: `${window.location.origin}/auth/callback` },
            });
          }}
          className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity text-sm font-medium"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
          Skapa ett konto med Apple
        </button>

        {/* Email */}
        <Link
          to="/auth?mode=register"
          className="block w-full py-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-sm font-medium text-center"
          onClick={() => setShowRegisterModal(false)}
        >
          Registrera med e-post
        </Link>
      </div>

      <button
        onClick={() => setShowRegisterModal(false)}
        className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Stäng
      </button>
    </motion.div>
  </div>
)}
```

- [ ] **Step 4: Add `responseKey` to demoAITools array, then wire click handlers**

First, open `src/pages/Demo.tsx` and update the `demoAITools` array definition to add a `responseKey` field to each entry. The current array starts at line 34. Replace it with:

```ts
const demoAITools = [
  { icon: FileText, title: "Caption-generator", description: "Skapa engagerande captions för dina inlägg", color: "from-orange-500 to-red-500", responseKey: "caption" },
  { icon: Hash, title: "Hashtag-förslag", description: "Få relevanta hashtags för ökad räckvidd", color: "from-blue-500 to-cyan-500", responseKey: "hashtags" },
  { icon: Image, title: "Content-idéer", description: "Brainstorma nya innehållsidéer", color: "from-purple-500 to-pink-500", responseKey: "contentIdeas" },
  { icon: Calendar, title: "Veckoplanering", description: "Planera din innehållskalender", color: "from-green-500 to-emerald-500", responseKey: "weeklyPlan" },
  { icon: Target, title: "Kampanjstrategi", description: "Bygg en strategi för din nästa kampanj", color: "from-amber-500 to-orange-500", responseKey: "campaign" },
  { icon: Lightbulb, title: "UF-tips", description: "Få råd specifikt för UF-företag", color: "from-indigo-500 to-purple-500", responseKey: "ufTips" },
];
```

Then in the JSX where the tool cards are mapped, replace the `onClick` handler with `handleAIToolClick(tool.responseKey)`:
```tsx
onClick={() => handleAIToolClick(tool.responseKey)}
```

For the chat button/section: find the chat-related element (look for `aiSubTab === 'chat'` or a chat card) and add `pointer-events-none opacity-40` classes plus a `Lock` icon overlay — do NOT add any `onClick` handler to it.

For the response panel, add after the tools grid:
```tsx
{Object.entries(aiResponses).length > 0 && (
  <div className="mt-6 space-y-4">
    {Object.entries(aiResponses).map(([key, response]) => (
      <div key={key} className="rounded-xl border border-border/50 bg-card/50 p-4">
        <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">{response}</pre>
      </div>
    ))}
  </div>
)}
```

- [ ] **Step 5: Build and verify**

```bash
npm run build
```

```bash
npm run dev
```

Navigate to `/demo`. Verify:
- First click on any AI tool → response appears inline, no modal
- Second click on same tool → register modal appears
- Chat section is greyed out and unclickable
- No authenticated session state is shared with `/dashboard`

- [ ] **Step 6: Commit**

```bash
rtk git add src/data/demoData.ts src/pages/Demo.tsx && rtk git commit -m "feat: demo page pre-saved AI responses + register modal on second click"
```

---

## Task 6A: OAuthLandingScreen Component

**Files:**
- Create: `src/components/OAuthLandingScreen.tsx`

- [ ] **Step 1: Create OAuthLandingScreen.tsx**

```tsx
import { useNavigate } from "react-router-dom";
import { Building2, Users } from "lucide-react";
import logo from "@/assets/logo.png";

export default function OAuthLandingScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="mb-8 flex items-center gap-2">
        <img src={logo} alt="Promotley" className="h-10 w-10" />
        <span className="font-bold text-xl">Promotley</span>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Välkommen!</h1>
        <p className="text-muted-foreground">Hur vill du komma igång?</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 w-full max-w-lg">
        {/* Register company */}
        <button
          onClick={() => navigate("/organization/new")}
          className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm mb-1">Registrera ett företag</p>
            <p className="text-xs text-muted-foreground">
              Skapa och anpassa din organisation
            </p>
          </div>
        </button>

        {/* Join company */}
        <button
          onClick={() => navigate("/organization/onboarding")}
          className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm mb-1">Anslut till ett företag</p>
            <p className="text-xs text-muted-foreground">
              Gå med i ett befintligt team med en inbjudningskod
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
```

---

## Task 6B: Update AuthCallback.tsx

**Files:**
- Modify: `src/pages/AuthCallback.tsx`

- [ ] **Step 1: Add OAuthLandingScreen import and state**

At the top of `src/pages/AuthCallback.tsx`, add:
```ts
import OAuthLandingScreen from "@/components/OAuthLandingScreen";
```

In the component, add to the existing `status` state — extend the type to include `'oauth-select'`:
```ts
const [status, setStatus] = useState<"loading" | "success" | "error" | "expired" | "oauth-select">("loading");
```

- [ ] **Step 2: Restructure the email-confirmed success block**

**IMPORTANT — read before editing:** The current `AuthCallback.tsx` has `setStatus("success")` at line 63, which fires immediately when `email_confirmed_at` is truthy, BEFORE the invite/promo blocks. You must **delete** that `setStatus("success")` line at line 63 and the `toast` call immediately after it (the original lines 62–65). Replace the entire `if (session.user.email_confirmed_at)` block with the following. This is the canonical implementation — follow this pseudocode exactly:

```ts
if (session?.user) {
  if (session.user.email_confirmed_at) {

    // ── STEP 1: invite_code auto-join (lines 68–99 in original) — KEEP EXACTLY AS-IS ──

    // ── STEP 2: promo_code auto-redeem (lines 102–119 in original) — KEEP EXACTLY AS-IS ──

    // ── STEP 3: NEW — OAuth org-membership check ──
    const provider = session.user.app_metadata?.provider;
    const isOAuthProvider = provider === "google" || provider === "apple";

    if (isOAuthProvider) {
      const { data: memberships } = await supabase
        .from("organization_members")
        .select("id")
        .eq("user_id", session.user.id)
        .limit(1);

      if (!memberships || memberships.length === 0) {
        // No org — show selection screen. Do NOT navigate.
        setStatus("oauth-select");
        return;
      }
      // Has org — fall through to navigate
      setTimeout(() => navigate("/dashboard", { replace: true }), 100);
      return;
    }

    // ── STEP 4: Non-OAuth (email verification) success path ──
    setStatus("success");
    toast({ title: "E-post verifierad!", description: "Ditt konto är nu aktiverat." });
    setTimeout(() => navigate("/dashboard", { replace: true }), 2000);

  } else {
    // existing refresh/verify flow — UNCHANGED (lines 124–145 in original)
  }
}
```

**Key point:** `setStatus("success")` and the verification toast now only fire for email-verified users (not OAuth). OAuth users either see `OAuthLandingScreen` (no org) or are navigated immediately to `/dashboard` (has org) without showing a "verified" toast — they were never going through email verification.

- [ ] **Step 3: Add OAuthLandingScreen render branch**

In the JSX return of `AuthCallback.tsx`, add a new status branch. The return currently renders a `Card` for all statuses. Add a top-level check before the Card:

```tsx
// At the very top of the return(), before the existing div:
if (status === "oauth-select") {
  return <OAuthLandingScreen />;
}
```

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
rtk git add src/components/OAuthLandingScreen.tsx src/pages/AuthCallback.tsx && rtk git commit -m "feat: post-OAuth org selection screen for first-time Google/Apple users"
```

---

## Final verification

- [ ] **Full build pass**

```bash
npm run build
```

Expected: zero errors.

- [ ] **Lint pass**

```bash
npm run lint
```

Expected: no new lint errors introduced by these changes.

- [ ] **Stop conditions checklist**

Start dev server and verify manually:

1. ✅ Task 1: New account with no social connections → dashboard shows, zero error toasts
2. ✅ Task 2: `/organization/new` shows 4-step wizard with progress bar, required fields block "Nästa", social fields optional
3. ✅ Task 3: Landing page two-column hero, logo strip scrolls, navbar goes frosted glass on scroll
4. ✅ Task 4: Dashboard minimal dark design, stat cards, platform sections show "Anslut konto" prompt
5. ✅ Task 5: `/demo` AI tool first click shows response, second click shows register modal, chat is disabled
6. ✅ Task 6: First-time Google/Apple OAuth user → sees "Registrera ett företag" / "Anslut till ett företag" screen before dashboard

- [ ] **Final commit**

```bash
rtk git add -A && rtk git commit -m "chore: verify all 6 tasks complete — promotley rebuild"
```
