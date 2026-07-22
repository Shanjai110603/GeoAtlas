import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('geoatlas_jwt')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const res = await fetch(`${API_BASE_URL}/v1/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ user: null });
    }

    const data = await res.json();
    return NextResponse.json({ user: data.user });
  } catch (err) {
    return NextResponse.json({ user: null });
  }
}
