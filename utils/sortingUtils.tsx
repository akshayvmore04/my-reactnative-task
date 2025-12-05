import { Product } from "../types";
import { calculatePrice } from "./mathUtils";

/**
 * Sorts a list of products by calculated price
 * @param products - the array of Product objects
 * @param order - 'asc' for ascending, 'desc' for descending
 * @returns a new sorted array of products
 */
export const sortProductsByPrice = (
  products: Product[],
  order: "asc" | "desc" = "asc"
): Product[] => {
  const sorted = [...products].sort((a, b) => {
    const priceA = calculatePrice(a.title, a.description);
    const priceB = calculatePrice(b.title, b.description);
    return order === "asc" ? priceA - priceB : priceB - priceA;
  });
  return sorted;
};
