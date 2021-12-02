import { Handler, HttpError, NHttp } from "../mod.ts";

// username: admin
// password: admin

const app = new NHttp();

const checkUser = (auth: string | null) => {
  if (auth === null) return void 0;
  const [username, password] = atob(auth.split(" ")[1]).toString().split(":");
  if (username == "admin" && password == "admin") {
    return { username, password };
  }
  return void 0;
};

const authenticate: Handler = (rev, next) => {
  const cookie = rev.getCookies(true);
  if (!cookie.session) {
    const auth = rev.request.headers.get("authorization") || null;
    if (checkUser(auth)) {
      const user = checkUser(auth);
      rev.locals = { user: user?.username };
      rev.response.cookie("session", user?.username, { encode: true });
      return next();
    }
    rev.response.header("WWW-Authenticate", "Basic");
    return next(new HttpError(401, "Unauthorized Error"));
  } else {
    rev.locals = { user: cookie.session };
  }
  return next();
};

app.get("/home", authenticate, ({ response, locals }) => {
  // deno-fmt-ignore
  return response.type('text/html').send(`
        <h1>Hello, ${locals.user}</h1>
        <br/>
        <a href="/logout">Logout</a>
  `);
});

app.get("/logout", ({ response }) => {
  response.clearCookie("session");
  return response.status(401).send("Logged out");
});

app.listen(3000);
