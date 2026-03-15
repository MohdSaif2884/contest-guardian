

# Fix Auth.tsx Build Errors & Google OAuth Flow

## Problem
The `Auth.tsx` file has literal `\n` characters embedded in the source code (lines 8, 30, 73), causing TypeScript build errors. The code is syntactically broken — multi-line code was collapsed into single lines with literal backslash-n characters.

Additionally, the Google OAuth should use `lovable.auth.signInWithOAuth("google")` (Lovable Cloud managed OAuth) instead of raw `supabase.auth.signInWithOAuth`.

## Changes

### 1. Fix `src/pages/Auth.tsx` — Expand collapsed lines
- **Line 8**: Split the import into two proper lines
- **Line 30**: Expand `resetPasswordForEmail` call into proper multi-line code
- **Line 73**: Expand `handleGoogleSignIn` function into proper multi-line code
- Update Google sign-in to use Lovable Cloud's managed OAuth (`lovable.auth.signInWithOAuth("google")`) which handles redirect URLs automatically

### 2. OAuth redirect handling
- The `/auth` route already exists in `App.tsx` — after OAuth callback, the `AuthContext`'s `onAuthStateChange` listener will pick up the session
- Add a `useEffect` in `Auth.tsx` to redirect authenticated users to `/dashboard` so that after OAuth callback lands on `/auth`, logged-in users are sent to dashboard

### 3. Verify `vercel.json` SPA routing
- Already has catch-all rewrite to `index.html` — OAuth callbacks won't 404

## Summary
The core issue is corrupted source code with literal `\n` characters causing build failures. Once fixed and using Lovable Cloud managed OAuth, Google login will work on the deployed Vercel site.

