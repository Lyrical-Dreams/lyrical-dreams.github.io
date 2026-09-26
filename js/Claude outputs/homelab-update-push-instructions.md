# How this project's Claude-assisted workflow works

This file is the standing reference for any Claude session (scheduled or ad-hoc) working on Lyrical's portfolio site and homelab. Read this first — it replaces re-explaining the setup from scratch every time. (Note: this file previously documented a one-off change from an earlier session and manual Windows git instructions for a since-abandoned folder path. That's gone — this is now the living conventions doc.)

## What this project is

Three things, kept in sync with each other:
1. **The public portfolio site** — `lyrical-dreams.github.io` (GitHub Pages), showcasing a live-style Homelab status dashboard on `projects.html` alongside other projects.
2. **Private homelab status docs** — not part of the public site, hold the real project history and day-to-day state.
3. **A "Homelab Ops Dashboard" Claude Artifact** — a separate hosted status page (not part of the git repo), mirroring the same current state in a different format.

A recurring scheduled task ("Portfolio & Homelab Dashboard — Morning Update") re-syncs all three from the docs on its own schedule. Ad-hoc chats (like this one) do the same kind of work manually when Lyrical is actively working a task.

## File locations (all reached via the device bridge, `mcp__remote-devices__*` tools, on the linked computer "envyhp")

- **Portfolio site repo:** `$HOME/mnt/Projects/portfolio-site` — remote `https://github.com/Lyrical-Dreams/lyrical-dreams.github.io.git`, push credentials already configured (`git push` works directly, no login prompt). Connected folder on the device: `Documents/Projects`.
  - *Historical note:* an older, now-unused folder `Downloads/lyricaldreams/lyrical-dreams.github.io-main` was the original clone location and is referenced in old chat history — it went empty/stale at some point. The real, current repo is under `Documents/Projects/portfolio-site`. Don't use the Downloads path.
- **Private status docs:** `$HOME/mnt/homelab-status/` — `homelab-handoff-v9.md` (current project state + Tier 1/2/3 roadmap + numbered "Flags" list of operational gotchas), `homelab-security-and-ops-runbook.md` (detailed security/setup history, Part 5.x sections), `homelab_manual.md` (day-to-day operating reference), `daily-log.md` (running journal — append an entry after every session touching the homelab, however small).
- **Reference-only archive:** `$HOME/mnt/Projects/homelab/archive/` — old handoffs/dashboards, don't edit.
- **This file:** `$HOME/mnt/Projects/portfolio-site/js/Claude outputs/homelab-update-push-instructions.md`.

## Doing file/git work

All file and git work happens through `mcp__remote-devices__device_bash` (a shell on the linked computer, not the cloud sandbox) — the mounted folders above are real, editable files there.

**Known gotcha: stale `.git/*.lock` files.** The mounted repo frequently leaves a stale `.git/index.lock`, `.git/HEAD.lock`, or `.git/ORIG_HEAD.lock` behind — `git` itself often can't unlink its own lock files on this mount (`Operation not permitted`), even though a plain `mv` can move them aside. Standard pattern, use before `git add`/`commit`/`push`, and again between each step if one fails:

```bash
clearlocks() { for f in .git/index.lock .git/HEAD.lock .git/ORIG_HEAD.lock .git/refs/remotes/origin/main.lock; do [ -e "$f" ] && mv "$f" "$f.stale-$(date +%s%N)" 2>/dev/null; done; }
clearlocks
git add <files>
clearlocks
git commit -m "..."
clearlocks
git push
```

Ignore `warning: unable to unlink ... Operation not permitted` lines during this — they're git's own harmless cleanup attempts failing, not a sign the operation itself failed. Check the actual command's exit status / `git log` afterward to confirm success. Never call `device_request_delete_permission` for this — it can block for days waiting on a human and isn't needed (`mv` works fine without elevated delete permission).

**On an unattended/scheduled run specifically:** never request delete permission at all (same reasoning — it can stall the run indefinitely with no one there to approve it).

