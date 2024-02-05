import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CartService from "src/services/cart";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
    
    const cartService: CartService =
    req.scope.resolve("cartService");

  const data = await cartService.getPendingCartItems();

  res.status(200).json({ data });
}
