/*
  Warnings:

  - You are about to drop the column `userId` on the `Developer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[developerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Developer" DROP CONSTRAINT "Developer_userId_fkey";

-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "developerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_developerId_key" ON "User"("developerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyId_key" ON "User"("companyId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_developerId_fkey" FOREIGN KEY ("developerId") REFERENCES "Developer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;
