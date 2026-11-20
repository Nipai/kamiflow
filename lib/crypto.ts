import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96 bits recommended for AES-GCM
const AUTH_TAG_LENGTH = 16; // 128 bits auth tag

/**
 * Haalt en valideert de 32-byte (64 hex karakters) encryptiesleutel op uit de environment variables.
 */
export function getEncryptionKey(): Buffer {
  const rawKey = process.env.ENCRYPTION_KEY || process.env.APP_ENCRYPTION_KEY;

  if (!rawKey) {
    throw new Error(
      "ENCRYPTION_KEY ontbreekt in environment variables. Configureer een 32-byte (64 hex karakters) AES-256-GCM sleutel."
    );
  }

  // Verwijder eventuele quotes of spaties (inclusief geneste quotes zoals '"..."')
  const cleanKey = rawKey.replace(/['"]/g, "").trim();

  if (cleanKey.length !== 64 || !/^[0-9a-fA-F]+$/.test(cleanKey)) {
    throw new Error(
      "ENCRYPTION_KEY moet exact 32 bytes (64 hex karakters) lang zijn voor AES-256-GCM."
    );
  }

  return Buffer.from(cleanKey, "hex");
}

/**
 * Versleutelt gevoelige OAuth tokens met AES-256-GCM.
 * Formaat van uitvoer: ivHex:authTagHex:ciphertextHex
 */
export function encryptToken(text: string): string {
  if (!text) {
    return "";
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  let ciphertext = cipher.update(text, "utf8", "hex");
  ciphertext += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${ciphertext}`;
}

/**
 * Ontsleutelt een met AES-256-GCM versleuteld token.
 * Verwacht formaat: ivHex:authTagHex:ciphertextHex
 */
export function decryptToken(encrypted: string): string {
  if (!encrypted) {
    return "";
  }

  const parts = encrypted.split(":");
  if (parts.length !== 3) {
    throw new Error("Ongeldig versleuteld token formaat. Verwacht iv:authTag:ciphertext.");
  }

  const [ivHex, authTagHex, ciphertextHex] = parts;
  const key = getEncryptionKey();

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error("Ongeldige IV of Auth Tag lengte.");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(ciphertextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
