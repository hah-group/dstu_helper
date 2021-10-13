/*
  Warnings:

  - You are about to drop the column `subjectId` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `Subject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutor` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_subjectId_fkey";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "subjectId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "tutor" TEXT NOT NULL;

-- DropTable
DROP TABLE "Subject";
