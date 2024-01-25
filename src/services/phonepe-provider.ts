import { PaymentIntentOptions, PaymentProviderKeys } from "../types/phonepe";
import PhonePeBase from "../core/phonepe-base";

class PhonePeProviderService extends PhonePeBase {
  static identifier = PaymentProviderKeys.PHONEPE;

  constructor(_) {
    super(_);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {};
  }
}

export default PhonePeProviderService;
