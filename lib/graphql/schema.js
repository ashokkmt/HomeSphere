import { GraphQLSchema } from "graphql";
import RootQuery from "./rootQuery.js";
// import Mutation from "./rootMutation.js";
import RootMutation from "./rootMutation.js";

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation,
});

export default schema;
