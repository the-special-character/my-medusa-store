import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import FaqService from "../../../services/faq";
import { EntityManager } from "typeorm";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const faqService: FaqService = req.scope.resolve("faqService");

  const faqs = await faqService.list(
    {},
    {
      relations: ["faqCategories"],
    }
  );

  res.status(200).json({ faqs });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const faqService: FaqService = req.scope.resolve("faqService");
  const manager: EntityManager = req.scope.resolve("manager");

  const faq = await manager.transaction(async (transactionManager) => {
    return await faqService
      .withTransaction(transactionManager)
      .create(req.body);
  });

  res.status(200).json({ faq });
}
