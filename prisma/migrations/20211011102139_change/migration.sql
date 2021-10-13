/*
  Warnings:

  - You are about to drop the `StudyGroups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_groupId_fkey";

-- DropTable
DROP TABLE "StudyGroups";

-- CreateTable
CREATE TABLE "StudyGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "StudyGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyGroup_name_key" ON "StudyGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StudyGroup_groupId_key" ON "StudyGroup"("groupId");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StudyGroup"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;
