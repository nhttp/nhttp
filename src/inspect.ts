import type { HttpResponse } from "./http_response.ts";
import type { RequestEvent } from "./request_event.ts";
import type { TObject } from "./types.ts";

function inspect(target: TObject, obj: TObject) {
  const ret = obj;
  for (const key in target) {
    if (ret[key] === void 0) {
      ret[key] = target[key];
    }
  }
  return ret;
}

export function revInspect(rev: RequestEvent) {
  return inspect(rev, {
    body: rev.body,
    newRequest: rev.newRequest,
    cookies: rev.cookies,
    file: rev.file,
    headers: rev.headers,
    info: rev.info,
    method: rev.method,
    originalUrl: rev.originalUrl,
    params: rev.params,
    path: rev.path,
    query: rev.query,
    request: rev.request,
    responseInit: rev.responseInit,
    respondWith: rev.respondWith,
    requestEvent: rev.requestEvent,
    response: rev.response,
    route: rev.route,
    search: rev.search,
    send: rev.send,
    url: rev.url,
    undefined: rev.undefined,
    waitUntil: rev.waitUntil,
  });
}

export function resInspect(res: HttpResponse) {
  return inspect(res, {
    clearCookie: res.clearCookie,
    cookie: res.cookie,
    getHeader: res.getHeader,
    header: res.header,
    json: res.json,
    params: res.params,
    statusCode: res.statusCode,
    redirect: res.redirect,
    attachment: res.attachment,
    render: res.render,
    send: res.send,
    html: res.html,
    sendStatus: res.sendStatus,
    setHeader: res.setHeader,
    status: res.status,
    type: res.type,
  });
}

export const deno_inspect = Symbol.for("Deno.customInspect");
export const node_inspect = Symbol.for("nodejs.util.inspect.custom");
