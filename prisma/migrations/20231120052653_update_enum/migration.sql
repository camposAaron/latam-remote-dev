/*
  Warnings:

  - The values [Open,Close] on the enum `OfferState` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OfferState_new" AS ENUM ('Opened', 'Closed');
ALTER TABLE "JobOffer" ALTER COLUMN "state" TYPE "OfferState_new" USING ("state"::text::"OfferState_new");
ALTER TYPE "OfferState" RENAME TO "OfferState_old";
ALTER TYPE "OfferState_new" RENAME TO "OfferState";
DROP TYPE "OfferState_old";
COMMIT;
