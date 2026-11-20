import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { encryptToken, decryptToken, getEncryptionKey } from "@/lib/crypto";

describe("Token Encryptie & Crypto Helper (lib/crypto.ts)", () => {
  const originalEnv = process.env;
  const VALID_KEY = "5605357b9417a302688caff6c01c5a64bf7387f8aabfdcc1c0bf26a417cfb37a";

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.ENCRYPTION_KEY = VALID_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("succesfully encrypts and decrypts a plain text token", () => {
    const secretToken = "ya29.a0AfH6SMDh_google_refresh_token_secret_12345";
    const encrypted = encryptToken(secretToken);

    expect(encrypted).not.toBe(secretToken);
    expect(encrypted.split(":")).toHaveLength(3); // iv:tag:ciphertext

    const decrypted = decryptToken(encrypted);
    expect(decrypted).toBe(secretToken);
  });

  it("handles empty or falsy strings gracefully", () => {
    expect(encryptToken("")).toBe("");
    expect(decryptToken("")).toBe("");
  });

  it("produces distinct ciphertexts for identical inputs due to random IV", () => {
    const token = "fixed_token_value_for_testing";
    const enc1 = encryptToken(token);
    const enc2 = encryptToken(token);

    expect(enc1).not.toBe(enc2);
    expect(decryptToken(enc1)).toBe(token);
    expect(decryptToken(enc2)).toBe(token);
  });

  it("fails to decrypt if ciphertext is tampered with (AES-GCM integrity check)", () => {
    const token = "tamper_protection_test_token";
    const encrypted = encryptToken(token);
    const [iv, tag, ciphertext] = encrypted.split(":");

    // Alter last character of ciphertext
    const tamperedCiphertext =
      ciphertext.slice(0, -1) + (ciphertext.slice(-1) === "a" ? "b" : "a");
    const tampered = `${iv}:${tag}:${tamperedCiphertext}`;

    expect(() => decryptToken(tampered)).toThrow();
  });

  it("fails to decrypt if auth tag is tampered with", () => {
    const token = "auth_tag_tamper_test";
    const encrypted = encryptToken(token);
    const [iv, tag, ciphertext] = encrypted.split(":");

    const tamperedTag =
      tag.slice(0, -1) + (tag.slice(-1) === "0" ? "1" : "0");
    const tampered = `${iv}:${tamperedTag}:${ciphertext}`;

    expect(() => decryptToken(tampered)).toThrow();
  });

  it("throws clear error if ENCRYPTION_KEY is missing", () => {
    delete process.env.ENCRYPTION_KEY;
    delete process.env.APP_ENCRYPTION_KEY;

    expect(() => encryptToken("test")).toThrow(
      /ENCRYPTION_KEY ontbreekt in environment variables/i
    );
  });

  it("throws clear error if ENCRYPTION_KEY is not 32 bytes (64 hex characters)", () => {
    process.env.ENCRYPTION_KEY = "too_short_key";

    expect(() => encryptToken("test")).toThrow(
      /ENCRYPTION_KEY moet exact 32 bytes \(64 hex karakters\) lang zijn/i
    );
  });

  it("strips quotes and whitespace from ENCRYPTION_KEY correctly", () => {
    process.env.ENCRYPTION_KEY = `  "${VALID_KEY}"  `;
    const key = getEncryptionKey();
    expect(key.length).toBe(32);
    expect(key.toString("hex")).toBe(VALID_KEY);
  });

  it("supports fallback to APP_ENCRYPTION_KEY when ENCRYPTION_KEY is unset", () => {
    delete process.env.ENCRYPTION_KEY;
    process.env.APP_ENCRYPTION_KEY = VALID_KEY;

    const token = "app_key_fallback_token";
    const encrypted = encryptToken(token);
    expect(decryptToken(encrypted)).toBe(token);
  });
});
