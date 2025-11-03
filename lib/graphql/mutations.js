// mutations.js
import { prisma } from "../../lib/prisma.js";

const Mutation = {
  // ===========================
  // 🧍 USERS
  // ===========================
  createUser: async (_, { input }) => {
    return await prisma.user.create({ data: input });
  },

  updateUser: async (_, { id, input }) => {
    return await prisma.user.update({
      where: { id: Number(id) },
      data: input,
    });
  },

  deleteUser: async (_, { id }) => {
    await prisma.user.delete({ where: { id: Number(id) } });
    return { message: "User deleted successfully" };
  },

  // ===========================
  // 🏢 AGENTS
  // ===========================
  createAgent: async (_, { input }) => {
    return await prisma.agent.create({ data: input });
  },

  updateAgent: async (_, { id, input }) => {
    return await prisma.agent.update({
      where: { id: Number(id) },
      data: input,
    });
  },

  deleteAgent: async (_, { id }) => {
    await prisma.agent.delete({ where: { id: Number(id) } });
    return { message: "Agent deleted successfully" };
  },

  // ===========================
  // 🏠 PROPERTIES
  // ===========================
  createProperty: async (_, { input }) => {
    return await prisma.property.create({
      data: {
        title: input.title,
        description: input.description,
        price: input.price,
        propertyType: input.propertyType,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        areaSqft: input.areaSqft,
        listingStatus: input.listingStatus,
        agent: { connect: { id: input.agentId } },

        // optional nested creates
        address: input.address ? { create: input.address } : undefined,

        amenities: input.amenityIds
          ? {
              create: input.amenityIds.map((amenityId) => ({
                amenity: { connect: { id: amenityId } },
              })),
            }
          : undefined,

        images: input.images
          ? {
              create: input.images.map((img) => ({
                url: img.url,
                altText: img.altText,
                sortOrder: img.sortOrder || 0,
              })),
            }
          : undefined,
      },
      include: {
        address: true,
        amenities: { include: { amenity: true } },
        images: true,
      },
    });
  },

  updateProperty: async (_, { id, input }) => {
    return await prisma.property.update({
      where: { id: Number(id) },
      data: input,
    });
  },

  deleteProperty: async (_, { id }) => {
    await prisma.property.delete({ where: { id: Number(id) } });
    return { message: "Property deleted successfully" };
  },

  // ===========================
  // 📩 INQUIRIES
  // ===========================
  createInquiry: async (_, { input }) => {
    return await prisma.inquiry.create({ data: input });
  },

  updateInquiryStatus: async (_, { id, status }) => {
    return await prisma.inquiry.update({
      where: { id: Number(id) },
      data: { status },
    });
  },

  // ===========================
  // ⭐ FAVORITES
  // ===========================
  addFavorite: async (_, { userId, propertyId }) => {
    return await prisma.favorite.create({
      data: { userId, propertyId },
    });
  },

  removeFavorite: async (_, { userId, propertyId }) => {
    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });
    return { message: "Removed from favorites" };
  },
};

export default Mutation;
