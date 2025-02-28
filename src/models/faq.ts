import { BaseEntity, generateEntityId } from "@medusajs/medusa";
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { FaqCategory } from "./faq-category";

@Entity()
export class Faq extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => FaqCategory)
  @JoinColumn({ name: "faq_category_id" })
  faqCategory: FaqCategory;

  @Column({ nullable: true, type: "jsonb" })
  metadata: Record<string, any>;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "faq");
  }
}
