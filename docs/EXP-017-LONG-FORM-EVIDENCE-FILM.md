# EXP-017 — Long-form TELLURIS evidence video, 1.15× playback edit

**Date:** 2026-11-15 (Costa Rica)  
**Status:** Bilingual static website player staged in GitHub; original media edited locally; MP4 binary is **not uploaded to GitHub or deployed to BanaHosting** by this change.

## Source and edit

- Source: team-provided `WhatsApp Video 2026-11-15 at 11.22.59 PM.mp4`.
- Original: 1920 × 1080, H.264 video + AAC audio, 30 fps, 193.067 seconds.
- Deliverable: `TELLURIS-EXP015-English-115x.mp4` with speed 1.15×, 167.867 seconds (~2:48), H.264/AAC 1080p, ~10.3 MB.
- Treatment: `setpts=(PTS-STARTPTS)/1.15` and `atempo=1.15` in FFmpeg; audio keeps its pitch. Existing visual text and burned-in subtitles remain image content and advance with the video. **No claim of a freshly translated or separately checked subtitle track.**
- Reproduction (assuming original file at the indicated path):
  ```sh
  ffmpeg -i input.mp4 -filter_complex '[0:v]setpts=(PTS-STARTPTS)/1.15[v];[0:a]atempo=1.15[a]' -map '[v]' -map '[a]' -r 30 -c:v libx264 -preset faster -crf 24 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart TELLURIS-EXP015-English-115x.mp4
  ```

## Website design

- Routes: `/`, `/en/`, `/telluris/`, `/en/telluris/`, and legacy `/es/` aliases.
- Each route includes a **non-autoplay** dialog, activated by a `Watch/Ver film · 2:48` CTA on the opening slide.
- The CTA starts hidden, and `website/public/assets/evidence-film.js` checks whether `/assets/telluris-evidence-film-115x.mp4` returns a successful HTTP HEAD before showing the button.
- Video loads on user interaction (`preload=none`), native browser controls, accessible dialog close, pauses on close, responsive 16:9 display. The slide deck ignores global key shortcuts while a dialog is open.
- The existing interactive 41-year evidence opening, slide navigation and scientific Explorer are unchanged.

## REQUIRED operator publication

1. **Get the locally produced MP4 from the conversation.** Its filename is `TELLURIS-EXP015-English-115x.mp4`.
2. **Rename it EXACTLY** to `telluris-evidence-film-115x.mp4`.
3. Add it via GitHub's Add file → Upload files to repository path `website/public/assets/telluris-evidence-film-115x.mp4` on `main` (or upload it to the same path in a verified local checkout and commit).
4. Deploy the updated contents of `website/public/` to the real BanaHosting document root, including all changed HTML/JS/CSS and the binary. GitHub commits alone **do not** publish the site.
5. In a logged-out browser, verify `https://projecturiel.earth/assets/telluris-evidence-film-115x.mp4` loads with video/audio, then `/` and `/en/` show the film button; playback, pause, close, responsive layout and other slides work. Test HTTP range seeking and slow mobile connections.
6. Keep the **official submission demo ≤30 seconds** (or use the officially permitted slide format). This 2:48 web film is supplemental information only.

## Security, science and operational caveats

- The source movie is user-provided. No claims were added about NASA scientific validation, actual forecasts, or active AI.
- This edit does **not** modify NASA data, statistical methods, the Explorer, the application backend or the official submission portal.
- Avoid uploading a large MP4 through a tool that accepts only UTF-8 text; binary publishing requires a real file-upload mechanism.
- Do not mark production published or judge-viewable until the asset and HTML are tested anonymously.
