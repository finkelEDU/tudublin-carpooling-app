# Ride Chat Plan

## Approach
Supabase table for messages (ride already lives there, native FK, Realtime support).
MongoDB used only for avatar/username display via `sender_id` → `supabase_id` lookup.

## Step 1 — Run in Supabase SQL editor

```sql
CREATE TABLE ride_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ride_id uuid REFERENCES rides(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

No RLS — access gated at UI level (only shown to driver and pending/confirmed passengers).

## Step 2 — Files to create/update

- `src/components/rides/RideChatForm.jsx` — client component, Input + Button, posts to Supabase, realtime subscription appends new messages without reload
- `src/app/rides/[id]/page.jsx` — fetch messages on load, batch-fetch MongoDB users by sender_id for avatars/usernames, render chat section below bookings (visible to driver + participants only)

## Visibility condition (already available in page.jsx)
```js
const isParticipant = isDriver || existingBooking?.status === "confirmed" || existingBooking?.status === "pending"
```
