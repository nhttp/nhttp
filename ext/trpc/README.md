## Lib tRPC

> this libs for [@nhttp/nhttp](https://jsr.io/@nhttp/nhttp)

## Usage

```ts
import nhttp, { RequestEvent } from "@nhttp/nhttp";
import adapter from "@nhttp/trpc";
import { initTRPC } from "npm:@trpc/server";

// tRPC router
const t = initTRPC.context<RequestEvent>().create();
const proc = t.procedure;
const router = t.router;

interface User {
  id: number;
  name: string;
}

const userList: User[] = [
  {
    id: 1,
    name: "John",
  },
];

const appRouter = router({
  userById: proc
    .input((val: unknown) => {
      if (typeof val === "number") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query(({ input }) => {
      const user = userList.find((it) => it.id === input);
      return user;
    }),
});

// share type to client
export type AppRouter = typeof appRouter;

const app = nhttp();

// add adapter to middleware
app.use("/trpc", adapter({ router: appRouter }));

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
```
