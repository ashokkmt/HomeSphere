import { GraphQLObjectType, GraphQLList, GraphQLInt } from "graphql";
import {
  UserType,
  AgentType,
  PropertyType,
  InquiryType,
  FavoriteType,
  AddressType,
  AmenityType,
  PropertyImageType,
} from "./TypeDefs/getTypes.js";

import resolvers from "./resolvers.js";

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    // 🧍 USERS
    getAllUsers: {
      type: new GraphQLList(UserType),
      resolve: () => resolvers.getAllUsers(),
    },
    getUserById: {
      type: UserType,
      args: { id: { type: GraphQLInt } },
      resolve: (_, args) => resolvers.getUserById(_, args),
    },

    // 🧑‍💼 AGENTS
    // getAllAgents: {
    //   type: new GraphQLList(AgentType),
    //   resolve: () => resolvers.getAllAgents(),
    // },
    // getAgentById: {
    //   type: AgentType,
    //   args: { id: { type: GraphQLInt } },
    //   resolve: (_, args) => resolvers.getAgentById(_, args),
    // },

    // 🏠 PROPERTIES
    getAllProperties: {
      type: new GraphQLList(PropertyType),
      resolve: () => resolvers.getAllProperties(),
    },
    getPropertyById: {
      type: PropertyType,
      args: { id: { type: GraphQLInt } },
      resolve: (_, args) => resolvers.getPropertyById(_, args),
    },

    // 🏡 ADDRESSES
    getAllAddresses: {
      type: new GraphQLList(AddressType),
      resolve: () => resolvers.getAllAddresses(),
    },
    getAddressById: {
      type: AddressType,
      args: { id: { type: GraphQLInt } },
      resolve: (_, args) => resolvers.getAddressById(_, args),
    },

    // 🌟 AMENITIES
    getAllAmenities: {
      type: new GraphQLList(AmenityType),
      resolve: () => resolvers.getAllAmenities(),
    },

    // 🖼️ PROPERTY IMAGES
    getAllPropertyImages: {
      type: new GraphQLList(PropertyImageType),
      resolve: () => resolvers.getAllPropertyImages(),
    },

    // 📩 INQUIRIES
    getAllInquiries: {
      type: new GraphQLList(InquiryType),
      resolve: () => resolvers.getAllInquiries(),
    },
    getInquiryById: {
      type: InquiryType,
      args: { id: { type: GraphQLInt } },
      resolve: (_, args) => resolvers.getInquiryById(_, args),
    },

    // ⭐ FAVORITES
    getAllFavorites: {
      type: new GraphQLList(FavoriteType),
      resolve: () => resolvers.getAllFavorites(),
    },

    getUserFavorites: {
      type: new GraphQLList(FavoriteType),
      args: { userId: { type: GraphQLInt } },
      resolve: (_, args) => resolvers.getUserFavorites(_, args),
    },
  },
});

export default RootQuery;
