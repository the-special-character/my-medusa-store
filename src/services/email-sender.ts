import { AbstractNotificationService, OrderService } from "@medusajs/medusa";
import { EntityManager } from "typeorm";

class EmailSenderService extends AbstractNotificationService {
  protected manager_: EntityManager;
  protected transactionManager_: EntityManager;
  static identifier = "email-sender";
  protected orderService: OrderService;

  constructor(container, options) {
    super(container);
    // you can access options here in case you're
    // using a plugin

    this.orderService = container.orderService;
  }

  async sendNotification(
    event: string,
    data: any,
    attachmentGenerator: unknown
  ): Promise<{
    to: string;
    status: string;
    data: Record<string, unknown>;
  }> {
    console.log("event", event);
    
    if (event === "customer.password_reset") {
      // retrieve order
      const order = await this.orderService.retrieve(data.id);
      // TODO send email

      console.log("Notification sent");
      return {
        to: order.email,
        status: "done",
        data: {
          // any data necessary to send the email
          // for example:
          subject: "You placed a new order!",
          items: order.items,
        },
      };
    }
  }

  async resendNotification(
    notification: any,
    config: any,
    attachmentGenerator: unknown
  ): Promise<{
    to: string;
    status: string;
    data: Record<string, unknown>;
  }> {
    const to: string = config.to ? config.to : notification.to;

    // TODO resend the notification using the same data
    // that is saved under notification.data

    console.log("Notification resent");
    return {
      to,
      status: "done",
      data: notification.data, // make changes to the data
    };
  }
}

export default EmailSenderService;
