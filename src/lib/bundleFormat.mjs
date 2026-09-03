// Shared by scripts/encryptBundle.mjs (Node) and src/lib/crypto.ts (browser).
// Bundle layout: [salt][iv][AES-256-GCM ciphertext of JSON { content, photos }].

export const BUNDLE_FILE = "bundle.enc";
export const PBKDF2_ITERATIONS = 300_000;
export const SALT_LENGTH = 16;
export const IV_LENGTH = 12;
export const PAYLOAD_OFFSET = SALT_LENGTH + IV_LENGTH;

/**
 * @param {string} password
 * @param {Uint8Array<ArrayBuffer>} salt
 * @param {KeyUsage[]} usages
 * @param {boolean} extractable
 * @returns {Promise<CryptoKey>}
 */
export const deriveBundleKey = async (password, salt, usages, extractable) => {
  const { subtle } = globalThis.crypto;
  const passwordKey = await subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    extractable,
    usages,
  );
};
