import crypto from "crypto";
import { headers } from "next/headers";

/**
 * # Content Security Policy (CSP) Nonce
 *
 * ## What is a Nonce?
 *
 * A **nonce** (Number used ONCE) is a cryptographically-secure random value that allows
 * specific inline scripts to execute while blocking all others. It's a critical XSS
 * (Cross-Site Scripting) defense mechanism.
 *
 * ## How It Works
 *
 * 1. **Server generates a random nonce** for each request (e.g., "Xy9Pqr...")
 * 2. **Server adds nonce to CSP header**: `script-src 'nonce-Xy9Pqr...'`
 * 3. **Server adds nonce to trusted scripts**: `<script nonce="Xy9Pqr...">...</script>`
 * 4. **Browser only executes scripts** with matching nonce
 
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP#nonces
 * @see middleware.ts for nonce generation and CSP header setup
 */

/**
 * Generate a cryptographically secure nonce for CSP.
 *
 * Creates a 128-bit (16-byte) random value encoded as base64.
 * This should be called once per request in middleware.
 *
 * @returns Base64-encoded random string (e.g., "Xy9Pqr...==")
 */
export function generateNonce(): string {
  return crypto.randomBytes(16).toString("base64");
}

/**
 * Get the nonce from request headers (set by middleware).
 *
 * This should be called in Server Components to retrieve the nonce
 * and pass it to inline script tags.
 *
 * @returns The nonce value or undefined if not set
 *
 * @example
 * ```typescript
 * // In a Server Component
 * export default async function Layout() {
 *   const nonce = await getNonce();
 *   return <script nonce={nonce}>...</script>
 * }
 * ```
 */
export async function getNonce(): Promise<string | undefined> {
  const headersList = await headers();
  return headersList.get("x-nonce") || undefined;
}
