import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { ReviewStatus } from "src/models/product-review";
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
export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const productReviewService: ProductReviewService = req.scope.resolve(
    "productReviewService"
  );

  const manager: EntityManager = req.scope.resolve("manager");

  const productReview = await manager.transaction(
    async (transactionManager) => {
      const body = JSON.parse(req.body);
      console.log({ body });

      return await productReviewService
        .withTransaction(transactionManager)
        .update(req.params.id, body.status);
    }
  );
  res.status(200).json({ productReview });
}
