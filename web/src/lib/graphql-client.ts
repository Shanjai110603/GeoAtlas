const GRAPHQL_URL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
  : 'http://localhost:3000/graphql';

export async function graphqlFetch<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  const res = await fetch(GRAPHQL_URL, {
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
