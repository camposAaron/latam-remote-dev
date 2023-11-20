/*
  Warnings:

  - Added the required column `title` to the `JobOffer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JobOffer" ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "vacancies" INTEGER;
