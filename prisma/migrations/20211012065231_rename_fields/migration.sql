/*
  Warnings:

  - You are about to drop the column `classNumber` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `classType` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `subGroup` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `tutor` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `lessonNumber` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lessonType` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subgroup` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectName` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tutorName` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('LECTURE', 'PRACTICAL', 'LABORATORY');

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "classNumber",
DROP COLUMN "classType",
DROP COLUMN "name",
DROP COLUMN "subGroup",
DROP COLUMN "tutor",
ADD COLUMN     "lessonNumber" INTEGER NOT NULL,
ADD COLUMN     "lessonType" "LessonType" NOT NULL,
ADD COLUMN     "subgroup" INTEGER NOT NULL,
ADD COLUMN     "subjectName" TEXT NOT NULL,
ADD COLUMN     "tutorName" TEXT NOT NULL;

-- DropEnum
DROP TYPE "ClassType";
