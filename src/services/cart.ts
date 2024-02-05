import { Lifetime } from "awilix";
import {
	FindConfig,
	Selector,
	TransactionBaseService,
	buildQuery,
	CartService as MedusaCartService,
} from "@medusajs/medusa";
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
		const cartRepo = this.activeManager_.withRepository(this.cartRepository_);

		const query = buildQuery(
			[
				{
					email: Not(IsNull()),
					payment_sessions: {
						status: "pending",
						is_initiated: true,
					},
				},
			],
			{
				relations: [
					"payment_sessions",
					"customer",
					"shipping_address",
					"items",
				],
			}
		);

		return await cartRepo.findAndCount(query);
	}
}

export default CartService;
