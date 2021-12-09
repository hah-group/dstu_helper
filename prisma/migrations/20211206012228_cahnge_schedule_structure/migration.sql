/*
  Warnings:

  - You are about to drop the column `tutorName` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `UsersGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `teacherId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UsersGroup" DROP CONSTRAINT "UsersGroup_groupId_fkey";

-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "tutorName",
ADD COLUMN     "teacherId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UsersGroup";

-- CreateTable
CREATE TABLE "Teacher" (
    "id" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
