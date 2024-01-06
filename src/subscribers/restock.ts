import { EventBusService, NotificationService } from "@medusajs/medusa"

class RestockNotification {
   protected readonly eventBus_: EventBusService
   protected readonly mailerService_: NotificationService

   constructor({ eventBusService, mailerService }) {
      this.eventBus_ = eventBusService   
      this.mailerService_ = mailerService  
      
      eventBusService.subscribe(
         "restock-notification.restocked",
         async (eventData) => {
            const templateId = await mailerService.getTemplateId("restock-notification.restocked")
            if (!templateId) return
   
            const data = await mailerService.fetchData("restock-notification.restocked", eventData, null)
            if (!data.emails) return
   
            return await Promise.all(
               data.emails.map(async (e) => {
                  const sendOptions = {
                     template_id: templateId,
                     from: mailerService.options_.from,
                     to: e,
                     dynamic_template_data: data,
                  }
                  return await mailerService.sendEmail(sendOptions)
               })
            )
         }
      )
   }
}
 
export default RestockNotification