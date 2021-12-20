-- CreateEnum
CREATE TYPE "ClassType" AS ENUM ('LECTURE', 'PRACTICAL', 'LABORATORY');

-- CreateTable
CREATE TABLE "StudyGroups" (
    "buttonId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "StudyGroups_pkey" PRIMARY KEY ("buttonId")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "buttonId" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "upWeek" BOOLEAN NOT NULL,
    "weekDay" INTEGER NOT NULL,
    "timeStart" TIME NOT NULL,
    "timeEnd" TIME NOT NULL,
    "classType" "ClassType" NOT NULL,
    "classNumber" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "corpus" TEXT NOT NULL,
    "classRoom" TEXT NOT NULL,
    "distance" BOOLEAN NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("buttonId")
);

-- CreateIndex
CREATE UNIQUE INDEX "StudyGroups_name_key" ON "StudyGroups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "StudyGroups_groupId_key" ON "StudyGroups"("groupId");

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StudyGroups"("groupId") ON DELETE RESTRICT ON UPDATE CASCADE;
