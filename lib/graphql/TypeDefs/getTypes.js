import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLEnumType,
} from "graphql";

// ========================
// 🔹 ENUMS
// ========================
export const RoleEnumType = new GraphQLEnumType({
  name: "Role",
  values: {
    BUYER: { value: "BUYER" },
    AGENT: { value: "AGENT" },
    ADMIN: { value: "ADMIN" },
  },
});

// ========================
// 🔹 USER TYPE
// ========================
export const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLInt },
    email: { type: GraphQLString },
    fullName: { type: GraphQLString },
    phone: { type: GraphQLString },
    role: { type: RoleEnumType },
    createdAt: { type: GraphQLString },
    agent: { type: AgentType },
    favorites: { type: new GraphQLList(FavoriteType) },
    inquiries: { type: new GraphQLList(InquiryType) },
  }),
});

// ========================
// 🔹 AGENT TYPE
// ========================
export const AgentType = new GraphQLObjectType({
  name: "Agent",
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    agency: { type: GraphQLString },
    licenseNo: { type: GraphQLString },
    user: { type: UserType },
    properties: { type: new GraphQLList(PropertyType) },
  }),
});

// ========================
// 🔹 ADDRESS TYPE
// ========================
export const AddressType = new GraphQLObjectType({
  name: "Address",
  fields: () => ({
    id: { type: GraphQLInt },
    propertyId: { type: GraphQLInt },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    country: { type: GraphQLString },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
  }),
});

// ========================
// 🔹 PROPERTY IMAGE TYPE
// ========================
export const PropertyImageType = new GraphQLObjectType({
  name: "PropertyImage",
  fields: () => ({
    id: { type: GraphQLInt },
    propertyId: { type: GraphQLInt },
    url: { type: GraphQLString },
    altText: { type: GraphQLString },
    sortOrder: { type: GraphQLInt },
  }),
});

// ========================
// 🔹 AMENITY TYPE
// ========================
export const AmenityType = new GraphQLObjectType({
  name: "Amenity",
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
  }),
});

export const PropertyAmenityType = new GraphQLObjectType({
  name: "PropertyAmenity",
  fields: () => ({
    propertyId: { type: GraphQLInt },
    amenityId: { type: GraphQLInt },
    property: { type: PropertyType },
    amenity: { type: AmenityType },
  }),
});

// ========================
// 🔹 PROPERTY TYPE
// ========================
export const PropertyType = new GraphQLObjectType({
  name: "Property",
  fields: () => ({
    id: { type: GraphQLInt },
    agentId: { type: GraphQLInt },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    propertyType: { type: GraphQLString },
    bedrooms: { type: GraphQLInt },
    bathrooms: { type: GraphQLInt },
    areaSqft: { type: GraphQLInt },
    listingStatus: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    address: { type: AddressType },
    images: { type: new GraphQLList(PropertyImageType) },
    amenities: { type: new GraphQLList(PropertyAmenityType) },
    favorites: { type: new GraphQLList(FavoriteType) },
    inquiries: { type: new GraphQLList(InquiryType) },
  }),
});

// ========================
// 🔹 FAVORITE TYPE
// ========================
export const FavoriteType = new GraphQLObjectType({
  name: "Favorite",
  fields: () => ({
    userId: { type: GraphQLInt },
    propertyId: { type: GraphQLInt },
    savedAt: { type: GraphQLString },
    user: { type: UserType },
    property: { type: PropertyType },
  }),
});

// ========================
// 🔹 INQUIRY TYPE
// ========================
export const InquiryType = new GraphQLObjectType({
  name: "Inquiry",
  fields: () => ({
    id: { type: GraphQLInt },
    propertyId: { type: GraphQLInt },
    buyerId: { type: GraphQLInt },
    message: { type: GraphQLString },
    contactPhone: { type: GraphQLString },
    status: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    property: { type: PropertyType },
    buyer: { type: UserType },
  }),
});
