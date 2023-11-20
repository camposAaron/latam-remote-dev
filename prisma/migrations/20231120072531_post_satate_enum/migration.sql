/*
  Warnings:

  - Changed the type of `state` on the `Postulation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PostulationState" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- AlterTable
ALTER TABLE "Postulation" DROP COLUMN "state",
ADD COLUMN     "state" "PostulationState" NOT NULL;
