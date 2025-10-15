import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import { UserType, PostType } from "./TypeDefs/index.js";
import Resolvers from "./resolvers.js"; 

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return Resolvers.addUser(args);  // link to resolver function
      },
    },
    addPost: {
      type: PostType,
      args: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        authorId: { type: GraphQLString },
      },
      resolve(parent, args) {
        return Resolvers.addPost(args);  // link to resolver function
      },
    },
  },
});

export default Mutation;
