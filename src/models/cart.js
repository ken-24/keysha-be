import prisma from "@/db/prisma";

export const checkCart = async (userId, productId, quantity) => {
  return prisma.cart.findFirst({
    where: {
      userId,
      productId,
    },
  });
};

export const addProductToCart = async (userId, productId, quantity) => {
  return prisma.cart.create({
    data: {
      userId,
      productId,
      quantity,
    },
  });
};
export const updateQuantity = async (cartId, newQuantity) => {
  return prisma.cart.update({
    where: {
      cartId: cartId,
    },
    data: {
      quantity: newQuantity,
    },
  });
};
export const deleteCart = async (cartId) => {
  return prisma.cart.delete({
    where: {
      cartId: cartId,
    }
  });
};

export const getCartById = async (userId) => {
  return prisma.cart.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      product: true,
    },
  });
};
export const deleteCartProduct = async (cartId) => {
  return prisma.cart.delete({
    where: {
      cartId,
    },
  });
};
