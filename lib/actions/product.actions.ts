"use server";
import { prisma } from "@/db/prisma";
import { LATEST_PRODUCTS_LIMIT } from "../constant";
import { convertToPlainObject } from "../utils";

export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: "desc",
    },
  });

  return convertToPlainObject(data);
};

export const getProductsBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: {
      slug,
    },
  });

  return convertToPlainObject(product);
};