## The Artifact ("Homelab Ops Dashboard")

Lives at `https://claude.ai/artifact/R26UUb6rRJi8EHTRspSFTh` — **always update this exact URL, never create a new one.** Workflow: `Artifact` tool `action: read` first (to get the current live version — it may have been updated by a different session since you last touched it), then write the edited HTML to a scratchpad file, then `action: publish` with `url` set to the URL above.

Structure to preserve (don't restyle/restructure, just update content): header with generated-date + source-doc dates; a stale/status banner; 4 stat tiles; a build-pipeline stepper (Parts 1–6); a two-column Security Hardening checklist + Roadmap-by-Tier section; a "What To Work On Next" table (grouped: done-today / next-up / Tier 3); footer.

**Convention on finished tasks:** once a task is confirmed done, move it out of the active "What To Work On Next" table (don't let completed items pile up there) — a one-line acknowledgment in the roadmap-by-tier list (`~~task~~ — done <date>`) is enough on the dashboard itself. Full detail (what was done, how long it took, the actual workflow, what was learned) belongs in `daily-log.md`, not the dashboard — the dashboard is a current-state snapshot, the daily log is the history.

## Updating the live site (`projects.html`)

The homelab dashboard section (`<div class="homelab-dashboard">`) mirrors the artifact's content in the site's own HTML/CSS — stat tiles, build-sequence bar, operational watch-item flags, and a numbered "What's next" task list. Match the existing dark-theme HTML/CSS exactly; don't restyle. Unlike the artifact, it's fine (even good — it's portfolio content demonstrating real troubleshooting) to leave recently-completed tasks visible with a checkmark and brief "done <date>" note rather than removing them immediately; prune old ones only when the list gets unwieldy.

## Docs conventions

- **Numbered "Flags"** in `homelab-handoff-v9.md` are the running list of operational gotchas/incidents (currently up to #11). Extend an existing flag with new findings rather than creating a near-duplicate when something recurs (e.g., flag #11 covers all three VM 100 disk-fill crashes).
- **Tier 1/2/3 roadmap** in the same doc: Tier 1 = foundational, closed Sep 11, 2026. Tier 2 = active quality-of-life work — this is where new small/medium tasks get added as they're identified. Tier 3 = bigger structural projects.
- When a doc's claim turns out to be wrong (e.g., "weekly" backup that was actually monthly, or a "CDN bug" that turned out to be intentional Proxmox design) — correct it in place with a dated note, don't just quietly change it. Future sessions (and Lyrical) need to know something was corrected, not just what it now says.
- `daily-log.md`: append an entry every session, even a quiet "nothing changed" one. Be specific about workflow and findings, not just outcomes — this file is the actual project history.

## Key names/IPs (as of Sep 2026)

- Proxmox host: `pve`, `172.16.0.50:8006`, accounts `NP2@pve` (day-to-day) / `root@pam` (root-only tasks).
- VM 100 "Jellyfish-fields" / hostname `jellyfish`: `172.16.0.51`, Jellyfin + Caddy via Docker, user `lyricaldreams`.
- CT 101 "wireguard" / hostname `wireguard` (fixed Sep 26, 2026 — previously showed as `CT101`): `172.16.0.52`, user `mediadreams`, SSH is LAN-only (`172.16.0.0/24`), not reachable over the WireGuard tunnel itself.
- Backup target: `backup-momentus` Directory storage, Seagate Momentus 500GB via USB-SATA — intentionally air-gapped (plugged in only for the backup window, `nofail` fstab entry so a missing drive doesn't block a host boot). Biweekly schedule as of Sep 26, 2026.

## Starting a new chat on this project

Point Claude at this file plus `homelab-status/daily-log.md`'s most recent entries — that's enough context to pick up mid-project without re-explaining. The device bridge needs to be linked to envyhp the same way (folder access to `Documents/Projects` and `Documents/homelab-status`) for any of the file/git tools above to work at all.
