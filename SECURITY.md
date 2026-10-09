# 🔒 Security & Environment Policy

Security is a primary pillar of the **FeedMe** ecosystem. Because FeedMe interfaces with hardware IoT microcontrollers, cloud databases, and AI vision APIs, this policy governs secure configuration and vulnerability handling.

---

## 1. Secrets Management & Environment Isolation

### Never Commit Secrets
The following files and patterns are strictly forbidden from version control:
- `.env`, `.env.local`, `.env.production`
- Hardware Wi-Fi credentials (`ssid`, `password` in Arduino/PlatformIO code)
- Supabase `SERVICE_ROLE_KEY`
- Gemini API Keys (`GEMINI_API_KEY`)

### Environment Variable Standards
- **Client Safe Variables:** Must start with `NEXT_PUBLIC_` (Web) or `EXPO_PUBLIC_` (Mobile). These are embedded into client bundles and must only contain public identifiers (e.g., Supabase Project URL, Supabase Anon Key).
- **Server-Only Variables:** Kept strictly inside Next.js Server Components, Server Actions, or API Route Handlers.

---

## 2. Supabase Row Level Security (RLS)

All database tables must have Row Level Security enabled. Example policy template:

```sql
-- Enable RLS
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;

-- Select own entries
CREATE POLICY "Users can view own diary entries"
ON diary_entries FOR SELECT
USING (auth.uid() = user_id);

-- Insert own entries
CREATE POLICY "Users can insert own diary entries"
ON diary_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update own entries
CREATE POLICY "Users can update own diary entries"
ON diary_entries FOR UPDATE
USING (auth.uid() = user_id);

-- Delete own entries
CREATE POLICY "Users can delete own diary entries"
ON diary_entries FOR DELETE
USING (auth.uid() = user_id);
```

---

## 3. IoT Hardware Communication Security

- **BLE GATT Transmission:**
  - The ESP32 scale advertises locally with dedicated UUIDs.
  - Payloads are validated on receipt to avoid buffer overflow or malformed JSON parsing crashes.
- **Local Wi-Fi Fallback:**
  - Scale posts to local subnet API (`/api/scale/reading`).
  - Request verification: The endpoint verifies `device_id` against registered scale devices in the user's profile before updating `weight_logs`.

---

## 4. Reporting a Security Issue
If you discover a security vulnerability or sensitive credential exposure in this repository, please do not file a public issue. Contact the project lead or security team immediately.
