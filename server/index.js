export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return Response.redirect(new URL('/sentences/', url), 302);
    }

    if (env?.ASSETS?.fetch) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Static assets are unavailable.', { status: 503 });
  },
};
