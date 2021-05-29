## NHttp

[![License](https://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)

Just native HTTP/2 micro framework for Deno. so hot :rocket:

> Note: Deno native HTTP/2 [Hyper](https://hyper.rs/) need Deno version 1.9.0 or higher.

## Features
* No third party modules and no std/lib by default.
* Support middleware.
* Support sub router.

[See examples](https://github.com/nhttp/nhttp/tree/main/examples)

## Installation
### deno.land
```ts
import { NHttp } from "https://deno.land/x/nhttp@0.0.1/mod.ts";
```
### nest.land
```ts
// will soon
// import { NHttp } from "https://x.nest.land/nhttp@0.0.1/mod.ts";
```

## Usage
```ts
import { NHttp } from "https://deno.land/x/nhttp@0.0.1/mod.ts";

const app = new NHttp();

app.get("/hello", (request, respondWith) => {
    respondWith(new Response("Hello"));
});
app.get("/json", (request, respondWith) => {
    // shorthand
    request.pond({ name: "john" });
});

app.listen(3000);
```
> Note: request.pond just support string and json only. for other type please use respondWith instead.

> Note: request.url is full url. use request.originalUrl instead.

## Run
> Note: native HTTP/2 is unstable. so just add --unstable flag.
```bash
deno run --allow-net --allow-read --unstable yourfile.ts
```

## Listen;
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

## Middleware
```ts
import { NHttp, HttpRequest, RespondWith, NextFunction } from "https://deno.land/x/nhttp@0.0.1/mod.ts";

const app = new NHttp();

const foo = (request: HttpRequest, respondWith: RespondWith, next: NextFunction) => {
    request.foo = "hello";
    next();
}

app.use(foo);

app.get("/hello", (request, respondWith) => {
    respondWith(new Response(request.foo));
});

app.listen(3000);
```

## Router
```ts
import { NHttp, Router } from "https://deno.land/x/nhttp@0.0.1/mod.ts";

const app = new NHttp();

// user router
const userRouter = new Router();
userRouter.get("/user", (request, respondWith) => {
    respondWith(new Response("hello user"));
});

// item router
const itemRouter = new Router();
itemRouter.get("/item", (request, respondWith) => {
    respondWith(new Response("hello item"));
});

// register the router
app.use([userRouter, itemRouter]);
// or with prefix
// app.use('/api', [userRouter, itemRouter]);

app.listen(3000);
```

## Request
Just Web API [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) with add more some object like :
```ts
pond: (body?: string | json | undefined, opts?: { status: number; headers: Headers });
originalUrl: string;
params: object;
path: string;
query: object;
search: string | null;
//   more
```

## Handle Request Body and Upload
Native http is very simple read body and upload file.
```ts
import { NHttp } from "https://deno.land/x/nhttp@0.0.1/mod.ts";
const app = new NHttp();

// read body json
app.post("/json", async (request, respondWith) => {
    let body = {};
    if (request.headers.get('content-type')?.includes('application/json')) {
        body = await request.json();
    }
    console.log(body);
    respondWith(new Response("test"));
});

// read body urlencoded
app.post("/urlencoded", async (request, respondWith) => {
    let body = {};
    if (request.headers.get('content-type')?.includes('application/x-www-form-urlencoded')) {
        body = await request.text();
    }
    body = Object.fromEntries(new URLSearchParams(body));
    console.log(body);
    respondWith(new Response("test"));
});
 
// handle upload multipart/form-data
app.post("/upload", async (request, respondWith) => {
    let body;
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
        body = await request.formData();
    }
    if (!body) {
        throw new Error("Content type must be multipart/form-data");
    }
    const formData = Object.fromEntries(body.entries());
    if (!formData.file) {
        throw new Error("File is required");
    }
    const file = formData.file as File;
    console.log(file.name, file.size);
    const buffer = await file.arrayBuffer();
    await Deno.writeFile("./" + file.name, new Uint8Array(buffer));
    respondWith(new Response("Success upload"));
});
app.listen(3000);
```
Of course, so that it can be used over and over again, it can be made as middleware.

## RespondWith
Just callback Web API [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).
```ts
...
// example with status and headers
app.get("/hello", (request, respondWith) => {
    respondWith(new Response("Hello", {
        status: 200,
        headers: new Headers({
            'x-powered-by': 'nhttp'
        })
    }))
})
...
```
## Error Handling
```ts
...
// global error handling
app.onError((error, request, respondWith) => {
    respondWith(new Response(error.message), {
        status: error.status || 500
    })
})

// global not found error handling
app.on404((request, respondWith) => {
    respondWith(new Response(`${request.originalUrl} not found`), {
        status: 404
    })
})
...
```

## What Next ?
[See examples](https://github.com/nhttp/nhttp/tree/main/examples)

## License

[MIT](LICENSE)