import { Handler, NHttp, UnauthorizedError, wrapMiddleware } from "../mod.ts";
import cookie from "https://esm.sh/cookie?no-check";
import cookieParser from "https://esm.sh/cookie-parser?no-check";
import jwt from "https://esm.sh/jsonwebtoken?no-check";

// username: admin
// password: admin

const app = new NHttp();

app.use(wrapMiddleware(
  cookieParser("mysecret"),
  {
    beforeWrap: (rev) => {
      // need convert headers to object json
      rev.headers = Object.fromEntries(rev.request.headers.entries());
    },
  },
));

const checkUser = (auth: string) => {
  const [username, password] = atob(auth.split(" ")[1]).toString().split(":");
  if (username == "admin" && password == "admin") {
    return { username, password };
  }
  return void 0;
};

const authenticate: Handler = async (rev, next) => {
  if (!rev.cookies.session) {
    const auth = rev.headers["authorization"];
    if (!auth) {
      rev.response.header("WWW-Authenticate", "Basic");
      return next(new UnauthorizedError("Unauthorized Error"));
    }
    if (checkUser(auth)) {
      const user = checkUser(auth);
      const obj = {
        iss: "myiss",
        sub: "user",
        data: {
          user: user?.username,
        },
      };
      const token = jwt.sign(obj, rev.secret, { expiresIn: "1d" });
      rev.cookies.session = token;
      rev.locals = obj.data;
      rev.response.header(
        "set-cookie",
        cookie.serialize("session", token, {
          httpOnly: true,
        }),
      );
      return next();
    }
    rev.response.header("WWW-Authenticate", "Basic");
    return next(new UnauthorizedError("Unauthorized Error"));
  } else {
    try {
      const verify = jwt.verify(rev.cookies.session, rev.secret);
      rev.locals = verify.data;
    } catch (err) {
      rev.response.header(
        "set-cookie",
        cookie.serialize("session", rev.cookies.session, {
          maxAge: 0,
        }),
      );
      rev.response.header("WWW-Authenticate", "Basic");
      return next(new UnauthorizedError("Unauthorized Error"));
    }
  }
  next();
};

app.get("/home", authenticate, ({ response, locals }) => {
  response.send("Hello " + locals.user);
});

app.get("/logout", ({ response, cookies }) => {
  response.header(
    "set-cookie",
    cookie.serialize("session", cookies.session, {
      maxAge: 0,
    }),
  );
  response.status(401).send("Logged out");
});

app.listen(3000);
