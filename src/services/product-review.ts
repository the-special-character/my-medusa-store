import {
  EventBusService,
  FindConfig,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import { ProductReviewRepository } from "src/repositories/product-review";
import { ProductReview, ReviewStatus } from "src/models/product-review";

type InjectedDependencies = {
  manager: EntityManager;
  productReviewRepository: typeof ProductReviewRepository;
  eventBusService: EventBusService;
};

class FilterableProductReviewsProps {}

class ProductReviewService extends TransactionBaseService {
  protected readonly productReviewRepository_: typeof ProductReviewRepository;
  protected readonly eventBus_: EventBusService;

  constructor({
    productReviewRepository,
    eventBusService,
  }: InjectedDependencies) {
    super(arguments[0]);

    this.productReviewRepository_ = productReviewRepository;
    this.eventBus_ = eventBusService;
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
  async find(
    selector: FilterableProductReviewsProps = {},
    config?: FindConfig<ProductReview>
  ): Promise<ProductReview[]> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const productReviewRepository = transactionManager.withRepository(
          this.productReviewRepository_
        );

        const query = buildQuery(selector, config);

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

  async remove(id: string) {
    return await this.atomicPhase_(async (manager) => {
      const productReviewRepo = manager.withRepository(
        this.productReviewRepository_
      );

      // Should not fail, if product does not exist, since delete is idempotent
      const product = await productReviewRepo.findOne({
        where: { id },
        relations: {},
      });

      if (!product) {
        return;
      }

      await productReviewRepo.softRemove(product);

      return Promise.resolve();
    });
  }
  async update(id: string, status: ReviewStatus) {
    return await this.atomicPhase_(async (manager) => {
      const productReviewRepo = manager.withRepository(
        this.productReviewRepository_
      );

      // Should not fail, if product does not exist, since delete is idempotent
      const product = await productReviewRepo.findOne({
        where: { id },
        relations: {},
      });

      if (!product) {
        return;
      }

      return await productReviewRepo.update(id, {
        status,
      });
      // return Promise.resolve();
    });
  }
}

export default ProductReviewService;
