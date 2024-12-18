import prisma from "@/db/prisma";
export const getConfig = async () => {
  return prisma.config.findFirst({
    where: {
      shippingId: "1",
    },
  });
};

export const updateConfig = async (
  longitude,
  latitude,
  phone,
) => {
  return prisma.config.update({
    where: {
      shippingId: "1",
    },
    data: {
      longitude,
      latitude,
      phone,
    },
  });
};
