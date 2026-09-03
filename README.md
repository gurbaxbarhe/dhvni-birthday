# for my baby

A small birthday website. HTML + CSS + TypeScript, built with Vite, hosted on GitHub Pages.

All personal content (text + photos) is encrypted with the password before it is committed, so the
repo can be public without revealing anything. The site decrypts in the browser after the password
is entered (PBKDF2 → AES-256-GCM via Web Crypto). A wrong password simply fails to decrypt.

## Layout

```
secret/              gitignored — the only place plaintext lives
  content.json       all text (see content.example.json for the shape)
  photos/            photos referenced from content.json
  password.txt       the password (or set SITE_PASSWORD instead)
public/bundle.enc    encrypted output, committed
scripts/encrypt.mjs  builds bundle.enc from secret/
src/                 site code
```

## Edit content

1. Edit `secret/content.json` and/or drop photos into `secret/photos/`
2. `npm run encrypt`
3. Commit `public/bundle.enc` and push — GitHub Actions deploys it

## Run locally

```
npm install
npm run encrypt
npm run dev
```

## Change the password

Update `secret/password.txt`, then `npm run encrypt`, commit, push.
