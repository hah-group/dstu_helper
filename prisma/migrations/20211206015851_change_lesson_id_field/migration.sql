/*
  Warnings:

  - The primary key for the `Lesson` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `isTopWeek` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_pkey",
ADD COLUMN     "isTopWeek" BOOLEAN NOT NULL,
ALTER COLUMN "buttonId" DROP DEFAULT,
ALTER COLUMN "buttonId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Lesson_pkey" PRIMARY KEY ("buttonId");
DROP SEQUENCE "Lesson_id_seq";
