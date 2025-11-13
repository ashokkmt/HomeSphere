import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} from "graphql";

// ✅ Enum for User Roles
export const RoleEnum = new GraphQLEnumType({
  name: "RoleEnum",
  values: {
    BUYER: { value: "BUYER" },
    AGENT: { value: "AGENT" },
    ADMIN: { value: "ADMIN" },
  },
});


// ============================
// USER INPUT TYPES
// ============================
export const CreateUserInput = new GraphQLInputObjectType({
  name: "CreateUserInput",
  fields: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    fullName: { type: GraphQLString },
    phone: { type: GraphQLString },
    role: { type: RoleEnum },
  },
});

export const UpdateUserInput = new GraphQLInputObjectType({
  name: "UpdateUserInput",
  fields: {
    fullName: { type: GraphQLString },
    phone: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: RoleEnum },
  },
});



// ============================
// AGENT INPUT TYPES
// ============================
export const CreateAgentInput = new GraphQLInputObjectType({
  name: "CreateAgentInput",
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    agency: { type: GraphQLString },
    licenseNo: { type: GraphQLString },
  },
});

export const UpdateAgentInput = new GraphQLInputObjectType({
  name: "UpdateAgentInput",
  fields: {
    agency: { type: GraphQLString },
    licenseNo: { type: GraphQLString },
  },
});


// ============================
// ADDRESS INPUT TYPES
// ============================
export const CreateAddressInput = new GraphQLInputObjectType({
  name: "CreateAddressInput",
  fields: {
    // propertyId: { type: new GraphQLNonNull(GraphQLInt) },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    country: { type: GraphQLString },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
  },
});

export const UpdateAddressInput = new GraphQLInputObjectType({
  name: "UpdateAddressInput",
  fields: {
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    state: { type: GraphQLString },
    postalCode: { type: GraphQLString },
    country: { type: GraphQLString },
    latitude: { type: GraphQLFloat },
    longitude: { type: GraphQLFloat },
  },
});


// ============================
// AMENITY INPUT TYPES
// ============================
export const CreateAmenityInput = new GraphQLInputObjectType({
  name: "CreateAmenityInput",
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
  },
});


// ============================
// PROPERTY IMAGE INPUT TYPES
// ============================
export const CreatePropertyImageInput = new GraphQLInputObjectType({
  name: "CreatePropertyImageInput",
  fields: {
    url: { type: new GraphQLNonNull(GraphQLString) },
    altText: { type: GraphQLString },
    sortOrder: { type: GraphQLInt },
  },
});


// ============================
// PROPERTY INPUT TYPES
// ============================
export const CreatePropertyInput = new GraphQLInputObjectType({
  name: "CreatePropertyInput",
  fields: {
    agentId: {type: new GraphQLNonNull(GraphQLInt)},
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    price: { type: new GraphQLNonNull(GraphQLFloat) },
    propertyType: { type: new GraphQLNonNull(GraphQLString) },
    bedrooms: { type: GraphQLInt },
    bathrooms: { type: GraphQLInt },
    areaSqft: { type: GraphQLInt },
    listingStatus: { type: GraphQLString },

    // Nested optional inputs
    address: { type: CreateAddressInput },
    images: { type: new GraphQLList(CreatePropertyImageInput) },
    amenities: { type: new GraphQLList(CreateAmenityInput) },
  },
});

export const UpdatePropertyInput = new GraphQLInputObjectType({
  name: "UpdatePropertyInput",
  fields: {
    agentId: { type: GraphQLInt },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    propertyType: { type: GraphQLString },
    bedrooms: { type: GraphQLInt },
    bathrooms: { type: GraphQLInt },
    areaSqft: { type: GraphQLInt },
    listingStatus: { type: GraphQLString },

    // Nested Optional Inputs
    address: { type: UpdateAddressInput },
    images: { type: new GraphQLList(CreatePropertyImageInput) },
    amenities: { type: new GraphQLList(CreateAmenityInput) },
  },
});


// ============================
// INQUIRY INPUT TYPES
// ============================
export const CreateInquiryInput = new GraphQLInputObjectType({
  name: "CreateInquiryInput",
  fields: {
    propertyId: { type: new GraphQLNonNull(GraphQLInt) },
    buyerId: { type: GraphQLInt },
    message: { type: GraphQLString },
    contactPhone: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});

export const UpdateInquiryInput = new GraphQLInputObjectType({
  name: "UpdateInquiryInput",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLInt) },
    message: { type: GraphQLString },
    contactPhone: { type: GraphQLString },
    status: { type: GraphQLString },
  },
});


// ============================
// FAVORITE INPUT TYPES
// ============================
export const CreateFavoriteInput = new GraphQLInputObjectType({
  name: "CreateFavoriteInput",
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    propertyId: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const DeleteFavoriteInput = new GraphQLInputObjectType({
  name: "DeleteFavoriteInput",
  fields: {
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    propertyId: { type: new GraphQLNonNull(GraphQLInt) },
  },
});