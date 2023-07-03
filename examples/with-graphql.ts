import nhttp, { Handler } from "../mod.ts";
import { createSchema, createYoga } from "npm:graphql-yoga@4.0.3";

const yoga = createYoga({
  schema: createSchema({
    typeDefs: `
      type Query {
        hello: String!
      }
    `,
    resolvers: {
      Query: {
        hello: () => "Hello World!",
      },
    },
  }),
});

const yogaHandler: Handler = async ({ request, method, headers, body }) => {
  const resp = await yoga.fetch(request.url, {
    method,
    headers,
    body: ["POST", "PUT", "PATCH"].includes(method)
      ? JSON.stringify(body)
      : void 0,
  });
  return resp;
  // for nodejs
  // return new Response(resp.body, resp);
};

const app = nhttp();

app.any("/graphql", yogaHandler);

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
