/*
  Warnings:

  - You are about to drop the column `lessonNumber` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `lessonType` on the `Lesson` table. All the data in the column will be lost.
  - You are about to drop the column `subjectName` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `name` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "LessonType" ADD VALUE 'EXAMINATION';

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "lessonNumber",
DROP COLUMN "lessonType",
DROP COLUMN "subjectName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "type" "LessonType" NOT NULL;
