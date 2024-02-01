import RazorpayBase from "../core/razorpay-base"
import { PaymentIntentOptions, PaymentProviderKeys } from "../types/razorpay"

class RazorpayProviderService extends RazorpayBase {
  static identifier = PaymentProviderKeys.RAZORPAY

  constructor(_) {
    super(_)
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {}
  }
}

export default RazorpayProviderService