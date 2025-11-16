// resolvers.js
import { prisma } from "../../lib/prisma.js";

const Query = {
  // ===========================
  // 🧍 USERS
  // ===========================
  getAllUsers: async () => {
    return await prisma.user.findMany({
      include: { properties: true, favorites: true, inquiries: true },
    });
  },

  getUserById: async (_, { id }) => {
    return await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { properties: true, favorites: true, inquiries: true },
    });
  },

  // ===========================
  // 🏢 AGENTS
  // ===========================
  // getAllAgents: async () => {
  //   return await prisma.agent.findMany({
  //     include: { user: true, properties: true },
  //   });
  // },

  // getAgentById: async (_, { id }) => {
  //   return await prisma.agent.findUnique({
  //     where: { id: Number(id) },
  //     include: { user: true, properties: true },
  //   });
  // },

  // ===========================
  // 🏠 PROPERTIES
  // ===========================
  getAllProperties: async () => {
    return await prisma.property.findMany({
      include: {
        user: true,
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
        user: true,
        address: true,
        images: true,
        amenities: { include: { amenity: true } },
      },
    });
  },

  // ===========================
  // 📩 INQUIRIES
  // ===========================
  getBuyerInquiries: async (_, { buyerId }) => {
    return prisma.inquiry.findMany({
      where: { buyerId },
      include: {
        buyer: true,
        seller: true,
        property: true,
        messages: { include: { sender: true } },
      },
    });
  },

  // Seller's inbox
  getSellerInquiries: async (_, { sellerId }) => {
    return prisma.inquiry.findMany({
      where: { sellerId },
      include: {
        buyer: true,
        seller: true,
        property: true,
        messages: { include: { sender: true } },
      },
    });
  },

  // Chat history of entire inquiry
  getInquiryMessages: async (_, { inquiryId }) => {
    return prisma.inquiryMessage.findMany({
      where: { inquiryId },
      orderBy: { createdAt: "asc" },
      include: { sender: true },
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
