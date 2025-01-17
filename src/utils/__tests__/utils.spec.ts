import { PostgresError } from "@medusajs/medusa";
import { EOL } from "os";

import {
  buildError,
  createPostCheckSumHeader,
  isPaymentCollection,
} from "../phonepe";
import { sampleMerchantData, testCheckSumValue } from "../__fixtures__/data";
import { describe, afterEach, expect, jest, it } from "@jest/globals";
import dotenv from "dotenv";
dotenv.config();

export const salt = process.env.PHONEPE_SALT ?? "http";
describe("Utils", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("check header encoding", () => {
    it("check if the header is being encoded correctly", async () => {
      const result = await createPostCheckSumHeader(
        sampleMerchantData,
        salt,
        "/pg/v1/pay"
      );
      expect(result.checksum).toBe(testCheckSumValue);
    });
  });

  describe("isPaymentCollection", () => {
    it("should return return true if starts with paycol otherwise return false", () => {
      let result = isPaymentCollection("paycol_test");
      expect(result).toBeTruthy();

      result = isPaymentCollection("nopaycol_test");
      expect(result).toBeFalsy();
    });
  });

  describe("buildError", () => {
    it("should return the appropriate error message", () => {
      let event = "test_event";
      let error = {
        code: PostgresError.SERIALIZATION_FAILURE,
        detail: "some details",
      } as any;

      let message = buildError(event, error);
      expect(message).toBe(
        `PhonePe webhook ${event} handle failed. This can happen when this webhook is triggered during a cart completion and can be ignored. This event should be retried automatically.${EOL}${error.detail}`
      );

      event = "test_event";
      error = {
        code: "409",
        detail: "some details",
      } as any;

      message = buildError(event, error);
      expect(message).toBe(
        `PhonePe webhook ${event} handle failed.${EOL}${error.detail}`
      );

      event = "test_event";
      error = {
        code: "",
        detail: "some details",
      } as any;

      message = buildError(event, error);
      expect(message).toBe(`PhonePe webhook ${event} handling failed${EOL}`);
    });
  });
  /*
  describe("handlePaymentHook", () => {
    describe("on event type payment_intent.succeeded", () => {
      describe("in a payment context", () => {
        it("should complete the cart on non existing order", async () => {
          const event = { id: "event", type: "payment_intent.succeeded" };
          const paymentIntent = {
            id: paymentIntentId,
            metadata: { cart_id: nonExistingCartId },
          };

          await handlePaymentHook({ event, container, paymentIntent });

          const orderService = container.resolve("orderService");
          const cartCompletionStrategy = container.resolve(
            "cartCompletionStrategy"
          );
          const idempotencyKeyService = container.resolve(
            "idempotencyKeyService"
          );
          const cartService = container.resolve("cartService");

          expect(orderService.retrieveByCartId).toHaveBeenCalled();
          expect(orderService.retrieveByCartId).toHaveBeenCalledWith(
            paymentIntent.metadata.cart_id
          );

          expect(idempotencyKeyService.retrieve).toHaveBeenCalled();
          expect(idempotencyKeyService.retrieve).toHaveBeenCalledWith({
            request_path: "/phonepe/hooks",
            idempotency_key: event.id,
          });

          expect(idempotencyKeyService.create).toHaveBeenCalled();
          expect(idempotencyKeyService.create).toHaveBeenCalledWith({
            request_path: "/phonepe/hooks",
            idempotency_key: event.id,
          });

          expect(cartService.retrieve).toHaveBeenCalled();
          expect(cartService.retrieve).toHaveBeenCalledWith(
            paymentIntent.metadata.cart_id,
            { select: ["context"] }
          );

          expect(cartCompletionStrategy.complete).toHaveBeenCalled();
          expect(cartCompletionStrategy.complete).toHaveBeenCalledWith(
            paymentIntent.metadata.cart_id,
            {},
            { id: undefined }
          );
        });

        it("should not try to complete the cart on existing order", async () => {
          const event = { id: "event", type: "payment_intent.succeeded" };
          const paymentIntent = {
            id: paymentIntentId,
            metadata: { cart_id: existingCartId },
          };

          await handlePaymentHook({ event, container, paymentIntent });

          const orderService = container.resolve("orderService");
          const cartCompletionStrategy = container.resolve(
            "cartCompletionStrategy"
          );
          const idempotencyKeyService = container.resolve(
            "idempotencyKeyService"
          );
          const cartService = container.resolve("cartService");

          expect(orderService.retrieveByCartId).toHaveBeenCalled();
          expect(orderService.retrieveByCartId).toHaveBeenCalledWith(
            paymentIntent.metadata.cart_id
          );

          expect(idempotencyKeyService.retrieve).not.toHaveBeenCalled();

          expect(idempotencyKeyService.create).not.toHaveBeenCalled();

          expect(cartService.retrieve).not.toHaveBeenCalled();

          expect(cartCompletionStrategy.complete).not.toHaveBeenCalled();
        });

        it("should capture the payment if not already captured", async () => {
          const event = { id: "event", type: "payment_intent.succeeded" };
          const paymentIntent = {
            id: paymentIntentId,
            metadata: { cart_id: existingCartId },
          };

          await handlePaymentHook({ event, container, paymentIntent });

          const orderService = container.resolve("orderService");

          expect(orderService.retrieveByCartId).toHaveBeenCalled();
          expect(orderService.retrieveByCartId).toHaveBeenCalledWith(
            paymentIntent.metadata.cart_id
          );

          expect(orderService.capturePayment).toHaveBeenCalled();
          expect(orderService.capturePayment).toHaveBeenCalledWith(
            orderIdForExistingCartId
          );
        });

        it("should not capture the payment if already captured", async () => {
          const event = { id: "event", type: "payment_intent.succeeded" };
          const paymentIntent = {
            id: paymentIntentId,
            metadata: { cart_id: existingCartIdWithCapturedStatus },
          };

          await handlePaymentHook({ event, container, paymentIntent });

          const orderService = container.resolve("orderService");

          expect(orderService.retrieveByCartId).toHaveBeenCalled();
          expect(orderService.retrieveByCartId).toHaveBeenCalledWith(
            paymentIntent.metadata.cart_id
          );

          expect(orderService.capturePayment).not.toHaveBeenCalled();
        });
      });

      describe("in a payment collection context", () => {
        it("should capture the payment collection if not already captured", async () => {
          const event = { id: "event", type: "payment_intent.succeeded" };
          const paymentIntent = {
            id: paymentIntentId,
            metadata: { resource_id: existingResourceNotCapturedId },
          };

          await handlePaymentHook({ event, container, paymentIntent });

          const paymentCollectionService = container.resolve(
            "paymentCollectionService"
          );

          expect(paymentCollectionService.retrieve).toHaveBeenCalled();
          expect(paymentCollectionService.retrieve).toHaveBeenCalledWith(
            paymentIntent.metadata.resource_id,
            { relations: ["payments"] }
          );

          expect(paymentCollectionService.capture).toHaveBeenCalled();
          expect(paymentCollectionService.capture).toHaveBeenCalledWith(
            paymentId
          );
        });

        it("should not capture the payment collection if already captured", async () => {
          const event = { id: "event", type: "payment_intent.succeeded" };
          const paymentIntent = {
            id: paymentIntentId,
            metadata: { resource_id: existingResourceId },
          };

          await handlePaymentHook({ event, container, paymentIntent });

          const paymentCollectionService = container.resolve(
            "paymentCollectionService"
          );

          expect(paymentCollectionService.retrieve).toHaveBeenCalled();
          expect(paymentCollectionService.retrieve).toHaveBeenCalledWith(
            paymentIntent.metadata.resource_id,
            { relations: ["payments"] }
          );

          expect(paymentCollectionService.capture).not.toHaveBeenCalled();
        });
      });
    });

    describe("on event type payment_intent.amount_capturable_updated", () => {
      it("should complete the cart on non existing order", async () => {
        const event = {
          id: "event",
          type: "payment_intent.amount_capturable_updated",
        };
        const paymentIntent = {
          id: paymentIntentId,
          metadata: { cart_id: nonExistingCartId },
        };

        await handlePaymentHook({ event, container, paymentIntent });

        const orderService = container.resolve("orderService");
        const cartCompletionStrategy = container.resolve(
          "cartCompletionStrategy"
        );
        const idempotencyKeyService = container.resolve(
          "idempotencyKeyService"
        );
        const cartService = container.resolve("cartService");

        expect(orderService.retrieveByCartId).toHaveBeenCalled();
        expect(orderService.retrieveByCartId).toHaveBeenCalledWith(
          paymentIntent.metadata.cart_id
        );

        expect(idempotencyKeyService.retrieve).toHaveBeenCalled();
        expect(idempotencyKeyService.retrieve).toHaveBeenCalledWith({
          request_path: "/phonepe/hooks",
          idempotency_key: event.id,
        });

        expect(idempotencyKeyService.create).toHaveBeenCalled();
        expect(idempotencyKeyService.create).toHaveBeenCalledWith({
          request_path: "/phonepe/hooks",
          idempotency_key: event.id,
        });

        expect(cartService.retrieve).toHaveBeenCalled();
        expect(cartService.retrieve).toHaveBeenCalledWith(
          paymentIntent.metadata.cart_id,
          { select: ["context"] }
        );

        expect(cartCompletionStrategy.complete).toHaveBeenCalled();
        expect(cartCompletionStrategy.complete).toHaveBeenCalledWith(
          paymentIntent.metadata.cart_id,
          {},
          { id: undefined }
        );
      });

      it("should not try to complete the cart on existing order", async () => {
        const event = {
          id: "event",
          type: "payment_intent.amount_capturable_updated",
        };
        const paymentIntent = {
          id: paymentIntentId,
          metadata: { cart_id: existingCartId },
        };

        await handlePaymentHook({ event, container, paymentIntent });

        const orderService = container.resolve("orderService");
        const cartCompletionStrategy = container.resolve(
          "cartCompletionStrategy"
        );
        const idempotencyKeyService = container.resolve(
          "idempotencyKeyService"
        );
        const cartService = container.resolve("cartService");

        expect(orderService.retrieveByCartId).toHaveBeenCalled();
        expect(orderService.retrieveByCartId).toHaveBeenCalledWith(
          paymentIntent.metadata.cart_id
        );

        expect(idempotencyKeyService.retrieve).not.toHaveBeenCalled();

        expect(idempotencyKeyService.create).not.toHaveBeenCalled();

        expect(cartService.retrieve).not.toHaveBeenCalled();

        expect(cartCompletionStrategy.complete).not.toHaveBeenCalled();
      });
    });

    describe("on event type payment_intent.payment_failed", () => {
      it("should log the error", async () => {
        const event = { id: "event", type: "payment_intent.payment_failed" };
        const paymentIntent = {
          id: paymentIntentId,
          metadata: { cart_id: nonExistingCartId },
          last_payment_error: { message: "error message" },
        };

        await handlePaymentHook({ event, container, paymentIntent });

        const logger = container.resolve("logger");

        expect(logger.error).toHaveBeenCalled();
        expect(logger.error).toHaveBeenCalledWith(
          `The payment of the payment intent ${paymentIntent.id} has failed${EOL}${paymentIntent.last_payment_error.message}`
        );
      });
    });
  });*/
});
