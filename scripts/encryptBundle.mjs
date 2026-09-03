// Encrypts secret/content.json + secret/photos/* into public/bundle.enc.
// Password: SITE_PASSWORD env var, else secret/password.txt.

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { BUNDLE_FILE, IV_LENGTH, SALT_LENGTH, deriveBundleKey } from "../src/lib/bundleFormat.mjs";

const SECRET_DIR = "secret";
const OUTPUT_FILE = join("public", BUNDLE_FILE);
const MIME_BY_EXTENSION = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const readPassword = () => {
  const fromEnv = process.env.SITE_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  const passwordFile = join(SECRET_DIR, "password.txt");
  return existsSync(passwordFile) ? readFileSync(passwordFile, "utf8").trim() : "";
};

const readPhotos = () => {
  const photoDir = join(SECRET_DIR, "photos");
  const photos = {};
  for (const fileName of readdirSync(photoDir)) {
    const mime = MIME_BY_EXTENSION[extname(fileName).toLowerCase()];
    if (!mime) continue;
    photos[fileName] = { mime, data: readFileSync(join(photoDir, fileName)).toString("base64") };
  }
  return photos;
};

const findMissingPhotos = (content, photos) => {
  const referenced = [
    content.landing.facePhoto,
    ...content.things.items.flatMap((item) => item.photos),
  ];
  return referenced.filter((fileName) => !photos[fileName]);
};

const encrypt = async (password, plaintext) => {
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = globalThis.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveBundleKey(password, salt, ["encrypt"], false);
  const ciphertext = await globalThis.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext,
  );
  return Buffer.concat([salt, iv, new Uint8Array(ciphertext)]);
};

const main = async () => {
  const password = readPassword();
  if (!password) {
    console.error("No password. Set SITE_PASSWORD or create secret/password.txt");
    process.exit(1);
  }

  const content = JSON.parse(readFileSync(join(SECRET_DIR, "content.json"), "utf8"));
  const photos = readPhotos();
  const missing = findMissingPhotos(content, photos);
  if (missing.length) {
    console.error(`Missing photos in secret/photos: ${missing.join(", ")}`);
    process.exit(1);
  }

  const plaintext = new TextEncoder().encode(JSON.stringify({ content, photos }));
  const output = await encrypt(password, plaintext);
  writeFileSync(OUTPUT_FILE, output);
  const sizeMb = (output.length / 1024 / 1024).toFixed(2);
  console.log(
    `Encrypted ${Object.keys(photos).length} photos + content → ${OUTPUT_FILE} (${sizeMb} MB)`,
  );
};

await main();
