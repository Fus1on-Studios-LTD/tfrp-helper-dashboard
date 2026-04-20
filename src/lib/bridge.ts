export async function callInternalApi(path: string, body: Record<string, unknown>) {
  const apiUrl = process.env.BRIDGE_URL || process.env.INTERNAL_API_URL;
  const apiSecret = process.env.BRIDGE_SHARED_SECRET || process.env.INTERNAL_API_SHARED_SECRET;

  if (!apiUrl || !apiSecret) {
    throw new Error("Internal API environment is not configured.");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-internal-api-secret": apiSecret,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.ok) {
    throw new Error(json?.error || `Internal API request failed for ${path}`);
  }

  return json;
}
