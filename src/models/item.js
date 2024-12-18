import prisma from "@/db/prisma";

export const getAllProducts = async () => {
  return prisma.product.findMany({
    orderBy: [
      {
        price: "asc",
      },
      {
        isAvailable: "desc",
      },
    ],
    where: {
      isDeleted: false,
    },
  });
};
export const getAllProductsByType = async (type) => {
  return prisma.product.findMany({
    orderBy: [
      {
        price: "asc",
      },
      {
        isAvailable: "desc",
      },
    ],
    where: {
      isDeleted: false,
      type: type,
    },
  });
};

export const getAllProductsPopular = async () => {
  return prisma.product.findMany({
    orderBy: {
      carts: {
        _count: "desc",
      },
    },
    take: 3,
    where: {
      AND: [
        {
          isDeleted: false,
        },
        {
          isAvailable: true,
        },
      ],
    },
  });
};

export const getProductById = async (productId) => {
  return prisma.product.findFirst({
    where: {
      AND: [
        {
          productId,
        },
      ],
    },
  });
};

export const createProduct = async (name, description, image, price, type) => {
  return prisma.product.create({
    data: {
      name,
      description,
      image,
      price,
      type,
    },
  });
};

export const editProduct = async (productId, name, description, price) => {
  return prisma.product.update({
    data: {
      name,
      description,
      price,
    },
    where: {
      productId,
      isDeleted: false,
    },
  });
};

export const editImageProduct = async (productId, image) => {
  return prisma.product.update({
    where: {
      productId,
      isDeleted: false,
    },
    data: {
      image,
    },
  });
};

export const deleteProduct = async (productId) => {
  return prisma.product.update({
    where: {
      productId,
    },
    data: {
      isDeleted: true,
    },
  });
};

export const setActive = async (productId, isAvailable) => {
  return prisma.product.update({
    where: {
      productId,
    },
    data: {
      isAvailable,
    },
  });
};
