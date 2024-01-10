import {
  AbstractFulfillmentService,
  Cart,
  ClaimService,
  Fulfillment,
  LineItem,
  Order,
  OrderService,
  ProductVariantInventoryService,
  SwapService,
  TotalsService,
} from "@medusajs/medusa";
import { StockLocationService } from "@medusajs/stock-location/dist/services";
import { Lifetime } from "awilix";

// import { StockLocationService } from '@medusajs/stock-location/dist/services';
import { CreateReturnType } from "@medusajs/medusa/dist/types/fulfillment-provider";
import axios, { AxiosInstance } from "axios";
import { MedusaContainer } from "medusa-core-utils";
import { FulfillmentService } from "medusa-interfaces";

class DelhiveryFulfillmentService extends AbstractFulfillmentService {
  static identifier = "delhivery";
  static LIFE_TIME = Lifetime.SCOPED;
  private axiosInstance_: AxiosInstance;
  private options_: any;
  productVariantInventoryService_: ProductVariantInventoryService;
  stockLocationService_: StockLocationService;

  constructor(container, config?: Record<string, unknown>) {
    super(container);

    const {
      orderService,
      productVariantInventoryService,
      stockLocationService,
    } = container;

    try {
      this.productVariantInventoryService_ = productVariantInventoryService;
      this.stockLocationService_ = stockLocationService;
    } catch (error) {
      console.log(
        "DELHIVERY:::::::::::::::",
        "productVariantInventoryService_",
        error
      );
    }

    // /** @private @const {OrderService} */
    // this.orderService_ = container.resolve<OrderService>("orderService");

    // /** @private @const {TotalsService} */
    // this.totalsService_ = container.resolve<TotalsService>("totalsService");

    // /** @private @const {SwapService} */
    // this.swapService_ = container.resolve<SwapService>("swapService");

    // /** @private @const {SwapService} */
    // this.claimService_ = container.resolve<ClaimService>("claimService");
    // you can access options here
    this.axiosInstance_ = axios.create({
      baseURL: `https://${process.env.DELHIVERY_MODE}.delhivery.com`,
      headers: {
        "content-type": "application/json",
        Authorization: `Token ${process.env.DELHIVERY_TOKEN}`,
      },
    });
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
  // COMPLETED
  async validateFulfillmentData(
    optionData: { [x: string]: string },
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<Record<string, unknown>> {
    console.log("DELHIVERY:::::::::::::::", "validateFulfillmentData");
    console.log("DELHIVERY:::::::::::::::", "optionData", optionData);
    console.log("DELHIVERY:::::::::::::::", "data", data);
    console.log("DELHIVERY:::::::::::::::", "cart", JSON.stringify(cart));

    if (
      ["delhivery-surface", "delhivery-express"].indexOf(optionData.id) === -1
    ) {
      throw new Error("invalid data");
    }

    const res = await this.axiosInstance_.get(
      `c/api/pin-codes/json/?filter_codes=${cart.shipping_address.postal_code}`
    );
    if (res.data?.delivery_codes?.length === 0) {
      throw new Error("delhivery not possible on this pincode data");
    }
    console.log({ response: JSON.stringify(res.data) });
    return {
      ...optionData,
      ...data,
    };
  }
  // COMPLETED
  async validateOption(data: { [x: string]: unknown }): Promise<boolean> {
    console.log("DELHIVERY:::::::::::::::validateOption", data);
    return true;
  }
  // COMPLETED
  async canCalculate(data: { [x: string]: unknown }): Promise<boolean> {
    console.log("DELHIVERY:::::::::::::::canCalculate", data);
    return data.id == "delhivery-surface" || data.id == "delhivery-express";
  }
  // COMPLETED
  async calculatePrice(
    optionData: { [x: string]: unknown },
    data: { [x: string]: unknown },
    cart: Cart
  ): Promise<number> {
    console.log("DELHIVERY:::::::::::::::calculatePrice", {
      data,
      optionData,
      cart,
    });
    const inventory = await this.stockLocationService_.list(
      {},
      {
        relations: ["address"],
      }
    );

    const weight = cart.items.reduce((p, c) => {
      return p + c.variant.weight * c.quantity;
    }, 0);

    const md = data.id === "delhivery-express" ? "E" : "S";

    const res = await this.axiosInstance_.get(
      `api/kinko/v1/invoice/charges/.json?md=${md}&ss=DTO&d_pin=${cart.shipping_address.postal_code}&o_pin=${inventory[0].address.postal_code}&cgm=${weight}&pt=Pre-paid&cod=0`
    );

    return res?.data[0]?.total_amount || 0;
  }
  // TODO >
  async createFulfillment(
    data: Record<string, unknown>,
    items: LineItem[],
    order: Order,
    fulfillment: Fulfillment
  ): Promise<Record<string, unknown>> {
    console.log("DELHIVERY:::::::::::::::createFulfillment", {
      data,
      items,
      order,
      fulfillment,
    });
    const locationDetails = await this.stockLocationService_.retrieve(
      fulfillment.location_id,
      {
        relations: ["address"],
      }
    );

    const res = await this.axiosInstance_.post(
      "api/cmu/create.json",
      `format=json&data=${{
        shipments: items.map((x) => ({
          name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
          add: `${order.shipping_address.address_1} ${order.shipping_address.address_2}`,
          pin: order.shipping_address.postal_code,
          city: order.shipping_address.city,
          state: order.shipping_address.province,
          country: order.shipping_address.country,
          phone: order.shipping_address.phone,
          order: order.id,
          payment_mode: "Prepaid",
          return_pin: locationDetails.address.postal_code,
          return_city: locationDetails.address.city,
          return_phone: locationDetails.address.phone,
          return_add: `${locationDetails.address.address_1} ${locationDetails.address.address_2}`,
          return_state: locationDetails.address.province,
          return_country: locationDetails.address.country_code,
          products_desc: x.description,
          hsn_code: x.variant.hs_code,
          cod_amount: "",
          order_date: order.created_at,
          total_amount: order.total,
          seller_add: `${locationDetails.address.address_1} ${locationDetails.address.address_2}`,
          seller_name: locationDetails.address.company,
          seller_inv: "",
          quantity: x.quantity,
          waybill: "",
          shipment_width: x.variant.width,
          shipment_height: x.variant.height,
          weight: x.variant.weight,
          seller_gst_tin: "",
          shipping_mode: "Express",
          address_type: "home",
        })),
        pickup_location: {
          name: locationDetails.address.company,
          add: `${locationDetails.address.address_1} ${locationDetails.address.address_2}`,
          city: locationDetails.address.city,
          pin_code: locationDetails.address.postal_code,
          country: locationDetails.address.country_code,
          phone: locationDetails.address.phone,
        },
      }}`
    );
    if (!res.data.success) {
      const messages = res.data.packages
        .reduce((p, c) => {
          return [...p, ...c.remarks];
        }, [])
        .join(",");

      throw new Error(messages);
    }

    return res.data;
  }

  async cancelFulfillment(fulfillment: { [x: string]: unknown }): Promise<any> {
    console.log("DELHIVERY:::::::::::::::cancelFulfillment", { fulfillment });
    return {};
  }

  async createReturn(
    returnOrder: CreateReturnType
  ): Promise<Record<string, unknown>> {
    console.log("DELHIVERY:::::::::::::::createReturn", { returnOrder });
    return {};
  }

  getFulfillmentDocuments(data: Record<string, unknown>): Promise<any> {
    console.log("DELHIVERY:::::::::::::::getFulfillmentDocuments", { data });
    throw new Error("Method not implemented.");
    // return Promise.resolve({});
    // return []
  }

  async getReturnDocuments(data: Record<string, unknown>): Promise<any> {
    console.log("DELHIVERY:::::::::::::::getReturnDocuments", { data });

    throw new Error("Method not implemented.");
    // return Promise.resolve({});
  }

  async getShipmentDocuments(data: Record<string, unknown>): Promise<any> {
    console.log("DELHIVERY:::::::::::::::getShipmentDocuments", { data });

    throw new Error("Method not implemented.");
    // return Promise.resolve({});
  }

  async retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: "invoice" | "label"
  ): Promise<any> {
    console.log("DELHIVERY:::::::::::::::retrieveDocuments", {
      fulfillmentData,
      documentType,
    });
    return Promise.resolve({});
    // throw new Error("Method not implemented.");
  }
}

export default DelhiveryFulfillmentService;
