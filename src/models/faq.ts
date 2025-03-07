import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, ManyToMany, JoinTable } from "typeorm";
import { FaqCategory } from "./faq-category";

@Entity()
export class Faq extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  // Change the relationship to ManyToMany and add JoinTable
  @ManyToMany(() => FaqCategory, (faqCategory) => faqCategory.faqs)
  @JoinTable({
    name: "faq_faq_category", // This is the join table name
    joinColumn: { name: "faq_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "faq_category_id", referencedColumnName: "id" },
  })
  faqCategories: FaqCategory[];

  @Column({ nullable: true, type: "jsonb" })
  metadata: Record<string, any>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "faq");
  }
}
