import nhttp, { Handler, HttpError } from "../mod.ts";

// username: admin
// password: admin

const app = nhttp();

const checkUser = (auth: string | null) => {
  if (auth === null) return void 0;
  const [username, password] = atob(auth.split(" ")[1]).toString().split(":");
  if (username == "admin" && password == "admin") {
    return { username, password };
  }
  return void 0;
};

const authenticate: Handler = (rev, next) => {
  const cookie = rev.cookies;
  if (!cookie.session) {
    const auth = rev.headers.get("authorization") || null;
    if (checkUser(auth)) {
      const user = checkUser(auth);
      rev.locals = { user };
      rev.response.cookie("session", user, { encode: true });
      return next();
    }
    rev.response.header("WWW-Authenticate", "Basic");
    throw new HttpError(401, "Unauthorized Error");
  }
  rev.locals = { user: cookie.session };
  return next();
};

app.get("/home", authenticate, ({ response, locals }) => {
  // deno-fmt-ignore
  response.type('html').send(`
    <h1>Hello, ${locals.user}</h1>
    <br/>
    <a href="/logout">Logout</a>
  `);
});

app.get("/logout", ({ response }) => {
  response.clearCookie("session");
  response.status(401).send("Logged out");
});

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
