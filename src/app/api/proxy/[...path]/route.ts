import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/${path}${searchParams ? `?${searchParams}` : ''}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    
    // Check if it's a file download
    const contentType = res.headers.get('content-type');
    if (contentType && (contentType.includes('csv') || contentType.includes('markdown') || contentType.includes('text'))) {
      const blob = await res.blob();
      return new NextResponse(blob, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': res.headers.get('content-disposition') || '',
          'Cache-Control': 'no-store'
        }
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: 'Proxy Connection Failed', details: err.message }, { status: 502 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const path = (await params).path.join('/');
  const url = `${BACKEND_URL}/api/${path}`;
  
  const contentType = request.headers.get('content-type') || '';
  
  try {
    let fetchOptions: RequestInit = {
      method: 'POST',
      headers: {},
    };

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      fetchOptions.body = formData;
      // Note: Don't set Content-Type header for multipart/form-data, fetch will do it with the boundary
    } else {
      const body = await request.json();
      fetchOptions.body = JSON.stringify(body);
      (fetchOptions.headers as any)['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, fetchOptions);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: 'Proxy Connection Failed', details: err.message }, { status: 502 });
  }
}
