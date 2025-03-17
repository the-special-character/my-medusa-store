import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import FaqService from "../../../../services/faq";
import { EntityManager } from "typeorm";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const faqService: FaqService = req.scope.resolve("faqService");
  const id = req.params.id;

  const faq = await faqService.retrieve(id, {
    relations: ["faqCategory"],
  });

  res.status(200).json({ faq });
}

export async function PUT(req: MedusaRequest, res: MedusaResponse) {
  const faqService: FaqService = req.scope.resolve("faqService");
  const manager: EntityManager = req.scope.resolve("manager");

  const id = req.params.id;

  const faq = await manager.transaction(async (transactionManager) => {
    return await faqService
      .withTransaction(transactionManager)
      .update(id, req.body);
  });

  res.status(200).json({ faq });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const faqService: FaqService = req.scope.resolve("faqService");
  const manager: EntityManager = req.scope.resolve("manager");

  const id = req.params.id;

  const faqs = await manager.transaction(async (transactionManager) => {
    return await faqService.withTransaction(transactionManager).delete(id);
  });

  res.status(200).json({ faqs });
}
