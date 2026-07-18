import { normalizeList } from '../utils/flightData'

const USER_BOOKINGS_TTL_MS = 30 * 1000
const BOOKING_DETAIL_TTL_MS = 30 * 1000

// Map<`${token}|${userId}|${status}`, { data, fetchedAt }>
let userBookingsCache = new Map()
// Map<`${token}|${bookingId}`, { booking, fetchedAt }>
let bookingDetailCache = new Map()

function userKey(token, userId, status) {
  return `${token}|${userId}|${status || ''}`
}

function detailKey(token, bookingId) {
  return `${token}|${bookingId}`
}

function cacheBookingDetail(token, booking) {
  const id = booking?.id
  if (id == null) {
    return
  }

  bookingDetailCache.set(detailKey(token, id), {
    booking,
    fetchedAt: Date.now(),
  })
}

/**
 * Stale-while-revalidate user bookings list. Returns cached data when fresh;
 * when stale but present, returns it immediately and refreshes in the background.
 */
export async function getCachedUserBookings(token, userId, status, fetcher) {
  const key = userKey(token, userId, status)
  const entry = userBookingsCache.get(key)
  const isFresh = entry && Date.now() - entry.fetchedAt < USER_BOOKINGS_TTL_MS

  if (entry && isFresh) {
    return entry.data
  }

  const revalidate = async () => {
    const data = await fetcher()
    userBookingsCache.set(key, { data, fetchedAt: Date.now() })
    for (const booking of normalizeList(data)) {
      cacheBookingDetail(token, booking)
    }
    return data
  }

  if (entry) {
    // Stale: serve cached immediately, refresh in background for next mount.
    revalidate().catch(() => {})
    return entry.data
  }

  return revalidate()
}

export function getCachedBooking(token, bookingId) {
  const entry = bookingDetailCache.get(detailKey(token, bookingId))
  if (!entry) {
    return null
  }

  if (Date.now() - entry.fetchedAt >= BOOKING_DETAIL_TTL_MS) {
    return null
  }

  return entry.booking
}

export function setCachedBooking(token, booking) {
  cacheBookingDetail(token, booking)
}

/** Drop cached bookings lists (e.g. after a new booking or payment). */
export function invalidateUserBookings() {
  userBookingsCache = new Map()
}

export function clearBookingCache() {
  userBookingsCache = new Map()
  bookingDetailCache = new Map()
}
