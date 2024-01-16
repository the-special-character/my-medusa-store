class OrderSubscriber {
    constructor({ notificationService }) {
      this.notificationService_ = notificationService
  
      this.notificationService_.subscribe("order.shipment_created", "mailer")
      this.notificationService_.subscribe("order.gift_card_created", "mailer")
      this.notificationService_.subscribe("gift_card.created", "mailer")
      this.notificationService_.subscribe("order.placed", "mailer")
      this.notificationService_.subscribe("order.canceled", "mailer")
      this.notificationService_.subscribe("customer.password_reset", "mailer")
      this.notificationService_.subscribe("claim.shipment_created", "mailer")
      this.notificationService_.subscribe("swap.shipment_created", "mailer")
      this.notificationService_.subscribe("swap.created", "mailer")
      this.notificationService_.subscribe("order.items_returned", "mailer")
      this.notificationService_.subscribe("order.return_requested", "mailer")
      this.notificationService_.subscribe("order.refund_created", "mailer")
    }
  }
  
  export default OrderSubscriber