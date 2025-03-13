import { MigrationInterface, QueryRunner } from "typeorm";

export class Faq1740743277794 implements MigrationInterface {
  name = "Faq1740743277794";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the 'faq_category' table
    await queryRunner.query(`
      CREATE TABLE faq_category (
        id VARCHAR(255) PRIMARY KEY,
        handle VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create the 'faq' table
    await queryRunner.query(`
      CREATE TABLE faq (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        faq_category_id VARCHAR(255),
        CONSTRAINT FK_faq_category FOREIGN KEY (faq_category_id) REFERENCES faq_category(id) ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the 'faq' table
    await queryRunner.query(`DROP TABLE faq;`);

    // Drop the 'faq_category' table
    await queryRunner.query(`DROP TABLE faq_category;`);
  }
}

// import { MigrationInterface, QueryRunner } from "typeorm";

// export class Faq1740743277794 implements MigrationInterface {
//   name = "Faq1740743277794";

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // Step 1: Create the 'faq_category' table
//     await queryRunner.query(`
//       CREATE TABLE faq_category (
//         id VARCHAR(255) PRIMARY KEY,
//         handle VARCHAR(255) UNIQUE NOT NULL,
//         title character varying NOT NULL,
//         description text,
//         metadata jsonb,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // Step 2: Create the 'faq' table
//     await queryRunner.query(`
//       CREATE TABLE faq (
//         id VARCHAR(255) PRIMARY KEY,
//         title VARCHAR(255) NOT NULL,
//         description TEXT NULL,
//         metadata JSONB,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         faq_category_id VARCHAR(255),
//         CONSTRAINT FK_faq_category_id FOREIGN KEY (faq_category_id) REFERENCES faq_category(id) ON DELETE SET NULL
//       )
//     `);

//     // Step 3: Create the join table for the many-to-many relation between 'faq' and 'faq_category'
//     await queryRunner.query(`
//       CREATE TABLE faq_faq_category (
//         faq_id VARCHAR(255) PRIMARY KEY NOT NULL,
//         faq_category_id VARCHAR(255) NOT NULL,
//         CONSTRAINT FK_faq_faq_id FOREIGN KEY (faq_id) REFERENCES faq(id) ON DELETE CASCADE,
//         CONSTRAINT FK_faq_category_faq_category_id FOREIGN KEY (faq_category_id) REFERENCES faq_category(id) ON DELETE CASCADE
//       )
//     `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Drop the join table for the many-to-many relation
//     await queryRunner.query(`DROP TABLE faq_faq_category;`);

//     // Drop the 'faq' table
//     await queryRunner.query(`DROP TABLE faq;`);

//     // Drop the 'faq_category' table
//     await queryRunner.query(`DROP TABLE faq_category;`);
//   }
// }
