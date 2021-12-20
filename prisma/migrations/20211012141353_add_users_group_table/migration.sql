-- CreateTable
CREATE TABLE "UsersGroup" (
    "buttonId" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UsersGroup_pkey" PRIMARY KEY ("buttonId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UsersGroup_userId_key" ON "UsersGroup"("userId");

-- AddForeignKey
ALTER TABLE "UsersGroup" ADD CONSTRAINT "UsersGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StudyGroup"("buttonId") ON DELETE RESTRICT ON UPDATE CASCADE;
