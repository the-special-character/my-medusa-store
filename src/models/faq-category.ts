import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, ManyToMany } from "typeorm";
import { Faq } from "./faq";

@Entity()
export class FaqCategory extends BaseEntity {
  @Column({ unique: true })
  handle: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  // Change the relationship to ManyToMany
  @ManyToMany(() => Faq, (faq) => faq.faqCategories)
  faqs: Faq[];

  @Column({ nullable: true, type: "jsonb" })
  metadata: Record<string, any>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "faq_cat");
  }
}
