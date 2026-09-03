import type { Bundle, RawBundle } from "../types/interfaces";
import {
  BUNDLE_FILE,
  IV_LENGTH,
  PAYLOAD_OFFSET,
  SALT_LENGTH,
  deriveBundleKey,
} from "./bundleFormat.mjs";

const SESSION_KEY_STORAGE = "birthday-key";

let bundleBytes: ArrayBuffer | null = null;

const base64ToBytes = (encoded: string): Uint8Array<ArrayBuffer> =>
  Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0));

const bytesToBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes));

export const fetchBundle = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}${BUNDLE_FILE}`);
    if (!response.ok) return false;
    bundleBytes = await response.arrayBuffer();
    return bundleBytes.byteLength > PAYLOAD_OFFSET;
  } catch {
    return false;
  }
};

const decryptBundle = async (bytes: ArrayBuffer, key: CryptoKey): Promise<Bundle | null> => {
  const iv = new Uint8Array(bytes, SALT_LENGTH, IV_LENGTH);
  const ciphertext = new Uint8Array(bytes, PAYLOAD_OFFSET);
  try {
    const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
    const raw = JSON.parse(new TextDecoder().decode(plaintext)) as RawBundle;
    const photoUrls: Record<string, string> = {};
    for (const [fileName, photo] of Object.entries(raw.photos)) {
      const blob = new Blob([base64ToBytes(photo.data)], { type: photo.mime });
      photoUrls[fileName] = URL.createObjectURL(blob);
    }
    return { content: raw.content, photo: (fileName) => photoUrls[fileName] ?? "" };
  } catch {
    // AES-GCM rejects the auth tag on a wrong password, which is the only failure we expect here
    return null;
  }
};

export const unlockBundle = async (password: string): Promise<Bundle | null> => {
  if (!bundleBytes) return null;
  const salt = new Uint8Array(bundleBytes, 0, SALT_LENGTH);
  const key = await deriveBundleKey(password, salt, ["decrypt"], true);
  const bundle = await decryptBundle(bundleBytes, key);
  if (bundle) {
    const rawKey = new Uint8Array(await crypto.subtle.exportKey("raw", key));
    sessionStorage.setItem(SESSION_KEY_STORAGE, bytesToBase64(rawKey));
  }
  return bundle;
};

export const restoreBundle = async (): Promise<Bundle | null> => {
  const storedKey = sessionStorage.getItem(SESSION_KEY_STORAGE);
  if (!storedKey || !bundleBytes) return null;
  try {
    const key = await crypto.subtle.importKey("raw", base64ToBytes(storedKey), "AES-GCM", false, [
      "decrypt",
    ]);
    return await decryptBundle(bundleBytes, key);
  } catch {
    sessionStorage.removeItem(SESSION_KEY_STORAGE);
    return null;
  }
};
