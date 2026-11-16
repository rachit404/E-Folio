# Art brief: scroll-scrubbed cinematic scenes

This is what to generate (free tools are fine) so the portfolio can play as a
scroll-driven, slow-motion film. You make the art; I turn it into optimised
frame sequences and build the UI from your comps on top.

## How it works (so you know what to make)

- Each page section is one **scene**. Scrolling is the playhead: scroll down and
  the scene's frames advance, scroll up and they rewind. That is the
  "slow-mo video you can scrub" effect.
- Frames are drawn on a canvas, not played as a `<video>`. Canvas scrubbing is
  smooth in both directions; scrubbing a video element stutters.
- The UI (headline, buttons, cards, nav) is real HTML on top of the art. So the
  art must contain **no text, logos, UI, watermarks or graffiti words**.
  (The comps have baked-in handwritten notes; I will add those as text.)

## Style bible (use in every prompt)

- Night city, rain-wet surfaces, deep navy and black, **cyan and red neon rim
  light**, purple haze. Painterly comic-film look (graphic ink edges, light
  halftone/grain), cinematic lighting, shallow depth of field.
- **One original hero in every scene**: young person in a black and red hoodie,
  hood up, small red spider emblem on the back, dark pants, red-soled sneakers.
  Keep this identical across scenes (same outfit, build, colours).
- Do **not** name Marvel, Spider-Man, Miles Morales or any film in prompts.
  Many tools refuse them, and shipping lookalike IP on a public site is a risk.
  Describe the original character as above.
- Composition: leave the **left 40% of the frame darker and calm** (headline
  column). Put the subject and the interesting light on the **right 60%**.

## Technical specs

| Item | Spec |
| --- | --- |
| Aspect / size | 16:9, at least 1920x1080 |
| Clip length | 5-10 s per scene (see list) |
| Frame rate | 24 or 30 fps |
| Camera | One slow continuous move, no cuts, no shake, no zoom pops |
| Motion | Slow motion feel; background lights, rain, haze drifting |
| Format | MP4 (H.264) or WebM, no audio needed |
| Mobile | 9:16 versions are a bonus. Otherwise I crop around the subject, so keep the subject inside the middle 60% of the frame width |

## Scenes (priority P0 = needed, P1 = nice, P2 = optional)

| # | Scene | Priority | Clip | Camera move | Shot |
| --- | --- | --- | --- | --- | --- |
| 1 | Home | P0 | 6 s | Slow push-in | Hero crouched on a rooftop edge, back to camera, looking over a huge neon city at night, moon behind clouds |
| 2 | About | P1 | 6 s | Slow dolly to the right | Hero sitting at a desk in a dark room facing a big window with the city; floating cyan holographic screens beside |
| 3 | Experience | P0 | 10 s | Forward travel (camera follows behind hero) | Hero walks along a glowing red-lit elevated road toward the skyline; floating cyan holo cards line the road (leave them blank) |
| 4 | Projects | P0 | 8 s | Slow dolly in | Hero standing before a tall glowing reactor core in a vault chamber, holographic crates floating around it |
| 5 | Skills | P1 | 8 s | Slow orbit | Circular control room, a large faceted crystal core in the middle with red and cyan light, hero at the edge looking at it |
| 6 | Contact | P1 | 6 s | Slow pull-back | Hero sitting on a rooftop with a laptop, red moon over the city, calm |
| 7 | 404 | P2 | still or 4 s | Slow drift | Hero before a broken glowing portal tearing the skyline, floating debris |

Case study pages reuse scene 4. Loading screen needs no art (I build it in CSS).

**If video is too hard:** a single still per scene is enough for P0. I animate
it with a slow scroll-driven push and parallax, and you can upgrade a scene to a
full clip later without changing any code.

## Workflow with free tools

Free tiers and names change, so treat these as examples and check what is free
today.

1. **Lock the hero first.** Generate 3-4 stills of the hero and pick one. Reuse
   it as the reference image in every later step.
2. **Make a start-frame still per scene** (image generators with a free tier:
   Google AI Studio / Gemini image, Microsoft Copilot or Bing Image Creator,
   Leonardo, Ideogram, or a Flux model on Hugging Face). Use the prompts below.
3. **Animate each still** with an image-to-video tool (free daily credits exist
   on tools such as Kling, Hailuo, Luma Dream Machine, Pika, Runway, or Wan
   models on Hugging Face). Use the start frame, the motion prompt, 5-10 s,
   highest quality available.
