import {
  FindConfig,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { Wishlist } from "src/models/wishlist";
import { ProductReviewRepository } from "src/repositories/product-review";
import { ProductReview } from "src/models/product-review";

type InjectedDependencies = {
  manager: EntityManager;
  productReviewRepository: typeof ProductReviewRepository;
};

class ProductReviewService extends TransactionBaseService {
  protected readonly productReviewRepository_: typeof ProductReviewRepository;

  constructor({ productReviewRepository }: InjectedDependencies) {
    super(arguments[0]);

    this.productReviewRepository_ = productReviewRepository;
  }

  async retrieve(
    product_id: string,
    config?: FindConfig<ProductReview>
  ): Promise<ProductReview[]> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const productReviewRepository = transactionManager.withRepository(
          this.productReviewRepository_
        );

        const query = buildQuery(
          {
            product_id,
          },
          config
        );

        return await productReviewRepository.find(query);
      }
    );
  }

  async create(payload: ProductReview): Promise<ProductReview> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const productReviewRepository = transactionManager.withRepository(
          this.productReviewRepository_
        );

        

        const createdproductReview = productReviewRepository.create(payload);
        return await productReviewRepository.save(createdproductReview);
      }
    );
  }
}

export default ProductReviewService
