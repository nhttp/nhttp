import yogaHandler from "../lib/yoga.ts";
import nhttp from "../mod.ts";
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

const app = nhttp();

app.any("/graphql", yogaHandler(yoga));

app.listen(8000, (_err, info) => {
  console.log(`Running on port ${info.port}`);
});
