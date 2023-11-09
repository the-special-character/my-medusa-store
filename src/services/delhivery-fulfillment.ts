import {
  AbstractFulfillmentService,
  Cart,
  Fulfillment,
  LineItem,
  Order,
} from "@medusajs/medusa";
import { CreateReturnType } from "@medusajs/medusa/dist/types/fulfillment-provider";
import axios, { AxiosInstance } from "axios";
import { MedusaContainer } from "medusa-core-utils";

class DelhiveryFulfillmentService extends AbstractFulfillmentService {
  static identifier = "delhivery";
  private axiosInstance_: AxiosInstance;

  constructor(container: MedusaContainer, config?: Record<string, unknown>) {
    super(container, config);
    // you can access options here
    this.axiosInstance_ = axios.create({
      baseURL: `https://${process.env.DELHIVERY_MODE}.delhivery.com/c/api`,
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
      },
    })
  }

  async getFulfillmentOptions(): Promise<any[]> {
    return [
      {
        id: "delhivery-surface",
      },
      {
        id: "delhivery-express",
      },
    ];
  }

  async validateFulfillmentData(
    optionData: { [x: string]: unknown },
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<Record<string, unknown>> {

    const res = await this.axiosInstance_.get(`pin-codes/json/?filter_codes=${cart.shipping_address.postal_code}`)

    if(res.data?.delivery_codes?.length === 0) {
      throw new Error("delhivery not possible on this pincode data");
    }

    if (!(data.id === "delhivery-surface" || data.id === "delhivery-express")) {
      throw new Error("invalid data");
    }

    return {
      ...optionData,
      ...data,
    };
  }

  async validateOption(data: { [x: string]: unknown }): Promise<boolean> {
    return data.id == "delhivery-surface" || data.id == "delhivery-express";
  }

  async canCalculate(data: { [x: string]: unknown }): Promise<boolean> {
    return data.id == "delhivery-surface" || data.id == "delhivery-express";
  }

  async calculatePrice(
    optionData: { [x: string]: unknown },
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<number> {
    
    const weight = cart.items.reduce((p, c) => {
      return p + (c.variant.weight * c.quantity)
    }, 0)

    
    return cart.items.length * 1000;
  }

  async createFulfillment(
    data: Record<string, unknown>,
    items: LineItem[],
    order: Order,
    fulfillment: Fulfillment
  ): Promise<Record<string, unknown>> {
    // No data is being sent anywhere
    // No data to be stored in the fulfillment's data object
    return {};
  }

  async cancelFulfillment(fulfillment: { [x: string]: unknown }): Promise<any> {
    return {};
  }

  async createReturn(
    returnOrder: CreateReturnType
  ): Promise<Record<string, unknown>> {
    return {};
  }

  async getFulfillmentDocuments(data: { [x: string]: unknown }): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async getReturnDocuments(data: Record<string, unknown>): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async getShipmentDocuments(data: Record<string, unknown>): Promise<any> {
    throw new Error("Method not implemented.");
  }

  async retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: "invoice" | "label"
  ): Promise<any> {
    throw new Error("Method not implemented.");
  }
}

export default DelhiveryFulfillmentService;
