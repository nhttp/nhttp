## NHttp

[![License](https://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)

Just native HTTP/2 micro framework for [Deno](https://deno.land/). so hot :rocket:

> Note: Deno native HTTP/2 [Hyper](https://hyper.rs/) requires Deno version 1.9.0 or higher.

## Features

* HTTP/2 support.
* Middleware support.
* Sub router support.
* No third party modules and no std/lib by default.

[See examples](https://github.com/nhttp/nhttp/tree/master/examples)
## Benchmark
Here the simple benchmark.

`autocannon -c 100 http://localhost:3000/hello`
|Name |Req/sec |Throughput |
|--- |--- |--- |
|Native|21433|2.5 MB|
|NHttp|21127|2.5 MB|
|std/http|14569|626 KB|

> Note: maybe not relevant if compared with std/http or other Deno framework using std/http. nhttp uses native deno http. 

## Installation
### deno.land
```ts
import { NHttp } from "https://deno.land/x/nhttp@0.1.0/mod.ts";
```
### nest.land
```ts
import { NHttp } from "https://x.nest.land/nhttp@0.1.0/mod.ts";
```

## Usage
```ts
import { NHttp, JsonResponse } from "https://deno.land/x/nhttp@0.1.0/mod.ts";

const app = new NHttp();

// rev is RequestEvent
app.get("/hello", (rev) => {
    rev.respondWith(new Response("Hello"));
});

app.get("/json", ({ respondWith }) => {
    respondWith(new JsonResponse({ name: "john" }));
});

app.listen(3000, () => {
    console.log("> Running on port 3000");
});
```

## Run
> Note: Deno native http is unstable. so just add --unstable flag.
```bash
deno run --allow-net --allow-read --unstable yourfile.ts
```

## Middleware
```ts
import { NHttp, Handler } from "https://deno.land/x/nhttp@0.1.0/mod.ts";

const app = new NHttp();

const foo: Handler = (rev, next) => {
    rev.foo = "foo";
    next();
}

app.use(foo);

app.get("/foo", ({ respondWith, foo }) => {
    respondWith(new Response(foo));
});

app.listen(3000);
```

## Router
```ts
import { NHttp, Router } from "https://deno.land/x/nhttp@0.1.0/mod.ts";

const app = new NHttp();

// user router
const userRouter = new Router();
userRouter.get("/user", ({ respondWith }) => {
    respondWith(new Response("hello user"));
});

// item router
const itemRouter = new Router();
itemRouter.get("/item", ({ respondWith }) => {
    respondWith(new Response("hello item"));
});

// register the router
app.use('/api', [userRouter, itemRouter]);
// or with middleware
// app.use('/api', mid1, mid2, [userRouter, itemRouter]);

app.listen(3000);
```
## Rev
rev is a RequestEvent with some object like :

```ts
// default from Deno.RequestEvent
request: Request;
respondWith(r: Response | Promise<Response>): Promise<void>;

// custom
body: object;
file: object;
url: string;
originalUrl: string;
params: object;
path: string;
query: object;
search: string | null;
_parsedUrl: object;
// more...
```

### Request
Just Web API [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request).
```ts
...
console.log(rev.request.method);
// => GET

console.log(rev.request.url);
// => http://localhost:3000/path

console.log(new URL(rev.request.url));
// => URL {...}

console.log(rev.request.headers);
// => Headers {...}
...
```
> Note: rev.request.url is a full url. rev.url is a path url.
### RespondWith
Just callback Web API [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).
```ts
...
// example with status and headers
app.get("/hello", (rev) => {
    rev.respondWith(new Response("Hello", {
        status: 200,
        headers: new Headers({
            'x-powered-by': 'nhttp'
        })
    }))
})
...
```
### Body and File (post, put, patch. or any)

body and file are available where use jsonBody, urlencodedBody or multipartBody.

```ts
import { NHttp, jsonBody, urlencodedBody, multipartBody } from "https://deno.land/x/nhttp@0.1.0/mod.ts";
const app = new NHttp();

app.use(jsonBody(), urlencodedBody());

app.post("/hello", ({ respondWith, body }) => {
    console.log(body);
    respondWith(new Response("body was parsed"));
});

// handle upload multipart/form-data
app.post("/upload", multipartBody({ fileKey: "image" }), async (rev) => {
    if (!rev.file?.image) {
      throw new Error("Image is required");
    }
    let file = rev.file.image as File;
    console.log(file.name);
    console.log(rev.body);

    // convert to array buffer
    let arrBuf = await file.arrayBuffer();

    // save file
    await Deno.writeFile("./" + file.name, new Uint8Array(arrBuf));
    rev.respondWith(new Response("Success upload file"));
});
app.listen(3000);
```
For nested object in urlencoded and multipart, you can use qs : 
```ts
import { NHttp, urlencodedBody, multipartBody } from "https://deno.land/x/nhttp@0.1.0/mod.ts";
import qs from "https://esm.sh/qs?no-check";

// application/x-www-form-urlencoded
app.use(urlencodedBody({ parse: qs.parse }));

// multipart/form-data
app.post("/upload", multipartBody({ fileKey: "image", parse: qs.parse }), ...more);

```

## Error Handling
```ts
...
// global error handling
app.onError((error, rev) => {
    rev.respondWith(new Response(error.message, {
        status: error.status || 500
    }))
})

// global not found error handling
app.on404((rev) => {
    rev.respondWith(new Response(`${rev.url} not found`, {
        status: 404
    }))
})
...
```

## Listen
```ts
app.listen(3000);
// or
const callback = (err, opts) => {
    if (err) console.log(err);
    console.log("Running on server 3000");
}
app.listen(3000, callback);
// or
app.listen({ port: 3000, hostname: 'localhost' }, callback);
// or https
app.listen({ 
    port: 443,
    certFile: "./path/to/localhost.crt",
    keyFile: "./path/to/localhost.key",
}, callback);
// or http/2
app.listen({ 
    port: 443,
    certFile: "./path/to/localhost.crt",
    keyFile: "./path/to/localhost.key",
    alpnProtocols: ["h2", "http/1.1"]
}, callback);
```

## What's Next ?
[See examples](https://github.com/nhttp/nhttp/tree/master/examples)

## License

[MIT](LICENSE)
