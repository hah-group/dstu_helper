/*
  Warnings:

  - You are about to drop the column `subject` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `subjectId` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "subject",
ADD COLUMN     "subjectId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Subject" (
    "buttonId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tutor" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("buttonId")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("buttonId") ON DELETE RESTRICT ON UPDATE CASCADE;
