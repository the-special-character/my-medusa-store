import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import MailerService from "../../../../services/mailer";
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
  const mailerService: MailerService = req.scope.resolve("mailerService");

  let response = await mailerService.listTemplates();

  res.status(200).json(response);
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const schema = z.object({
    templateId: z.string().min(1),
    subject: z.string(),
    html: z.string(),
    text: z.string(),
  });

  const result = schema.safeParse(req.body);

  console.log(result);
  

  if (!result.success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "error");
  }

  const mailerService: MailerService = req.scope.resolve("mailerService");

  let template = await mailerService.createTemplate({
    templateId: result.data.templateId,
    subject: result.data.subject,
    html: result.data.html,
    text: result.data.text,
  });

  return res.status(200).json({ template });
}
