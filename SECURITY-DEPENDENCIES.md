# Dependency security update (22 October 2026)

Use Node24.22.1 (`.nvmrc`) and the committed npm lock with `npm ci`. Original working copies are outside this patch. No deployment, store upload, production data operation or credential change is established by this source update.

The initial compatible refresh left vulnerable tmp0.0.33 under Inquirer6. The parent now uses Inquirer14.2.4, loading its ESM default with dynamic import inside the existing CommonJS CLI. The actual CLI preserves all eight prompts and encrypted address output. Verification must use synthetic in-memory RSA keys; `npm test` reads a local private.key and a stored address, so it is intentionally excluded from this security check. No existing keys or sticker submissions are read or rewritten.

The initial317-record cached GHSA comparison was expanded to current public OSV package/version queries, which found the tmp issue. The corrected current npm lock has no exact OSV matches; no private dependency graph was uploaded. No-match results do not establish that every dependency or deployed artifact is vulnerability-free.
