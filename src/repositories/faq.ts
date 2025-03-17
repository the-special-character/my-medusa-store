import { Faq } from "../models/faq";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const FaqRepository = dataSource.getRepository(Faq);
