## NHttp

[![License](https://img.shields.io/:license-mit-blue.svg)](http://badges.mit-license.org)
[![deno.land](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Flatest-version%2Fx%2Fnhttp@0.3.1%2Fmod.ts)](https://deno.land/x/nhttp)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](http://makeapullrequest.com)
![deps badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fdep-count%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts)
![cache badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fdeno-visualizer.danopia.net%2Fshields%2Fcache-size%2Fhttps%2Fdeno.land%2Fx%2Fnhttp%2Fmod.ts)
[![nest.land](https://nest.land/badge.svg)](https://nest.land/package/nhttp)

Just native HTTP/2 micro framework for [Deno](https://deno.land/). so hot :rocket:

> Note: Deno native HTTP/2 [Hyper](https://hyper.rs/) requires Deno version 1.9.0 or higher.

## Features

* HTTP/2 support.
* Middleware support.
* Router support.
* Includes body parser (jsonBody, urlencodedBody).
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
import { NHttp } from "https://deno.land/x/nhttp@0.3.1/mod.ts";
```
### nest.land
```ts
import { NHttp } from "https://x.nest.land/nhttp@0.3.1/mod.ts";
```

## Usage
```ts
import { NHttp } from "https://deno.land/x/nhttp@0.3.1/mod.ts";

const app = new NHttp();

// rev is RequestEvent
app.get("/hello", (rev) => {
    rev.response.send('Hello');
});

app.get("/json", ({ response }) => {
    response.json({ name: 'nhttp' });
});

app.post("/save", ({ response, body }) => {
    response.json(body);
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
import { NHttp, Handler } from "https://deno.land/x/nhttp@0.3.1/mod.ts";

const app = new NHttp();

const foo: Handler = (rev, next) => {
    rev.foo = "foo";
    next();
}

app.use(foo);

app.get("/foo", ({ response, foo }) => {
    response.send(foo)
});

app.listen(3000);
```

## Wrapper for middleware
Simple wrapper like HOC for middleware (req, res, next);
> Note: not all middleware can work.
```ts
import { NHttp, Handler, wrapMiddleware } from "https://deno.land/x/nhttp@0.3.1/mod.ts";
import { UnprocessableEntityError } from "https://deno.land/x/nhttp@0.3.1/error.ts";
import { body, validationResult } from "https://esm.sh/express-validator";

const app = new NHttp();

// example express validator
const validator: Handler[] = [
  wrapMiddleware([
    body("username").isString(),
    body("password").isLength({ min: 6 }),
    body("email").isEmail(),
  ]),
  (rev, next) => {
    const errors = validationResult(rev);
    if (!errors.isEmpty()) {
       // status 422
      throw new UnprocessableEntityError(errors.array());
    }
    next();
  },
];

app.post("/user", validator, ({ response, body }) => {
    response.send(body)
});

app.listen(3000);
```
wrapMiddleware(...middleware: any, { beforeWrap });

### BeforeWrap
Mutate RequestEvent and HttpResponse before wrap middleware. 

```ts
...
app.use(wrapMiddleware(
    [midd1(), midd2()],
    {
        beforeWrap: (rev, res) => {
            // rev.any = fn;
            // res.any = fn;
        }
    }
))
...
```

## Router
```ts
import { NHttp, Router } from "https://deno.land/x/nhttp@0.3.1/mod.ts";

const app = new NHttp();

// user router
const userRouter = new Router();
userRouter.get("/user", ({ response }) => {
    response.send("hello user");
});

// item router
const itemRouter = new Router();
itemRouter.get("/item", ({ response }) => {
    response.send("hello item");
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
body: { [k: string]: any };
file: { [k: string]: any };
responseInit: ResponseInit;
response: HttpResponse;
url: string;
originalUrl: string;
params: { [k: string]: any };
path: string;
query: { [k: string]: any };
search: string | null;
_parsedUrl: { [k: string]: any };
getCookies: (decode?: boolean) => Record<string, string>;
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
### Response
```ts
...
// example with status and headers
app.get("/hello", ({ response }) => {
    response.status(200).header({ 'name': 'value' }).send('hello');
})
...
```

### Response.header
header: (key?: object | string | undefined, value?: any) => HttpResponse | string | Headers;
```ts
...
// key and value
res.header("key1", "value1");

// with object
res.header({ "key2": "value2" });

// multiple header
res.header({
    "key3": "value3",
    "key4": "value4"
});

// get header
console.log(res.header());
// => Headers {
//         "key1":"value1",
//         "key2":"value2",
//         "key3":"value3",
//         "key4":"value4",
//     }

// get header by key
console.log(res.header("key1"));
// => value1

// delete key1
res.header().delete("key1");
console.log(res.header());
// => Headers {
//         "key2":"value2",
//         "key3":"value3",
//         "key4":"value4",
//     }

// convert to json object
console.log(Object.fromEntries(res.header().entries()));
// => {
//       "key2":"value2",
//       "key3":"value3",
//       "key4":"value4",
//    }

// reset header
res.header(new Headers());
console.log(res.header());
// => Headers { }
```
### Response.type
Shorthand for response.header("Content-Type", yourContentType);

### Response.status
status: (code?: number | undefined) => HttpResponse | number;
```ts
// set status
response.status(201);

// get status
console.log(response.status());
// => 201
```

### Response.send
send: (body?: BodyInit | { [k: string]: any } | null) => Promise<void>;

### Response.json
json: (body: { [k: string]: any } | null) => Promise<void>;

### Response.redirect
redirect: (path: string, status?: number) => Promise<void>;
### Response.cookie
```ts
...
response.cookie("key", "value", {
    HttpOnly: true,
    maxAge: 60 * 60,
    // encode value
    encode: true
})
...
```
Type Cookie
```ts
type Cookie = {
  expires?: Date;
  maxAge?: number;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  other?: string[];
  encode?: boolean;
};
```
### Request getCookies
```ts
...
rev.getCookies();

// decode if encode true
rev.getCookies(true);
...
```
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
### Upload File

```ts
import { NHttp, multipart } from "https://deno.land/x/nhttp@0.3.1/mod.ts";
const app = new NHttp();

// handle upload multipart/form-data
app.post("/upload", multipart.upload({ name: "image" }), ({ response, file }) => {
    console.log(file.image);
    // => file or [file1, file2]
    response.send('success upload file');
});
app.listen(3000);
```
### Multipart
```ts
...

// non upload
multipart.default();

// upload
multipart.upload({ name: "image" });

// single upload
multipart.upload({ name: "image", maxCount: 1 });

// required field (will throw bad request error 400)
multipart.upload({ name: "image", required: true });

// accept file
multipart.upload({ name: "image", accept: 'png|jpg' });

// maxSize file
multipart.upload({ name: "image", maxSize: '2 mb' });

// callback
multipart.upload({
    name: "image", 
    callback: (file) => {
        // change filename
        file.filename = Date.now() + file.name;
    }
});

// destination
multipart.upload({
    name: "image", 
    dest: "public/user_folder/"
});

// multiple field
multipart.upload(
    [
        { 
            name: "user_image", 
            dest: "public/user_folder/"
            // other
        },
        { 
            name: "employee_image", 
            dest: "public/employee_folder/"
            // other
        }
    ]
);
...
```

### Params
Just object path parameters.
```ts
...
app.get("/user/:name", ({ response, params }) => {
    console.log(params);
    // => { name: 'john' }

    response.send(params.name);
});
...

// optional params.
// => { name: 'john' } or { name: null }
app.get("/user/:name?", ...handlers);

// extension params (Example: only png and jpg).
// => { filename: 'file.jpg' } or { filename: 'file.png' }
app.get("/image/:filename.(png|jpg)", ...handlers);

// exact params.
// => { wild: ['param1', 'param2'] }
app.get("/all/*", ...handlers);

```

### Query
Just object query parameters.
```ts
...
// example: /user?name=john
app.get("/user", ({ response, query }) => {
    console.log(query);
    // => { name: 'john' }

    response.send(query.name);
});
...

```

## Error Handling
```ts
...
// global error handling
app.onError((error, rev) => {
    rev.response.status(error.status || 500).send(error.message);
})

// global not found error handling
app.on404((rev) => {
    rev.response.status(404).send('Not Found');
})
...
```

## Throw Error
```ts
import { NHttp  } from "https://deno.land/x/nhttp@0.3.1/mod.ts";
import { BadRequestError } from "https://deno.land/x/nhttp@0.3.1/error.ts";

const app = new NHttp();

app.post("/user", async ({ response }) => {
    const data = await saveUser();
    if (!data) {
        throw new BadRequestError('Bad request for save');
    }
    response.send(data);
});

app.listen(3000);
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
## Config
```ts
...
// example config
const app = new NHttp({
    parseQuery: qs.parse,  /* default from utils */
    bodyLimit: {
        json: "1mb",       /* default 3mb */
        urlencoded: "1mb"  /* default 3mb */
    },
    env: "development"     /* or production */
});
...
```

## What's Next ?
[See examples](https://github.com/nhttp/nhttp/tree/master/examples)

### Want to contribute to this project? I gladly welcome it.
* Please ***fork***.
* Create a ***branch***. 
* ***Commit*** changes (before commit, please format the code with the command `deno fmt` in the src folder).
* Push to the created ***branch***.
* Make a ***PR (Pull Requests)***. 
* Thanks.

## List
- [x] Server App
- [x] Middleware
- [x] Router
- [x] Body Parser
- [x] Examples
- [x] Doc
- [ ] Unit Test
- [ ] Coverage

## License

[MIT](LICENSE)
