// Cloudflare Edge Web Crypto Auth Helpers (Zero external dependencies)

export function bufToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export function hexToBuf(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

export function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bufToHex(bytes);
}

export async function hashPassword(password, saltHex) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const salt = hexToBuf(saltHex);
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 10000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign"]
  );
  const raw = await crypto.subtle.exportKey("raw", derivedKey);
  return bufToHex(raw);
}

export async function createSessionToken(userId, email, secret = "studyo_edge_jwt_secret_free") {
  const exp = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
  const payload = JSON.stringify({ userId, email, exp });
  const payloadB64 = btoa(payload);

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
  const sigHex = bufToHex(signature);

  return `${payloadB64}.${sigHex}`;
}

export async function verifySessionToken(token, secret = "studyo_edge_jwt_secret_free") {
  if (!token || typeof token !== "string") return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, sigHex] = parts;
  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const expectedSig = hexToBuf(sigHex);
    const isValid = await crypto.subtle.verify("HMAC", key, expectedSig, enc.encode(payloadB64));
    if (!isValid) return null;

    const payload = JSON.parse(atob(payloadB64));
    if (Date.now() > payload.exp) return null; // Expired

    return payload;
  } catch (err) {
    return null;
  }
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  });
}
