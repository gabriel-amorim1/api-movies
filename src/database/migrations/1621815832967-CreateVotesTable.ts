import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVotesTable1621815832967 implements MigrationInterface {
    name = 'CreateVotesTable1621815832967';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "votes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "movie_id" uuid NOT NULL, "rating" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "PK_f3d9fd4a0af865152c3f59db8ff" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `ALTER TABLE "votes" ADD CONSTRAINT "FK_27be2cab62274f6876ad6a31641" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "votes" ADD CONSTRAINT "FK_bd941f763560c3c4400366467f8" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "votes" DROP CONSTRAINT "FK_bd941f763560c3c4400366467f8"`,
        );
        await queryRunner.query(
            `ALTER TABLE "votes" DROP CONSTRAINT "FK_27be2cab62274f6876ad6a31641"`,
        );
        await queryRunner.query(`DROP TABLE "votes"`);
    }
}
