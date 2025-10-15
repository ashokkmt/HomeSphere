import { GraphQLObjectType, GraphQLList } from "graphql";
import { UserType, PostType } from "./TypeDefs/index.js";
import Resolvers from "./resolvers.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    getAllUsers: {
      type: new GraphQLList(UserType),
      resolve: () => Resolvers.getAllUsers(),
    },
    getAllPostsDetails: {
      type: new GraphQLList(PostType),
      resolve: () => Resolvers.getAllPostsDetails(),
    },
  },
});

export default RootQuery;