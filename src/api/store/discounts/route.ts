import {
  DiscountService,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/medusa";
import { EntityManager } from "typeorm";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const discountService: DiscountService = req.scope.resolve("discountService");
  const manager: EntityManager = req.scope.resolve("manager");

  const discounts = await manager.transaction(async (transactionManager) => {
    return await discountService.withTransaction(transactionManager).list();
  });

  res.status(200).json({ discounts });
}
