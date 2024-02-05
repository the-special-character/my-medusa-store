import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import Razorpay from "razorpay";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const webhookSignature = req.headers["x-razorpay-signature"] as string;

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const validationResponse = Razorpay.validateWebhookSignature(
    req.body,
    webhookSignature,
    webhookSecret!
  );

  // return if validation fails
  if (!validationResponse) {
    return;
  }

  const event = req.body.event;

  const cartId = req.body.payload.payment.entity.notes.cart_id;

  // const razorpayProviderService = req.scope.resolve('pp_razorpay');
  const orderService = req.scope.resolve("orderService");

  const order = await orderService
    .retrieveByCartId(cartId)
    .catch(() => undefined);

  switch (event) {
    // payment authorization is handled in checkout flow. webhook not needed
    // case 'payment.authorized':
    //   break

    case "payment.failed":
      // TODO: notify customer of failed payment
      if (order) {
        await orderService.update(order._id, {
          status: "requires_action",
        });
      }
      break;

    // Order is not yet created in Medusa when webhook fires the first time.
    // Therefore we send 404 response to trigger Razorpay retry
    case "payment.captured":
      if (order && order.payment_status !== "captured") {
        await orderService.capturePayment(order.id);
      } else {
        res.sendStatus(404);
        return;
      }
      break;

    default:
      res.sendStatus(204);
      return;
  }

  res.sendStatus(200);
}
