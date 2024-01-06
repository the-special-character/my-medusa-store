import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import MailerService from "src/services/mailer";
import { EntityManager } from "typeorm";
import { z } from "zod";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const schema = z.object({
    id: z.string().min(1).max(100),
  });
  // @ts-ignore
  const { success, error, data } = schema.safeParse({ id: req.params.id });
  if (!success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
  }

  const mailerService: MailerService = req.scope.resolve("mailerService");

  const manager: EntityManager = req.scope.resolve("manager");

  let template = await mailerService.getTemplate(data.id);
  res.set("Content-Type", "text/html");
  res.send(Buffer.from(template.html));
}
