import {
  FindConfig,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import { WishlistRepository } from "src/repositories/wishlist";
import { WishlistItemRepository } from "src/repositories/wishlist-item";
import { MedusaError } from "medusa-core-utils";
import { EntityManager } from "typeorm";
import { Wishlist } from "src/models/wishlist";
import { WishlistItem } from "src/models/wishlist-item";

type InjectedDependencies = {
  manager: EntityManager;
  wishlistRepository: typeof WishlistRepository;
  wishlistItemRepository: typeof WishlistItemRepository;
};

class WishlistService extends TransactionBaseService {
  protected readonly wishlistRepository_: typeof WishlistRepository;
  protected readonly wishlistItemRepository_: typeof WishlistItemRepository;

  constructor({
    wishlistRepository,
    wishlistItemRepository,
  }: InjectedDependencies) {
    super(arguments[0]);

    this.wishlistRepository_ = wishlistRepository;
    this.wishlistItemRepository_ = wishlistItemRepository;
  }

  async retrieve(id: string, config?: FindConfig<Wishlist>): Promise<Wishlist> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const wishlistRepository = transactionManager.withRepository(
          this.wishlistRepository_
        );

        const query = buildQuery(
          {
            id,
          },
          config
        );

        return await wishlistRepository.findOne(query);
      }
    );
  }

  async retrieveByCustomerId(customer_id: string, config?: FindConfig<Wishlist>): Promise<Wishlist> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const wishlistRepository = transactionManager.withRepository(
          this.wishlistRepository_
        );

        const query = buildQuery(
          {
            customer_id,
          },
          config
        );

        return await wishlistRepository.findOne(query);
      }
    );
  }



  async create(
    payload: Pick<Wishlist, "region_id" | "customer_id">
  ): Promise<Wishlist> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        if (!payload.region_id) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `A region_id must be provided when creating a wishlist`
          );
        }

        const wishlistRepository = transactionManager.withRepository(
          this.wishlistRepository_
        );

        const createdWishlist = wishlistRepository.create(payload);
        const { id } = await wishlistRepository.save(createdWishlist);

        const wishlistQuery = buildQuery(
          {
            id,
          },
          {
            relations: ["items", "items.product"],
          }
        );

        return await wishlistRepository.findOne(wishlistQuery);
      }
    );
  }

  async update(
    id: string,
    data: Omit<Partial<Wishlist>, "id">
  ): Promise<Wishlist> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        if (!data.region_id) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `A region_id must be provided when creating a wishlist`
          );
        }

        const wishlistRepository = transactionManager.withRepository(
          this.wishlistRepository_
        );

        const wishlist = await this.retrieve(id);

        Object.assign(wishlist, data);
        

        const { id: wishlistId } = await wishlistRepository.save(wishlist);

        const wishlistQuery = buildQuery(
          {
            id: wishlistId,
          },
          {
            relations: ["items", "items.product"],
          }
        );

        return await wishlistRepository.findOne(wishlistQuery);
      }
    );
  }

  async addWishItem(
    wishlist_id: string,
    product_id: string,
    config?: FindConfig<WishlistItem>
  ) {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const wishlistItemRepository = transactionManager.withRepository(
          this.wishlistItemRepository_
        );
        const wishlistRepository = transactionManager.withRepository(
          this.wishlistRepository_
        );

        const query = buildQuery(
          {
            wishlist_id,
            product_id,
          },
          config
        );

        const item = await wishlistItemRepository.findOne(query);

        if (!item) {
          const createdItem = wishlistItemRepository.create({
            wishlist_id,
            product_id,
          });
          await wishlistItemRepository.save(createdItem);
        }

        const wishlistQuery = buildQuery(
          {
            id: wishlist_id,
          },
          {
            relations: ["items", "items.product"],
          }
        );

        return await wishlistRepository.findOne(wishlistQuery);
      }
    );
  }

  async removeWishItem(id: string, config?: FindConfig<WishlistItem>) {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const wishlistItemRepository = transactionManager.withRepository(
          this.wishlistItemRepository_
        );

        const wishlistRepository = transactionManager.withRepository(
          this.wishlistRepository_
        );

        const query = buildQuery(
          {
            id,
          },
          config
        );

        const item = await wishlistItemRepository.findOne(query);
        const wishlist_id = item.wishlist_id;

        if (item) {
          await wishlistItemRepository.remove(item);
        }

        const wishlistQuery = buildQuery(
          {
            id: wishlist_id,
          },
          {
            relations: ["items", "items.product"],
          }
        );

        return await wishlistRepository.findOne(wishlistQuery);
      }
    );
  }
}

export default WishlistService;
