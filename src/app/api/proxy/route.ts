import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url, method = 'GET', headers = {}, body } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'Missing target URL' }, { status: 400 });
    }

    const cleanHeaders: Record<string, string> = {};
    if (headers && typeof headers === 'object') {
      Object.entries(headers).forEach(([k, v]) => {
        if (k && v && typeof v === 'string') {
          cleanHeaders[k] = v;
        }
      });
    }

    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: cleanHeaders,
      cache: 'no-store',
    };

    if (body && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const startTime = performance.now();
    let response: Response;
    try {
      response = await fetch(url, fetchOptions);
    } catch (networkError: any) {
      return NextResponse.json(
        {
          error: `Network Connection Error: ${networkError.message || 'Failed to fetch'}`,
          status: 502,
          statusText: 'Bad Gateway',
          latencyMs: Math.round(performance.now() - startTime),
        },
        { status: 502 }
      );
    }

    const endTime = performance.now();
    const latencyMs = Math.round(endTime - startTime);

    const responseText = await response.text();
    let parsedBody: any = null;
    try {
      parsedBody = JSON.parse(responseText);
    } catch {
      parsedBody = null;
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText || (response.status === 200 ? 'OK' : 'Response Received'),
      latencyMs,
      sizeBytes: new Blob([responseText]).size,
      body: responseText,
      parsedBody,
      headers: responseHeaders,
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal proxy execution error' },
      { status: 500 }
    );
  }
}
