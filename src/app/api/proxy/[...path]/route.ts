import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

function forwardHeaders(request: NextRequest): HeadersInit {
  const headers: Record<string, string> = {};
  const sessionId = request.headers.get('x-session-id');
  if (sessionId) headers['X-Session-Id'] = sessionId;
  return headers;
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: forwardHeaders(request),
    });

    const contentType = res.headers.get('content-type');
    if (contentType && (contentType.includes('csv') || contentType.includes('markdown') || contentType.includes('text'))) {
      const blob = await res.blob();
      return new NextResponse(blob, {
        status: res.status,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': res.headers.get('content-disposition') || '',
          'Cache-Control': 'no-store',
        },
      });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: 'Proxy Connection Failed', details: err.message }, { status: 502 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`;

  const contentType = request.headers.get('content-type') || '';

  try {
    const headers = forwardHeaders(request) as Record<string, string>;
    let fetchOptions: RequestInit = {
      method: 'POST',
      headers,
    };

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      fetchOptions.body = formData;
    } else {
      const body = await request.json();
      fetchOptions.body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, fetchOptions);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: 'Proxy Connection Failed', details: err.message }, { status: 502 });
  }
}
