# wake.mobi

The WAKE website: one page in the Simple cloud skin (the ...Thunder Plus Simple skins, with a dithered cloud deck and a crown of areoles that lights up with the music), a tracker that plays songs exported from ...Thunder Plus, and the other skins from ...Thunder Plus and ...Seeds in the Skin menu. Plain HTML, no build step.

## What's where

| File | What it is |
| --- | --- |
| `content.json` | **All the words and links on the site.** Tracks, bio, releases, apps, contact. The only file you need to touch to update the site. |
| `index.html` | The design and code. Leave it alone unless you're changing the look. |
| `tracks/` | Songs for the tracker: a `.json` web export and its `.mp3` for each. |
| `images/` | Photos and cover art. Put the bio photo here as `images/bio.jpg`. |
| `.pages.yml` | Settings for Pages CMS, the form editor (see below). |
| `tools/thunder-web-export.js` | The code that writes a web export inside ...Thunder Plus (for adding it there). |

## Who can change it

Anyone can visit the site. Only people with write access to this GitHub repo can change it, which means only you. Pages CMS signs in with your GitHub account, so the same rule applies there.

## Editing the site

Every save goes live on its own in about a minute.

**1. Pages CMS (forms, easiest).** Go to https://app.pagescms.org, sign in with GitHub, pick this repo. You get forms for Tracks, Bio, Music, Apps and Contact: add a release, upload a track, reorder apps. It saves straight to `content.json`.

**2. GitHub's own editor.** Open `content.json` on github.com, tap the pencil, edit, Commit. Keep the quotes and commas as they are; if the page goes blank afterwards, a comma is missing or extra.

**3. Ask Claude.** "Add my new album to wake.mobi" with the link.

Inside any text: `[link text](https://...)` makes a link, `**bold**`, `*italic*`.

## Putting a ...Thunder Plus song in the tracker

Each song is two files: the **web export** (`.json`: every track's notes and exactly when they play, made by ...Thunder Plus's own sequencer) and its **audio** (`.mp3`: the same song rendered). The tracker scrolls the notes in time with the audio, so it looks and sounds exactly like the song in ...Thunder Plus.

1. Save the song in ...Thunder Plus (File ▾ → Save, a `.thunder` file) and send it to Claude, who renders it with ...Thunder Plus's own engine and makes the two files. (`tools/thunder-web-export.js` is the code that does it.)
2. **Try it privately first:** open the site with `#studio` on the end (`wake.mobi/#studio`), and drop both files on the tracker. It plays in your browser only; nothing is uploaded and nobody else sees it.
3. **Publish it:** in Pages CMS, Tracks → add an entry, upload the `.json` and the `.mp3`. Or put both files in `tracks/` and add an entry to `tracks` in `content.json`:

```json
{ "title": "Song name", "note": "Line under the tracker", "data": "tracks/song.json", "audio": "tracks/song.mp3" }
```

The first track in the list is the one that loads. With more than one, a menu appears in the tracker.

Keep the audio as an `.mp3` (192 kbps is plenty): a WAV is ten times bigger and slow on phones.

## Bandcamp players

Each release has an `embed` value like `album=858475237` or `track=3511454806`: the number from Bandcamp's Share / Embed code. With it, the release card gets a **▶ Play here** button that opens Bandcamp's own player in the card, coloured to match the skin. Leave it empty for just the link. (Players and Bandcamp cover art show on the real site; Claude's preview can't load other sites, so it draws a crown instead.)

## Putting it on wake.mobi (GitHub Pages)

1. In this repo on GitHub: **Settings → Pages → Build and deployment**, Source **Deploy from a branch**, branch `main`, folder `/ (root)`. Save. The site appears at `https://matthettich.github.io/<repo-name>/` in a minute or two. Check it there first.
2. Still in Settings → Pages, type `wake.mobi` under **Custom domain** and Save.
3. Where the domain is registered (Squarespace: **Domains → wake.mobi → DNS settings**), remove the old Squarespace website records and add:
   - four **A** records, host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - one **CNAME** record, host `www`, pointing to `matthettich.github.io`
4. Wait for DNS (minutes to a day). When GitHub shows the domain as working, tick **Enforce HTTPS**.

Before cancelling the Squarespace website plan, download any photos from it you want to keep: images hosted on Squarespace go away with the site. Keep the domain registration itself paid up.

## Trying it on your computer

The page loads `content.json` with `fetch`, so open it through a small local server rather than double-clicking:

```
python3 -m http.server 8000
```

then visit http://localhost:8000.
