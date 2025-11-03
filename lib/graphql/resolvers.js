// resolvers.js
import { prisma } from "../../lib/prisma.js";

const Query = {
  // ===========================
  // 🧍 USERS
  // ===========================
  getAllUsers: async () => {
    return await prisma.user.findMany({
      include: { agent: true, favorites: true, inquiries: true },
    });
  },

  getUserById: async (_, { id }) => {
    return await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { agent: true, favorites: true, inquiries: true },
    });
  },

  // ===========================
  // 🏢 AGENTS
  // ===========================
  getAllAgents: async () => {
    return await prisma.agent.findMany({
      include: { user: true, properties: true },
    });
  },

  getAgentById: async (_, { id }) => {
    return await prisma.agent.findUnique({
      where: { id: Number(id) },
      include: { user: true, properties: true },
    });
  },

  // ===========================
  // 🏠 PROPERTIES
  // ===========================
  getAllProperties: async () => {
    return await prisma.property.findMany({
      include: {
        agent: { include: { user: true } },
        address: true,
        images: true,
        amenities: { include: { amenity: true } },
      },
    });
  },

  getPropertyById: async (_, { id }) => {
    return await prisma.property.findUnique({
      where: { id: Number(id) },
      include: {
        agent: { include: { user: true } },
        address: true,
        images: true,
        amenities: { include: { amenity: true } },
      },
    });
  },

  // ===========================
  // 📩 INQUIRIES
  // ===========================
  getAllInquiries: async () => {
    return await prisma.inquiry.findMany({
      include: { property: true, buyer: true },
    });
  },

  getInquiryById: async (_, { id }) => {
    return await prisma.inquiry.findUnique({
      where: { id: Number(id) },
      include: {
        property: true,
        buyer: true,
      },
    });
  },
  
  getUserInquiry: async (_, { userId }) => {
    return await prisma.inquiry.findMany({
      where: { id: Number(userId) },
      include: {
        property: true,
        buyer: true,
      },
    });
  },

  // ===========================
  // ⭐ FAVORITES
  // ===========================
  getAllFavorites: async () => {
    return await prisma.favorite.findMany({
      include: { user: true, property: true },
    });
  },

  getUserFavorites: async (_, { userId }) => {
    return await prisma.favorite.findMany({
      where: { userId: Number(userId) },
      include: { property: true },
    });
  },

  // ===========================
  // 🏡 ADDRESSES
  // ===========================
  getAllAddresses: async () => {
    return await prisma.address.findMany({
      include: { property: true },
    });
  },

  getAddressById: async (_, { id }) => {
    return await prisma.address.findUnique({
      where: { id: Number(id) },
      include: { property: true },
    });
  },

  // ===========================
  // 🌟 AMENITIES
  // ===========================
  getAllAmenities: async () => {
    return await prisma.amenity.findMany({
      include: { properties: { include: { property: true } } },
    });
  },

  // ===========================
  // 🖼️ PROPERTY IMAGES
  // ===========================
  getAllPropertyImages: async () => {
    return await prisma.propertyImage.findMany({
      include: { property: true },
    });
  },
};

export default Query;
