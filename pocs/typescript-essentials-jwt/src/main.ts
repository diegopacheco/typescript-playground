import { createHmac, timingSafeEqual } from "node:crypto";

interface Payload {
  sub: string;
  role?: string;
  exp?: number;
}

function b64urlEncode(raw: Buffer): string {
  return raw.toString("base64url");
}

function b64urlDecode(text: string): Buffer {
  return Buffer.from(text, "base64url");
}

function sign(payload: Payload, secret: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const headerPart = b64urlEncode(Buffer.from(JSON.stringify(header)));
  const payloadPart = b64urlEncode(Buffer.from(JSON.stringify(payload)));
  const signingInput = `${headerPart}.${payloadPart}`;
  const signature = createHmac("sha256", secret).update(signingInput).digest();
  return `${signingInput}.${b64urlEncode(signature)}`;
}

function verify(token: string, secret: string): Payload {
  const [headerPart, payloadPart, signaturePart] = token.split(".");
  const signingInput = `${headerPart}.${payloadPart}`;
  const expected = createHmac("sha256", secret).update(signingInput).digest();
  const actual = b64urlDecode(signaturePart);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new Error("invalid signature");
  }
  const payload = JSON.parse(b64urlDecode(payloadPart).toString()) as Payload;
  if (payload.exp !== undefined && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error("token expired");
  }
  return payload;
}

function main(): void {
  const secret = "super-secret-key";
  const token = sign({ sub: "alice", role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 }, secret);
  console.log("token:", token.slice(0, 72) + "...");

  console.log("verified payload:", verify(token, secret));

  try {
    verify(token, "wrong-secret");
  } catch (error) {
    console.log("tamper check:", (error as Error).message);
  }

  const expired = sign({ sub: "bob", exp: Math.floor(Date.now() / 1000) - 10 }, secret);
  try {
    verify(expired, secret);
  } catch (error) {
    console.log("expiry check:", (error as Error).message);
  }
}

main();
