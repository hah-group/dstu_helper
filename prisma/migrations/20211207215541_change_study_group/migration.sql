/*
  Warnings:

  - You are about to drop the column `groupId` on the `StudyGroup` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StudyGroup_groupId_key";

-- AlterTable
ALTER TABLE "StudyGroup" DROP COLUMN "groupId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "StudyGroup_id_seq";
