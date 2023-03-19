import { createTRPCProxyClient, httpBatchLink } from "npm:@trpc/client";
import type { AppRouter } from "./router.ts";

async function main() {
  const trpc = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: "http://localhost:8000/trpc",
        headers: { "x-token": "xxx" },
      }),
    ],
  });
  let users = await trpc.user.findAll.query();
  console.log("All Users", users);

  const user = await trpc.user.findById.query(1);
  console.log("User By 1", user);

  const userCreate = await trpc.user.create.mutate({ name: "JOHN" });
  console.log("Create New User", userCreate);

  users = await trpc.user.findAll.query();
  console.log("All Users Updated", users);

  const admin = await trpc.admin.me.query();
  console.log("admin is", admin.username);
}

main();
