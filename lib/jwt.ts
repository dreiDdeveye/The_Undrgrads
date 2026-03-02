// Simple JWT utility for client-side authentication
// NOTE: For production, use a proper server-side auth solution (e.g. Supabase Auth)

const SECRET_KEY = process.env.NEXT_PUBLIC_AUTH_SECRET || "undergrads-secret-key-2024"

interface JWTPayload {
  username: string
  iat: number
  exp: number
}

function createSignature(header: string, payload: string): string {
  // Simple hash-based signature (for demo only - use proper HMAC in production)
  let hash = 0
  const str = SECRET_KEY + header + payload
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash + char) | 0
  }
  return btoa(String(hash))
}

export function generateToken(username: string): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const payload: JWTPayload = {
    username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  }
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = createSignature(header, encodedPayload)

  return `${header}.${encodedPayload}.${signature}`
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))

    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    // Verify signature
    const expectedSignature = createSignature(parts[0], parts[1])
    if (parts[2] !== expectedSignature) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export function isTokenValid(token: string): boolean {
  return verifyToken(token) !== null
}
