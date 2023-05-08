import nhttp from "../mod.ts";

nhttp().any("/", () => "Hello World").listen(8000);
