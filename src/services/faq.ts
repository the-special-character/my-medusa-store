import {
  FindConfig,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa";
import { MedusaError } from "medusa-core-utils";
import { EntityManager, FindOptionsSelect } from "typeorm";
import { FaqRepository } from "../repositories/faq";
import { FaqCategoryRepository } from "../repositories/faq-category";
import { Faq } from "../models/faq";
import { FaqCategory } from "../models/faq-category";

type InjectedDependencies = {
  manager: EntityManager;
  faqRepository: typeof FaqRepository;
  faqCategoryRepository: typeof FaqCategoryRepository;
};

class FaqService extends TransactionBaseService {
  protected readonly faqRepository_: typeof FaqRepository;
  protected readonly faqCategoryRepository_: typeof FaqCategoryRepository;

  constructor({ faqRepository, faqCategoryRepository }: InjectedDependencies) {
    super(arguments[0]);

    this.faqRepository_ = faqRepository;
    this.faqCategoryRepository_ = faqCategoryRepository;
  }

  // For Faqs

  async list(
    selector?: FindOptionsSelect<Faq>,
    config?: FindConfig<Faq>
  ): Promise<[Faq[], number]> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqRepository = transactionManager.withRepository(
          this.faqRepository_
        );

        const query = buildQuery(selector, config);

        return await faqRepository.findAndCount(query);
      }
    );
  }

  async retrieve(id: string, config?: FindConfig<Faq>): Promise<Faq> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqRepository = transactionManager.withRepository(
          this.faqRepository_
        );

        const query = buildQuery(
          {
            id,
          },
          config
        );

        return await faqRepository.findOne(query);
      }
    );
  }

  async create(payload: Faq & { category_id?: string }): Promise<Faq> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqRepository = transactionManager.withRepository(
          this.faqRepository_
        );
        const faqCategoryRepository = transactionManager.withRepository(
          this.faqCategoryRepository_
        );

        let faqCategory: null | FaqCategory = null;
        if (payload?.category_id) {
          faqCategory =
            (await faqCategoryRepository.findOne(
              buildQuery({
                id: payload?.category_id,
              })
            )) || null;
        }

        const createdWishlist = faqRepository.create({
          ...payload,
          faqCategory,
        });

        const { id } = await faqRepository.save(createdWishlist);

        const faqQuery = buildQuery(
          {
            id,
          },
          {
            relations: ["faqCategory"],
          }
        );

        return await faqRepository.findOne(faqQuery);
      }
    );
  }

  async update(
    id: string,
    data: Omit<Partial<Faq>, "id"> & { category_id?: string }
  ): Promise<Faq> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqRepository = transactionManager.withRepository(
          this.faqRepository_
        );
        const faqCategoryRepository = transactionManager.withRepository(
          this.faqCategoryRepository_
        );

        const faq = await this.retrieve(id);

        Object.assign(faq, data);

        let faqCategory: null | FaqCategory = null;
        if (data?.category_id) {
          faqCategory =
            (await faqCategoryRepository.findOne(
              buildQuery({
                id: data?.category_id,
              })
            )) || null;
        }

        await faqRepository.update(id, { ...faq, faqCategory });

        const faqQuery = buildQuery(
          {
            id,
          },
          {
            relations: ["faqCategory"],
          }
        );

        return await faqRepository.findOne(faqQuery);
      }
    );
  }

  async delete(id: string) {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqRepository = transactionManager.withRepository(
          this.faqRepository_
        );

        const faq = await this.retrieve(id);

        if (!faq) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Faq not found with id: ${id}`
          );
        }

        return await faqRepository.delete(id);
      }
    );
  }

  // For Faq Categories

  async listCategory(
    selector?: FindOptionsSelect<FaqCategory>,
    config?: FindConfig<FaqCategory>
  ): Promise<[FaqCategory[], number]> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqCategoryRepository = transactionManager.withRepository(
          this.faqCategoryRepository_
        );

        const query = buildQuery(selector, config);

        return await faqCategoryRepository.findAndCount(query);
      }
    );
  }

  async retrieveCategeory(
    id: string,
    config?: FindConfig<FaqCategory>
  ): Promise<FaqCategory> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqCategoryRepository = transactionManager.withRepository(
          this.faqCategoryRepository_
        );

        const query = buildQuery(
          {
            id,
          },
          config
        );

        return await faqCategoryRepository.findOne(query);
      }
    );
  }

  async createCategeory(payload: FaqCategory): Promise<FaqCategory> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqCategoryRepository = transactionManager.withRepository(
          this.faqCategoryRepository_
        );

        const faqCategory = faqCategoryRepository.create(payload);
        const { id } = await faqCategoryRepository.save(faqCategory);

        const faqQuery = buildQuery(
          {
            id,
          },
          {
            relations: ["faqs"],
          }
        );

        return await faqCategoryRepository.findOne(faqQuery);
      }
    );
  }

  async updateCategeory(
    id: string,
    data: Omit<Partial<FaqCategory>, "id">
  ): Promise<FaqCategory> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqCategoryRepository = transactionManager.withRepository(
          this.faqCategoryRepository_
        );

        const faqCategory = await this.retrieve(id);

        Object.assign(faqCategory, data);

        await faqCategoryRepository.update(id, faqCategory);

        const faqQuery = buildQuery(
          {
            id,
          },
          {
            relations: ["faqs"],
          }
        );

        return await faqCategoryRepository.findOne(faqQuery);
      }
    );
  }

  async deleteCategeory(id: string) {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const faqCategoryRepository = transactionManager.withRepository(
          this.faqCategoryRepository_
        );

        const faqCategory = await this.retrieve(id);

        if (!faqCategory) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Faq Category not found with id: ${id}`
          );
        }

        return await faqCategoryRepository.delete(id);
      }
    );
  }
}

export default FaqService;
