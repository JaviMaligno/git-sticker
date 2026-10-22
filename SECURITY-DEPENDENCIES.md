# Dependency security update (22 October 2026)

Use Node24.22.1 (`.nvmrc`) and the committed npm lock with `npm ci`. Original working copies are outside this patch. No deployment, store upload, production data operation or credential change is established by this source update.

The compatible inquirer/lodash graph is refreshed. Verification must use synthetic in-memory RSA keys; `npm test` reads a local private.key and a stored address, so it is intentionally excluded from this security check. No existing keys or sticker submissions are read or rewritten.

Advisory coverage is bounded to317 previously fetched public GHSA records compared locally; no private dependency graph was uploaded. No-match results do not establish that every dependency or deployed artifact is vulnerability-free.
