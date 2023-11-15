/*
  Warnings:

  - You are about to drop the column `yearsOfExperience` on the `DeveloperSkill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DeveloperSkill" DROP COLUMN "yearsOfExperience";

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "institution" TEXT;
