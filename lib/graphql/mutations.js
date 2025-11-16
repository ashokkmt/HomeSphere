// mutations.js
import { prisma } from "@/lib/prisma";

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
    return await prisma.agent.create({
      data: input,
      include: {
        user: true,
      },
    },
    );
  },

  updateAgent: async (_, { id, input }) => {
    return await prisma.agent.update({
      where: { id: Number(id) },
      data: input,
      include: {
        user: true,
      }
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

        // User who created the property
        user: { connect: { id: input.userId } },

        // ⭐ ADD THIS — nested address create
        address: input.address
          ? { create: input.address }
          : undefined,

        // Amenities
        amenities: input.amenityIds
          ? {
            create: input.amenityIds.map((amenityId) => ({
              amenity: { connect: { id: amenityId } },
            })),
          }
          : undefined,

        // Images
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
        user: true,
      },
    });
  },



  updateProperty: async (_, { id, input }) => {
    return await prisma.property.update({
      where: { id: Number(id) },
      data: {
        // 🏠 Basic fields
        title: input.title,
        description: input.description,
        price: input.price,
        propertyType: input.propertyType,
        bedrooms: input.bedrooms,
        bathrooms: input.bathrooms,
        areaSqft: input.areaSqft,
        listingStatus: input.listingStatus,

        // 👤 Update user if provided
        // user: input.userId
        //   ? { connect: { id: input.userId } }
        //   : undefined,

        // 📍 Update or create address
        address: input.address
          ? {
            upsert: {
              create: input.address,
              update: input.address,
            },
          }
          : undefined,

        // 🧩 Update amenities (replace all)
        amenities: input.amenityIds
          ? {
            deleteMany: {}, // remove all old amenities
            create: input.amenityIds.map((amenityId) => ({
              amenity: { connect: { id: amenityId } },
            })),
          }
          : undefined,

        // 🖼 Update images (replace all)
        images: input.images
          ? {
            deleteMany: {}, // remove old images
            create: input.images.map((img) => ({
              url: img.url,
              altText: img.altText,
              sortOrder: img.sortOrder || 0,
            })),
          }
          : undefined,
      },

      // Return full nested structure
      include: {
        user: true,
        address: true,
        amenities: { include: { amenity: true } },
        images: true,
      },
    });
  },


  deleteProperty: async (_, { id }) => {
    const propertyId = Number(id);

    await prisma.$transaction([
      prisma.address.deleteMany({ where: { propertyId } }),
      prisma.propertyImage.deleteMany({ where: { propertyId } }),
      prisma.propertyAmenity.deleteMany({ where: { propertyId } }),
      prisma.property.delete({ where: { id: propertyId } }),
    ]);

    return { message: "Property and all related data deleted successfully" };
  },

  // ===========================
  // 📩 INQUIRIES
  // ===========================
  addInquiry: async (_, { input }) => {
    const { buyerId, propertyId, message } = input;

    // Fetch sellerId from property
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { userId: true },
    });

    if (!property) throw new Error("Property not found");

    // Check if inquiry thread already exists
    let inquiry = await prisma.inquiry.findFirst({
      where: { buyerId, propertyId },
    });

    // If no existing thread → create new one
    if (!inquiry) {
      inquiry = await prisma.inquiry.create({
        data: {
          buyerId,
          propertyId,
          sellerId: property.userId,
          status: "OPEN",
        },
      });
    }

    // Add first message
    await prisma.inquiryMessage.create({
      data: {
        inquiryId: inquiry.id,
        senderId: buyerId,
        message,
      },
    });

    // Return full inquiry with messages
    return prisma.inquiry.findUnique({
      where: { id: inquiry.id },
      include: {
        buyer: true,
        seller: true,
        property: true,
        messages: { include: { sender: true } },
      },
    });
  },

  // 2️⃣ Buyer OR Seller sends message inside inquiry
  sendInquiryMessage: async (_, { input }) => {
    return prisma.inquiryMessage.create({
      data: {
        inquiryId: input.inquiryId,
        senderId: input.senderId,
        message: input.message,
      },
      include: { sender: true },
    });
  },

  // 3️⃣ Seller closes inquiry
  closeInquiry: async (_, { input }) => {
    return prisma.inquiry.update({
      where: { id: input.inquiryId },
      data: { status: "CLOSED" },
      include: {
        buyer: true,
        seller: true,
        property: true,
        messages: { include: { sender: true } },
      },
    });
  },

  // ===========================
  // ⭐ FAVORITES
  // ===========================
  addFavorite: async (_, { input }) => {
    const { userId, propertyId } = input;

    return await prisma.favorite.create({
      data: {
        user: { connect: { id: userId } },
        property: { connect: { id: propertyId } },
      },
    });
  },

  removeFavorite: async (_, { input }) => {
    const { userId, propertyId } = input;

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
