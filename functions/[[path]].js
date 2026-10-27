export async function onRequest(context) {
  const response = await context.next();
  if (response.status !== 404) return response;

  const headers = new Headers(response.headers);
  const directives = new Set(
    String(headers.get('cache-control') || '')
      .split(',')
      .map(value => value.trim().toLowerCase())
      .filter(Boolean)
  );
  directives.add('no-store');
  directives.add('no-transform');
  headers.set('cache-control', [...directives].join(', '));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
