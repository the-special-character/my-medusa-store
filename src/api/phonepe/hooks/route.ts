import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { PhonePeEvent, PhonePeS2SResponse } from "../../../types/phonepe";
import { constructWebhook, handlePaymentHook } from "../../../utils/utils";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  console.log("POST Event");

  let event: PhonePeEvent;

  try {
    event = constructWebhook({
      signature: req.headers["x-verify"] as string,
      encodedBody: req.body,
      container: req.scope,
    });
  } catch (err) {
    console.log(
      `${JSON.stringify(req.body)} ${err.message} header:${JSON.stringify(
        req.headers
      )}`
    );
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  console.log(event);
  

  const paymentIntent = event.data.object as unknown as PhonePeS2SResponse;

  const { statusCode } = await handlePaymentHook({
    event,
    container: req.scope,
    paymentIntent,
  });

  console.log(`payment status code: ${statusCode}`);
  res.sendStatus(statusCode);
}
