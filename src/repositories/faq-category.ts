import { FaqCategory } from "../models/faq-category";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const FaqCategoryRepository = dataSource.getRepository(FaqCategory);
