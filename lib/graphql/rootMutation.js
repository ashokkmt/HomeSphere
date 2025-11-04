import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
} from "graphql";

import {
  UserType,
  AgentType,
  PropertyType,
  InquiryType,
  FavoriteType,
} from "./TypeDefs/getTypes.js";

import mutations from "./mutations.js";

import {
  CreateUserInput,
  UpdateUserInput,
  CreateAgentInput,
  UpdateAgentInput,
  CreatePropertyInput,
  UpdatePropertyInput,
  CreateInquiryInput,
  UpdateInquiryInput,
  CreateFavoriteInput,
  DeleteFavoriteInput,
} from "./TypeDefs/InputTypes.js";

const RootMutation = new GraphQLObjectType({
  name: "RootMutationType",
  fields: {
    // 🧍 USERS
    createUser: {
      type: UserType,
      args: { input: { type: new GraphQLNonNull(CreateUserInput) } },
      resolve: (_, args) => mutations.createUser(_, args),
    },
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        input: { type: new GraphQLNonNull(UpdateUserInput) },
      },
      resolve: (_, args) => mutations.updateUser(_, args),
    },

    deleteUser: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (_, args) => mutations.deleteUser(_, args),
    },

    // 🏢 AGENTS
    createAgent: {
      type: AgentType,
      args: { input: { type: new GraphQLNonNull(CreateAgentInput) } },
      resolve: (_, args) => mutations.createAgent(_, args),
    },
    updateAgent: {
      type: AgentType,
      args: { 
        id: { type: new GraphQLNonNull(GraphQLInt) },
        input: { type: new GraphQLNonNull(UpdateAgentInput) } 
      },
      resolve: (_, args) => mutations.updateAgent(_, args),
    },
    deleteAgent: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (_, args) => mutations.deleteAgent(_, args),
    },

    // 🏠 PROPERTIES
    createProperty: {
      type: PropertyType,
      args: { input: { type: new GraphQLNonNull(CreatePropertyInput) } },
      resolve: (_, args) => mutations.createProperty(_, args),
    },
    updateProperty: {
      type: PropertyType,
      args: { input: { type: new GraphQLNonNull(UpdatePropertyInput) } },
      resolve: (_, args) => mutations.updateProperty(_, args),
    },
    deleteProperty: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (_, args) => mutations.deleteProperty(_, args),
    },

    // 📩 INQUIRIES
    createInquiry: {
      type: InquiryType,
      args: { input: { type: new GraphQLNonNull(CreateInquiryInput) } },
      resolve: (_, args) => mutations.createInquiry(_, args),
    },
    updateInquiry: {
      type: InquiryType,
      args: { input: { type: new GraphQLNonNull(UpdateInquiryInput) } },
      resolve: (_, args) => mutations.updateInquiry(_, args),
    },
    deleteInquiry: {
      type: GraphQLString,
      args: { id: { type: new GraphQLNonNull(GraphQLInt) } },
      resolve: (_, args) => mutations.deleteInquiry(_, args),
    },

    // ⭐ FAVORITES
    addFavorite: {
      type: FavoriteType,
      args: { input: { type: new GraphQLNonNull(CreateFavoriteInput) } },
      resolve: (_, args) => mutations.addFavorite(_, args),
    },
    removeFavorite: {
      type: GraphQLString,
      args: { input: { type: new GraphQLNonNull(DeleteFavoriteInput) } },
      resolve: (_, args) => mutations.removeFavorite(_, args),
    },
  },
});

export default RootMutation;
