import adapter from "./../../lib/trpc.ts";
import nhttp from "./../../mod.ts";
import { appRouter } from "./router.ts";

const app = nhttp({ bodyParser: false });

app.any("/trpc/*", adapter({ router: appRouter }));

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
