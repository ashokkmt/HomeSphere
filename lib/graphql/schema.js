import { GraphQLSchema } from "graphql";
import RootQuery from "./rootQuery.js";
import Mutation from "./mutations.js";

const schema = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

export default schema;
