/*
  Warnings:

  - The `yearsOfExperience` column on the `DeveloperSkill` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DeveloperSkill" DROP COLUMN "yearsOfExperience",
ADD COLUMN     "yearsOfExperience" INTEGER;
