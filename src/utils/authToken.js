function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')

  return window.atob(padded)
}

export function getJwtPayload(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  try {
    const [, payload] = token.split('.')
    return payload ? JSON.parse(decodeBase64Url(payload)) : null
  } catch {
    return null
  }
}

export function getUserIdFromToken(token) {
  return getJwtPayload(token)?.id ?? null
}

export function getRoleFromToken(token) {
  return getJwtPayload(token)?.role ?? null
}

export function isAdminToken(token) {
  return getRoleFromToken(token) === 'admin'
}

export function isExpiredJwt(token) {
  const payload = getJwtPayload(token)

  return typeof payload?.exp === 'number' && payload.exp * 1000 <= Date.now()
}
