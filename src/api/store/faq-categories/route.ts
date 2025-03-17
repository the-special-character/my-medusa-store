import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import FaqService from "src/services/faq";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const faqService: FaqService = req.scope.resolve("faqService");

  const faqs = await faqService.listCategory(
    {},
    {
      relations: ["faqs"],
    }
  );

  res.status(200).json({ faqs });
}
