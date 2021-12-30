/*
  Warnings:

  - The `stage` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stage",
ADD COLUMN     "stage" TEXT NOT NULL DEFAULT E'INITIAL';

-- DropEnum
DROP TYPE "UserStage";
