import { initTRPC } from "npm:@trpc/server";
import { HttpError, RequestEvent } from "../../mod.ts";
import { z } from "npm:zod";

interface Context extends RequestEvent {
  user: { username: string };
}

const t = initTRPC.context<Context>().create();
const proc = t.procedure;
const router = t.router;
interface User {
  id: number;
  name: string;
}

const userList: User[] = [
  {
    id: 1,
    name: "KATT",
  },
];

export const appRouter = router({
  user: router({
    findAll: proc.query(() => userList),
    findById: proc
      .input((val: unknown) => {
        if (typeof val === "number") return val;
        throw new Error(`Invalid input: ${typeof val}`);
      })
      .query(({ input }) => {
        const user = userList.find((it) => it.id === input);
        return user;
      }),
    create: proc
      .input(z.object({
        name: z.string(),
      }))
      .mutation(({ input }) => {
        userList.push({
          id: Math.max(...userList.map((el) => el.id)) + 1,
          name: input.name,
        });
        return input;
      }),
  }),
  admin: router({
    me: proc
      .output(z.object({
        username: z.string(),
      }))
      .use(({ ctx, next }) => {
        if (ctx.headers.get("x-token") === "xxx") {
          ctx.user = { username: "john" };
          return next();
        }
        throw new HttpError(401);
      })
      .query(({ ctx }) => ctx.user),
  }),
});

export type AppRouter = typeof appRouter;
