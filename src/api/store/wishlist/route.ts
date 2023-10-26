import { CustomerService, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import WishlistService from "src/services/wishlist";
import { EntityManager } from "typeorm";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const wishlistService: WishlistService = req.scope.resolve("wishlistService");
  const customerService: CustomerService = req.scope.resolve("customerService");

  const manager: EntityManager = req.scope.resolve("manager");

  const wishlist = await manager.transaction(async (transactionManager) => {
    const payload = { region_id: req.body.region_id, customer_id: null };

    if (req.user && req.user.customer_id) {
      const customer = await customerService.retrieve(req.user.customer_id);
      payload.customer_id = customer.id;
    }

    return await wishlistService
      .withTransaction(transactionManager)
      .create(payload);
  });

  res.status(200).json({ wishlist });
}


