import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import WishlistService from "src/services/wishlist";
import { EntityManager } from "typeorm";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const wishlistService: WishlistService = req.scope.resolve("wishlistService");

  const manager: EntityManager = req.scope.resolve("manager");

  const wishlist = await manager.transaction(async (transactionManager) => {
    return await wishlistService
      .withTransaction(transactionManager)
      .removeWishItem(req.params.itemId)
  });

  res.status(200).json({ wishlist });
}
