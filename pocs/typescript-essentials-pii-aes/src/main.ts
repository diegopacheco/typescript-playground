import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

interface Encrypted {
  iv: string;
  tag: string;
  data: string;
}

function deriveKey(password: string, salt: Buffer): Buffer {
  return scryptSync(password, salt, 32);
}

function encrypt(plaintext: string, key: Buffer): Encrypted {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return { iv: iv.toString("hex"), tag: tag.toString("hex"), data: data.toString("hex") };
}

function decrypt(payload: Encrypted, key: Buffer): string {
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(payload.iv, "hex"));
  decipher.setAuthTag(Buffer.from(payload.tag, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(payload.data, "hex")),
    decipher.final(),
  ]).toString("utf8");
}

function main(): void {
  const salt = randomBytes(16);
  const key = deriveKey("correct horse battery staple", salt);

  const secret = "SSN 123-45-6789";
  const encrypted = encrypt(secret, key);
  console.log("ciphertext:", encrypted.data);
  console.log("iv/tag lengths:", encrypted.iv.length, encrypted.tag.length);

  console.log("decrypted:", decrypt(encrypted, key));

  const tampered = { ...encrypted, data: encrypted.data.replace(/.$/, "0") };
  try {
    decrypt(tampered, key);
  } catch (error) {
    console.log("tamper detected:", (error as Error).message.split("\n")[0]);
  }
}

main();
