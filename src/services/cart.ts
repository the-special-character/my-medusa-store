import { Lifetime } from "awilix"
import { 
    CartType,
  CartService as MedusaCartService,
} from "@medusajs/medusa"
import CartRepository from "@medusajs/medusa/dist/repositories/cart";
import { IsNull, Not } from "typeorm";

class CartService extends MedusaCartService {
  // The default life time for a core service is SINGLETON
  static LIFE_TIME = Lifetime.SCOPED;
  protected readonly cartRepository_: typeof CartRepository;


  constructor(container) {
    super(container);

    this.cartRepository_ = container.cartRepository;
  }


  async getPendingCartItems() {
    return await this.cartRepository_.findAndCount({
        loadRelationIds: true,
        relations: ["payment_sessions"],
        order: { ['created_at']: 'DESC' },
        where: [
            {
                payment_sessions: {
                    status: 'pending',
                    is_initiated: true
                }
            }
        ],
    })
  }
}

export default CartService