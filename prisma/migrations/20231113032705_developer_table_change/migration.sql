/*
  Warnings:

  - You are about to drop the column `picture` on the `Developer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "picture",
ALTER COLUMN "cvUrl" DROP NOT NULL;
