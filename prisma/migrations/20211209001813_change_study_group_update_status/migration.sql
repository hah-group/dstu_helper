/*
  Warnings:

  - You are about to drop the column `updateStatus` on the `StudyGroup` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UpdateStatus" AS ENUM ('DONE', 'IN_PROGRESS', 'FAILURE');

-- AlterTable
ALTER TABLE "StudyGroup" DROP COLUMN "updating",
ADD COLUMN     "updateStatus" "UpdateStatus" NOT NULL DEFAULT E'DONE';
