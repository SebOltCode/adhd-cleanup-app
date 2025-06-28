import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar UNIQUE NOT NULL,
        "passwordHash" varchar NOT NULL,
        "level" integer NOT NULL DEFAULT 1
      );
    `);
    await queryRunner.query(`
      CREATE TABLE "room" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "configuration" jsonb,
        "userId" uuid REFERENCES "user"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE "item" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar NOT NULL,
        "roomId" uuid REFERENCES "room"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE "task_group" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "title" varchar NOT NULL,
        "sequence" integer NOT NULL,
        "itemId" uuid REFERENCES "item"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE "task" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "description" varchar NOT NULL,
        "expectedDurationMinutes" integer NOT NULL,
        "sequence" integer NOT NULL,
        "groupId" uuid REFERENCES "task_group"("id") ON DELETE CASCADE
      );
    `);
    await queryRunner.query(`
      CREATE TABLE "task_progress" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" uuid REFERENCES "user"("id") ON DELETE CASCADE,
        "taskId" uuid REFERENCES "task"("id") ON DELETE CASCADE,
        "completed" boolean NOT NULL DEFAULT false,
        "lastAttemptedAt" timestamp,
        "createdAt" timestamp NOT NULL DEFAULT now()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "task_progress"');
    await queryRunner.query('DROP TABLE "task"');
    await queryRunner.query('DROP TABLE "task_group"');
    await queryRunner.query('DROP TABLE "item"');
    await queryRunner.query('DROP TABLE "room"');
    await queryRunner.query('DROP TABLE "user"');
  }
}
