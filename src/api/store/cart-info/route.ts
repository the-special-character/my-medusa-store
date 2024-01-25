import { CartService, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const cartService: CartService = req.scope.resolve("cartService");

  const manager: EntityManager = req.scope.resolve("manager");

  const cartList = await manager.transaction(async (transactionManager) => {
    return await cartService.list({}, {});
  });

  res.status(200).json({ cartList });
}


