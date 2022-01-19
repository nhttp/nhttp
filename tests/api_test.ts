import { superdeno } from "https://deno.land/x/superdeno@4.7.2/mod.ts";
import { NHttp } from "./../mod.ts";

const app = new NHttp();

// normal path
app.get("/", () => "Hello");

// send json
app.get("/json", () => ({ name: "john" }));

// test query
app.get("/users", ({ query }) => query);

// test params
app.get("/users/:usersId/books/:bookId", ({ params }) => params);

// test params extension
app.get("/image/:name.(jpg|png)", ({ params }) => params);

// with regexp
app.get(/\/hello/, () => "Hello Regexp");

// add request from superdeno to requestEvent.
const handle = (request: Request) => app.handleEvent({ request });

Deno.test("it should GET/ response Hello", async () => {
  await superdeno(handle)
    .get("/")
    .expect(200)
    .expect("Hello");
});
Deno.test("it should GET/json response { name: 'john' }", async () => {
  await superdeno(handle)
    .get("/json")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect({ name: "john" });
});
Deno.test("it should GET/users?name[firstName]=John&name[lastName]=Doe. with query", async () => {
  await superdeno(handle)
    .get("/users?name[firstName]=John&name[lastName]=Doe")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect({
      name: {
        firstName: "John",
        lastName: "Doe",
      },
    });
});
Deno.test("it should GET/users/:usersId/books/:bookId with params", async () => {
  await superdeno(handle)
    .get("/users/123/books/456")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect({ usersId: "123", bookId: "456" });
});
Deno.test("it should GET/image/:name.(jpg|png) with support params extension", async () => {
  await superdeno(handle)
    .get("/image/myfile.jpg")
    .expect(200)
    .expect("Content-Type", /^application/)
    .expect({ name: "myfile" });
});
Deno.test("it should GET/image/:name.(jpg|png) not match extension", async () => {
  await superdeno(handle)
    .get("/image/myfile.gif")
    .expect(404);
});
Deno.test("it should route support RegExp", async () => {
  await superdeno(handle)
    .get("/hello-world")
    .expect(200);
});
