/**
 * Source: https://dash.deno.com/playground/beacon-sink
 * Public: https://beacon-sink.deno.dev
 */
const subscribers = new Map();
const broadcast = (uid: string, event: string, data: string) => {
    const msg = `id: ${uid}\r\nevent: ${event}\r\ndata: ${data}\r\n\r\n`;
    const encoded = new TextEncoder().encode(msg);
    subscribers.get(uid)?.enqueue(encoded);
};

Deno.serve((req: Request, connInfo) => {

    const url = new URL(req.url);
    const uid = url.searchParams.get('uid');

    if (url.pathname === '/subscribe' && uid) {
        const body = new ReadableStream({
            start(controller) {
                subscribers.set(uid, controller);
            },
            cancel() {
                subscribers.delete(uid);
            }
        });
        return new Response(body, {
            headers: {
                'content-type': 'text/event-stream',
                'access-control-allow-origin': '*',
            }
        });
    }

    if (url.pathname === '/ping' && uid) {
        broadcast(uid, 'pingback', `Hooray! You have done it, thanks Mozilla ❤ ${JSON.stringify(connInfo.remoteAddr)}`);
        return new Response(null, { status: 204 });
    }
    
    return new Response(null, { status: 302, headers: { location: 'https://bugzilla.mozilla.org/show_bug.cgi?id=1887852' } });
});
