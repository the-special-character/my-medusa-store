import PhonePeBase from "../phonepe-base";
import { PaymentIntentOptions, PhonePeOptions } from "../../types/phonepe";

export class PhonePeTest extends PhonePeBase {
  constructor(_) {
    super(_);
  }

  get paymentIntentOptions(): PaymentIntentOptions {
    return {};
  }
}