4. **Check** against the acceptance list, regenerate if needed.
5. **Drop the files** into `art/source/` using the names below and tell me.
   That folder is gitignored, so large raw files never enter the repo.

File names: `01_home.mp4`, `02_about.mp4`, `03_experience.mp4`,
`04_projects.mp4`, `05_skills.mp4`, `06_contact.mp4`, `07_404.mp4`
(or `.png` / `.jpg` for stills with the same numbers).

## Prompts

### Master style (prepend to every image prompt)

> Cinematic painterly comic-film illustration, night city, rain-wet surfaces,
> deep navy and black shadows, cyan and red neon rim lighting, purple haze,
> subtle halftone grain, shallow depth of field, 16:9, wide shot. An original
> young hero in a black and red hooded jacket with a small red spider emblem on
> the back, dark pants, red-soled sneakers, hood up. The left 40% of the frame
> is darker and calm; the main subject and light are on the right. No text,
> no letters, no logos, no watermark, no UI.

### Scene stills (append to the master style)

1. **Home:** The hero crouches on a rooftop ledge seen from behind, looking out over a vast neon skyline, a pale moon behind clouds, antennas and fire escapes in the foreground.
2. **About:** Interior of a dark apartment at night, the hero seated at a desk seen from behind, a huge window showing the skyline, floating cyan holographic screens with abstract diagrams (no readable text), plants, books, a mug.
3. **Experience:** The hero stands on a glowing red-lit elevated roadway seen from behind, the road curving toward a distant skyline under a red sun, four floating cyan holographic cards hovering along the road, blank.
4. **Projects:** A circular vault chamber, a tall glowing red and cyan reactor core in the centre, floating hexagonal holographic containers around it, the hero standing on a platform in front, seen from behind.
5. **Skills:** A circular control room, a large faceted crystal core glowing red and cyan in the centre with light beams running to six holographic panels (blank), the hero at the foreground edge seen from behind.
6. **Contact:** The hero sits on a rooftop corner with a closed laptop beside, looking at a calm city under a large red moon, light rain, quiet mood.
7. **404:** The hero stands before a huge broken glowing portal ring tearing the skyline, floating debris and fragments of buildings, magenta and cyan energy.

### Motion prompts (for image-to-video; add "slow motion, smooth, no cuts")

1. Slow push-in toward the hero; rain streaks, drifting haze, blinking city lights; the hero barely moves, cloth sways in the wind.
2. Slow camera dolly to the right; holographic screens flicker softly; city lights twinkle outside the window.
3. Camera follows slowly forward behind the hero as they walk toward the skyline; road lights stream past; holographic cards float and glow.
4. Slow dolly in toward the reactor core; core pulses; floating containers drift; light beams shimmer.
5. Slow orbit around the crystal core; beams of light travel to the panels; subtle camera arc.
6. Slow pull-back revealing more of the city; rain; the moon glow breathes; the hero is almost still.
7. Slow drift; the portal crackles; debris floats; the hero stands still.

## Acceptance checklist (per clip)

- [ ] Same hero outfit and colours as the other scenes
- [ ] No text, letters, logos, watermarks or UI anywhere in the frame
- [ ] One continuous camera move, no cuts, no sudden zoom or shake
- [ ] Left 40% calm enough for a headline (subject on the right)
- [ ] At least 1080p and at least 5 s
- [ ] No obvious artefacts on the hero's hands and face (back view helps)

## What I do with your files

- Extract frames with `ffmpeg` (already installed here) into WebP sequences:
  desktop about 1280 wide, mobile about 720 wide, roughly 90-180 frames per
  scene, kept to a few MB each and lazy-loaded when the scene nears.
- If a clip is short, I retime or interpolate frames so scrolling feels like slow motion.
- Add a first-frame poster for instant paint and a reduced-motion still.
- Everything scene-specific (file names, frame counts, focal point for mobile
  crop) lives in `theme.json`, so a different theme such as Hulk is a new set of
  art plus a config change.

## Other assets I need from you

- **Logo:** a transparent SVG or PNG of your "Rachit Doshi" crown wordmark. If you
  do not have one, I will recreate it with the brush font and a crown icon.
- **Resume PDFs** (optional): put `sde.pdf`, `main.pdf`, and so on next to the
  `.tex` files in `content/resumes/` to enable "Download resume".
- **Copy that is not in your resumes** (taglines, intro paragraph, the four
  pillars): I will create a gitignored `content/site/` file with the comps'
  wording as a starting point for you to edit.
