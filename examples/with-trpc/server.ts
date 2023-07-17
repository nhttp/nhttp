import trpc from "./../../lib/trpc.ts";
import nhttp from "./../../mod.ts";
import { appRouter } from "./router.ts";

const app = nhttp();

app.use(trpc({ router: appRouter, endpoint: "/trpc" }));

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
