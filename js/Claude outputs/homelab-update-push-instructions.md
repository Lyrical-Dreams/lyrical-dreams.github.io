# What changed & how to push it

## Files touched

- `projects.html` — rewritten: Homelab section moved to the top with a full status dashboard + favorite-movies carousel; Input-Capture Detection Lab moved to the bottom; added the missing `matrix.js` script tag (the matrix-rain canvas on this page wasn't actually wired up before — now it is).
- `style.css` — appended new CSS for the dashboard (stat tiles, build-sequence bar, watch-item flags, task list), the movie carousel, a site-wide `.reveal` scroll-animation utility, and styled contact-form inputs.
- `js/site.js` — added a generic scroll-reveal `IntersectionObserver` (any element with `class="reveal"` fades/slides in once, the first time it scrolls into view).
- `js/movie-carousel.js` — new file. Rotates through your favorite movies, fetching poster art + year from the OMDb API when a key is set, falling back to a clean title card if not.
- `contact.html` — uncommented and wired up the working contact form (styled to match the site), added `reveal` to the social cards.
- All 7 HTML pages — added a GoatCounter analytics snippet (placeholder code, needs your real one — see below).

## Two things you need to fill in before this is fully "live"

1. **Movie posters (OMDb API key)** — open `js/movie-carousel.js` and replace:
   ```js
   const OMDB_API_KEY = 'YOUR_OMDB_API_KEY';
   ```
   Get a free key instantly at https://www.omdbapi.com/apikey.aspx (just needs an email, arrives in your inbox in a minute or two). Without it, the carousel still works and rotates through your movies — it just shows a styled film-icon card instead of real poster art.

2. **Contact form (Formspree)** — open `contact.html`, find:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" class="contact-form reveal">
   ```
   Sign up free at https://formspree.io, create a form, and swap `YOUR_FORM_ID` for the real ID they give you. Until then the form renders fine but submitting it will show Formspree's "unknown form" error.

3. **Analytics (GoatCounter, optional)** — every page now has:
   ```html
   <script data-goatcounter="https://YOUR_CODE.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
   ```
   Sign up free (no credit card, no cookies — GDPR-safe) at https://www.goatcounter.com, pick a subdomain code, and find/replace `YOUR_CODE` across the 7 HTML files with that code. If you'd rather skip analytics for now, you can safely delete that `<script>` block from each page instead.

None of these three break the site if you leave them as placeholders — they just won't be "turned on" yet.

## Pushing the update with git

You're working from `C:\Users\nayan\Downloads\lyricaldreams\lyrical-dreams.github.io-main\lyrical-dreams.github.io-main`, which should already be a git repo cloned from your `Lyrical-Dreams` GitHub Pages repo. From a terminal (PowerShell or Git Bash) **in that exact folder**:

```
cd "C:\Users\nayan\Downloads\lyricaldreams\lyrical-dreams.github.io-main\lyrical-dreams.github.io-main"
git status
```

`git status` should show `projects.html`, `style.css`, `js/site.js`, `js/movie-carousel.js` (new file), and `contact.html` as modified/new. If you filled in the OMDb key, Formspree ID, or GoatCounter code first, those edits will show too — do that before this step if you want them in the same commit.

**Important Windows/git gotcha** (from your own notes on this repo): don't touch any of these files in File Explorer — no renaming, no "extract and re-copy." Edit them in place with an editor (VS Code, Notepad, whatever) or leave them as I've written them. Git tracks filenames by the case in its index, and Explorer renames silently break that.

```
git add projects.html style.css js/site.js js/movie-carousel.js contact.html about.html experience.html index.html photography.html resume.html
git status
```

Check that `git status` now shows exactly those files staged — nothing unexpected like a stray `portfolio-site_1` duplicate folder (a past issue in this repo). If everything looks right:

```
git commit -m "Reorder Projects page: homelab progress dashboard + movie carousel up top"
git push
```

If `git push` asks you to log in, or rejects the push as non-fast-forward, run `git pull --rebase` first, resolve anything it flags, then `git push` again. Do **not** use the GitHub web uploader for this — your notes flag it as flattening folder structure and creating duplicate nested paths, which is what caused rejected pushes before.

GitHub Pages usually rebuilds within 30–90 seconds of the push landing. Refresh `projects.html` on your live site after that to see the change.

## Verifying it worked

- Open `projects.html` and confirm: Homelab card is first, with the dashboard and movie carousel underneath its description; Input-Capture Detection Lab is now below it.
- Scroll slowly — stat tiles, the build-sequence bar, watch-item flags, and the movie carousel should each fade/slide in as they enter view (skip this check if you have "reduce motion" on in your OS — it's intentionally disabled then).
- The movie carousel should auto-rotate every ~4 seconds through the 9 movies you listed; clicking a dot jumps straight to that one.
- On `contact.html`, the new form should render below your social links with the site's dark styling (not the browser's default plain inputs).
