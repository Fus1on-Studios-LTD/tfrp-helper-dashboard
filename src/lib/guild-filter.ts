export function getSelectedGuildId(searchParams?: Record<string, string | string[] | undefined>) {
  const raw = searchParams?.guild;
  if (Array.isArray(raw)) return raw[0] || "";
  return raw || "";
}

export function withGuildQuery(pathname: string, guildId: string) {
  const params = new URLSearchParams();
  if (guildId) params.set("guild", guildId);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
