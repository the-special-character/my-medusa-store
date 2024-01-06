import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import MailerService from "src/services/mailer";
import { EntityManager } from "typeorm";
import { z } from "zod";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const schema = z.object({
    pass_key: z.string().min(1),
    template_id: z.string().min(1),
    from: z.string().min(1),
    to: z.string().min(1),
    data: z.object({}).passthrough(),
  });

  const result = schema.safeParse(req.body);

  console.log(result);
  

  if (!result.success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "error");
  }

  const mailerService: MailerService = req.scope.resolve("mailerService");

  const manager: EntityManager = req.scope.resolve("manager");

  const mailer = await manager.transaction(async (transactionManager) => {
    return await mailerService.sendEmail(
      result.data.template_id,
      result.data.from,
      result.data.to,
      result.data.data,
      true
    );
  });

  res.status(200).json({ mailer });
}
