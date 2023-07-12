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

const yogaHandler: Handler = async (rev) => {
  const resp = await yoga(rev.newRequest);
  return resp;
  // for nodejs
  // return new Response(resp.body, resp);
};

const app = nhttp();

app.any("/graphql", yogaHandler);

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
