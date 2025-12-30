// Simplified - no backend API needed
// This file is kept for compatibility but the app now uses Cal.com for all bookings

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  console.log("API request attempted but backend is not available:", { method, url, data });
  throw new Error("Backend is not available - use Cal.com for bookings");
}
