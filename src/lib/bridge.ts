export async function callBridge(path: string, body: Record<string, unknown>) {
  const bridgeUrl = process.env.BRIDGE_URL;
  const bridgeSecret = process.env.BRIDGE_SHARED_SECRET;

  if (!bridgeUrl || !bridgeSecret) {
    throw new Error("Bridge environment is not configured.");
  }

  const response = await fetch(`${bridgeUrl}${path}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-bridge-secret": bridgeSecret,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const json = await response.json().catch(() => null);

  if (!response.ok || !json?.ok) {
    throw new Error(json?.error || `Bridge request failed for ${path}`);
  }

  return json;
}
