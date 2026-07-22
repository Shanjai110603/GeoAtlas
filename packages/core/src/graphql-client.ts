export async function graphqlFetch<T>(
  query: string,
  variables: Record<string, any> = {},
  baseUrl: string = 'http://localhost:3000'
): Promise<T> {
  const res = await fetch(`${baseUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`GraphQL request failed with status ${res.status}`);
  }

  const json = await res.json();
  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message || 'GraphQL Error');
  }

  return json.data;
}
