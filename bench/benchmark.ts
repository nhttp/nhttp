import { Handler, nhttp } from "../mod.ts";

const base = "http://127.0.0.1:8000";

const app = nhttp();

app.get("/", () => "home");
app.get("/about", () => "about");
app.get("/contact", () => "contact");
app.get("/product", () => "product");
app.get("/blog/:title", () => "blog");

const midd: Handler = (_, next) => {
  return next();
};
const midds = <Handler[]> [];
for (let i = 0; i < 100; i++) {
  midds.push(midd);
}

// perform with 100 middleware
app.get("/midd-100", midds, () => "midd");

// perform with 1000 route. and call /route/1000
for (let i = 0; i < 1000; i++) {
  app.get("/route/" + (i + 1), () => "route");
}

Deno.bench("/home", () => {
  app.handle(new Request(base));
});
Deno.bench("/about", () => {
  app.handle(new Request(base + "/about"));
});
Deno.bench("/contact", () => {
  app.handle(new Request(base + "/contact"));
});
Deno.bench("/product", () => {
  app.handle(new Request(base + "/product"));
});
Deno.bench("/blog/my-title", () => {
  app.handle(new Request(base + "/blog/my-title"));
});
Deno.bench("/midd-100", () => {
  app.handle(new Request(base + "/midd-100"));
});
Deno.bench("/route/1000", () => {
  app.handle(new Request(base + "/route/1000"));
});
