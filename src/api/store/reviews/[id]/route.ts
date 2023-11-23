import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import ProductReviewService from "src/services/product-review";
import { EntityManager } from "typeorm";

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const productReviewService: ProductReviewService = req.scope.resolve(
    "productReviewService"
  );

  const manager: EntityManager = req.scope.resolve("manager");

  const productReview = await manager.transaction(
    async (transactionManager) => {
      return await productReviewService
        .withTransaction(transactionManager)
        .remove(req.params.id);
    }
  );

  res.status(200).json({ productReview });

}
