import { MigrationInterface, QueryRunner } from "typeorm";

export class Faq1740743277794 implements MigrationInterface {
  name = "Faq1740743277794";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE faq_category (
                id VARCHAR(255) PRIMARY KEY,
                handle VARCHAR(255) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT NULL,
                metadata JSON NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL
            );
        `);

    await queryRunner.query(`
            CREATE TABLE faq (
                id VARCHAR(255) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT NULL,
                faq_category_id VARCHAR(255) NULL,
                metadata JSON NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP NULL,
                CONSTRAINT fk_faq_category FOREIGN KEY (faq_category_id) REFERENCES faq_category(id) ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE faq DROP CONSTRAINT fk_faq_category;`);
    await queryRunner.query(`DROP TABLE faq;`);
    await queryRunner.query(`DROP TABLE faq_category;`);
  }
}
