import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import MailerService from "src/services/mailer";
import { z } from "zod";
import cors from "cors";

export const config = {};

const adminCorsOptions = {
  methods: ["POST", "GET", "HEAD"],
  credentials: true,
};

function runMiddleware(req: MedusaRequest, res: MedusaResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

export default async function handler(req: MedusaRequest, res: MedusaResponse) {
  await runMiddleware(req, res, cors(adminCorsOptions));
  res.status(200).json({ message: 'Hello from Next.js!' })
}

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

  let template = await mailerService.getTemplate(data.id);

  res.status(200).json({ template });
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const schema = z.object({
    id: z.string().min(1).max(100),
  });
  // @ts-ignore
  const { success, error, data } = schema.safeParse({ id: req.params.id });

  if (!success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
  }
  const mailerService: MailerService = req.scope.resolve("mailerService");

  let result = await mailerService.deleteTemplate(data.id);

  res.status(200).json({ result });
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const schema = z.object({
    templateId: z.string().min(1),
    subject: z.string(),
    html: z.string(),
    text: z.string(),
  });
  // @ts-ignore
  const { success, error, data } = schema.safeParse({
    ...req.body,
    templateId: req.params.id,
  });
  if (!success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error);
  }
  const mailerService: MailerService = req.scope.resolve("mailerService");

  let template = await mailerService.createTemplate({
    templateId: req.params.id,
    subject: data.subject,
    html: data.html,
    text: data.text,
  });

  res.status(200).json({ template });
}
