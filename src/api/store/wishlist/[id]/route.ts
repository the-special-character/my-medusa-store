import { CustomerService, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import WishlistService from "src/services/wishlist";
import { EntityManager } from "typeorm";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const wishlistService: WishlistService = req.scope.resolve("wishlistService");

  const manager: EntityManager = req.scope.resolve("manager");

  const wishlist = await manager.transaction(async (transactionManager) => {
    return await wishlistService
      .withTransaction(transactionManager)
      .retrieve(req.params.id, {
        relations: ["items", "items.product"],
      });
  });

  res.status(200).json({ wishlist });
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const wishlistService: WishlistService = req.scope.resolve("wishlistService");
  const customerService: CustomerService = req.scope.resolve("customerService");

  const manager: EntityManager = req.scope.resolve("manager");

  const wishlist = await manager.transaction(async (transactionManager) => {
    const payload = { region_id: req.body.region_id, customer_id: null };

    if (req.body.customer_id) {
      const customer = await customerService.retrieve(req.body.customer_id);
      payload.customer_id = customer.id;
    }

    return await wishlistService
      .withTransaction(transactionManager)
      .update(req.params.id, payload);
  });

  res.status(200).json({ wishlist });
}
