# E-Folio

A scroll-driven, cinematic portfolio built from LaTeX resumes. Each resume
becomes a page (`/main`, `/sde`, `/ai`, `/devops`, ...). Scrolling plays a
scene behind the content, and three sections can optionally be played as small
puzzle games before their details open.

Next.js 16, React 19, TypeScript, Tailwind v4, Zustand, Zod, Lenis, Vitest.
Node only: there is no Python anywhere.

```bash
cd apps/web
npm install
npm run dev      # http://localhost:3000
npm test         # unit tests (Vitest)
npm run lint
npm run build
```

> This Next.js version has breaking changes. Read `apps/web/AGENTS.md` and the
> guides in `apps/web/node_modules/next/dist/docs/` before touching Next APIs.

## Your content (personal data, never committed)

Everything under the repo-root `content/` folder and `art/source/` is
gitignored. Resumes contain contact details, so keep them out of git.

```
content/
  resumes/
    main.tex        -> /main
    sde.tex         -> /sde
    ai.pdf          -> "Download resume" for /ai   (optional, see below)
  site/             (optional extra copy, see below)
```

- **One `.tex` file per role.** The file name is the URL. Adding a file adds a
  page. The parser understands the macro structure of these resumes
  (`\resumeSubheading`, `\resumeProject`, `\resumeItem` lists, `\textbf{Label}{: a, b}`
  skill rows); it is not a general LaTeX parser. Commented lines (`%`) are ignored.
- **Resume PDFs (optional).** Put `<role>.pdf` next to `<role>.tex`. The Download
  resume button and Contact card only appear for roles that have a PDF.
- **Extra copy (optional).** `content/site/default.json` and `content/site/<role>.json`
  can override any field of the theme's `copy` block for one role or all roles:

  ```json
  { "copy": { "intro": "My own one-line intro.", "roles": ["Engineer", "Builder"] } }
  ```

  Unknown keys are rejected, so typos fail loudly instead of being ignored.
- **`PORTFOLIO_CONTENT_DIR`** points the loaders at a different resumes folder
  (the `site/` folder is expected beside it). The default is `content/resumes`.
- Pages are prerendered, so resumes are only needed while running
  `next build`, not at runtime.

Facts about you (name, course, links, experience, projects, skills,
certificates) always come from the resume. Nothing is invented.

## Theme: `apps/web/public/assets/theme.json`

One file controls the look. Shape:

```jsonc
{
  "identity": { "name": "...", "shortName": "...", "universe": "..." },
  "default": "spiderman",             // preset every role uses...
  "roles": { "devops": "hulk" },      // ...unless a role is listed here
  "presets": {
    "spiderman": {
      "colors": { "void": "#050608", "primary": "#00e5ff", "accent": "#ff2147", ... },
      "copy":   { "taglineTop": "...", "intro": "...", "pillars": [ ... ], ... },
      "scenes": { "home": { "frames": 1, "pattern": "/assets/scenes/home/{n}.webp", ... } },
      "games":  { "prompt": true, "sections": { "skills": { "game": "match", "difficulty": "easy" } } }
    }
  }
}
```

- **Presets** are whole looks (Spider-Man is the default; Hulk is a colour and
  copy starting point). Add a preset and point a role at it to change a page.
- **`copy`** holds short editable wording (taglines, intro, pillars, notes). Every
  field has a default.
- **`scenes`** maps a scene id to its frame sequence (written by the frames tool).
  A scene with no entry is drawn by a procedural night-city placeholder.
- **`games`** chooses which sections can become games, which game, and how hard.
  Games: `match` (memory), `decode` (unscramble a word from your resume),
  `target` (target practice). A section not listed is never gated.
- Colours are plain CSS values and become `--color-*` variables.

## Scenes and art

The six sections (`home`, `about`, `experience`, `projects`, `skills`, `contact`)
plus `404` are scenes. A fixed canvas draws the active scene behind the page.
Scrolling is the playhead: progress through a section picks the frame (smoothed
for a slow, cinematic feel), and neighbouring scenes cross-dissolve.

1. Generate art with the brief in [`docs/art-brief.md`](docs/art-brief.md)
   (stills or short clips, 16:9, no text in the image).
2. Put the files in `art/source/` named `01_home`, `02_about`, `03_experience`,
   `04_projects`, `05_skills`, `06_contact`, `07_404` (`.png`, `.jpg`, `.mp4`, ...).
3. Convert them (needs `ffmpeg` and `ffprobe` on your PATH):

   ```bash
   node tools/frames.mjs                                   # everything in art/source
   node tools/frames.mjs --only 01_home.png --focal 0.8,0.5 --width 1672 --mobile-width 1672
   ```

   - A **clip** becomes 90 to 180 WebP frames (desktop 1280 wide, mobile 720 wide).
   - A **still** becomes one frame with a slow scroll push-in.
   - `--focal x,y` says where the subject is, so portrait phones crop around it.
   - The manifest entry is written into `theme.json` for you.

Optimised frames in `apps/web/public/assets/scenes/` are committed; the raw
sources are not. Under `prefers-reduced-motion` the stage shows a still frame.

## Games and Interviewer mode

- On a first visit a prompt asks **Play the cases** or **Just show me the
  portfolio** (the second is the default and what Escape does). The choice is
  remembered in the browser.
- With games on, Experience, Skills and Projects show a locked **case file**.
  "Open the case" enlarges it in place into the puzzle; closing collapses it.
  Solving it opens the section.
- **Nothing ever blocks a visitor.** Every case file has "Skip, show me this
  section"; every section has a "Play this as a game" / "turn off" button; the nav
  has a **Games** menu with a switch per section; and **Interviewer mode** opens
  every section at once.

## Layout

```
apps/web/
  app/                    routes: /[role], /resume/[role], 404, loading
  components/
    stage/                SceneStage: the scroll-scrubbed canvas
    scenes/               Home, About, Experience, Projects (+CaseStudy), Skills, Contact
    games/                gate, case file, three games, controls, first-visit prompt
    ui/ shell/ nav/       UI kit (holo cards, brush titles), chrome, navigation
  content/                resume loader, parser, schema, optional extras (code)
  lib/
    scenes/               frame maths, load order, procedural placeholder
    games/                lock/unlock state and persisted store
    portfolio/            derived facts, journey, skills helpers
    theme.ts              theme schema and resolution
tools/frames.mjs          art -> frame sequences + manifest
docs/                     art brief, design references
```

Logic that can be pure is pure and unit tested (parser, loaders, theme,
frame maths, game rules, derived facts).

## Not covered yet

- **Deployment.** The resumes are not in git, so a hosted build needs them
  supplied some other way (for example, build locally, or fetch a private copy
  during the build). Nothing is set up for this yet.
- **A contact form.** Contact shows your links and a copy-email button.
