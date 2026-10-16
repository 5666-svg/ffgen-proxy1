export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");
    if (!target) return new Response("missing url", { status: 400 });
    const headers = new Headers();
    for (const [k, v] of request.headers) {
      if (k.toLowerCase() === "host" || k.toLowerCase() === "content-length") continue;
      headers.set(k, v);
    }
    let body = null;
    if (request.method !== "GET" && request.method !== "HEAD") {
      body = await request.arrayBuffer();
    }
    const res = await fetch(target, { method: request.method, headers: headers, body: body, redirect: "manual" });
    return new Response(res.body, {
      status: res.status,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
        "access-control-allow-origin": "*"
      }
    });
  }
}
