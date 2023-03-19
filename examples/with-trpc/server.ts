import adapter from "./../../lib/trpc.ts";
import nhttp from "./../../mod.ts";
import { appRouter } from "./router.ts";

const app = nhttp();

app.use("/trpc", adapter({ router: appRouter }));

app.listen(8000);
