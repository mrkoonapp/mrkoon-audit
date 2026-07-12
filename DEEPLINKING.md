# Mobile Deep Linking (iOS Universal Links + Android App Links)

Opening a portal HTTPS link on a phone that has the **MRKOON app** installed opens
the native app on the matching screen instead of the browser. This is achieved by
serving the standard association files from the portal domain:

- iOS — `/.well-known/apple-app-site-association` (Universal Links)
- Android — `/.well-known/assetlinks.json` (App Links)

There is **no per-environment handling** — a single production association set is
committed in `public/.well-known/` and ships with every build. The portal reuses the
**MRKOON consumer app** identity.

## What was added

| File | Purpose |
|---|---|
| `public/.well-known/apple-app-site-association` | iOS association (no file extension, strict JSON) |
| `public/.well-known/assetlinks.json` | Android association |
| `nginx/nginx.conf` | `location /.well-known/` block → `application/json`, no SPA fallback |
| `vercel.json` | Excludes `.well-known` from the catch-all rewrite + JSON headers |

The files are plain static assets in `public/`. `vite build` copies `public/` →
`dist/` (default `publicDir`/`outDir`), the Docker image copies `./dist` →
nginx `/var/www`, and nginx serves them from the site root. No build script,
no env selection, no CI change.

## Configured identity (production)

| Field | Value |
|---|---|
| iOS appID | `4YZT4PH883.com.mrkoon.app` |
| Android package | `com.masafa.mrk.app` |
| Android SHA-256 | see `public/.well-known/assetlinks.json` |

### Allow-listed paths (iOS)

```text
/*/products/*
/modals/auction/*
NOT /*/api/*
NOT /assets/*
```

`paths` is an **allow-list**; the `NOT` entries exclude API calls and Vite's hashed
static assets. **Confirm the portal URLs you actually want to deep-link and adjust
if needed** (e.g. dashboard/invoice routes).

## Serving requirements (the gotchas)

- The iOS file has **no `.json` extension** and must be **strictly valid JSON**.
- Both files must return **HTTP 200**, `Content-Type: application/json`, with
  **no redirect**, reachable at the site root over **HTTPS**.
- nginx's `location /.well-known/` forces the JSON content type (the extension-less
  Apple file would otherwise be `application/octet-stream`) and uses `try_files
  $uri =404` so the SPA `index.html` fallback never masks it.

## Out-of-repo prerequisites (mobile side)

For links to actually open the app, the mobile team must also:

- **iOS** — add the portal domain to the app's `com.apple.developer.associated-domains`
  entitlement (`applinks:<portal-domain>`).
- **Android** — add an `<intent-filter android:autoVerify="true">` for the portal
  domain, and ensure the **installed build's** signing cert matches the SHA-256 here
  (for Play App Signing, use the Play Console fingerprint).

## Verify after deploy

Replace `<domain>` with the portal production domain.

```bash
# 200, application/json, no redirect
curl -I https://<domain>/.well-known/apple-app-site-association
curl -I https://<domain>/.well-known/assetlinks.json

# Google App Links validator
# https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://<domain>&relation=delegate_permission/common.handle_all_urls

# Apple CDN cache (domain without scheme)
# https://app-site-association.cdn-apple.com/a/v1/<domain>
```

## Paths impacted

`public/.well-known/**`, `nginx/nginx.conf`, `vercel.json`.
