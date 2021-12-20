-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "buttonId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("buttonId")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "buttonId" INTEGER NOT NULL,
    "settings" JSONB NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("buttonId")
);

-- CreateTable
CREATE TABLE "ConversationUser" (
    "buttonId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,

    CONSTRAINT "ConversationUser_pkey" PRIMARY KEY ("buttonId")
);

-- CreateTable
CREATE TABLE "_ConversationUserToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ConversationToConversationUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationUserToUser_AB_unique" ON "_ConversationUserToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationUserToUser_B_index" ON "_ConversationUserToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConversationToConversationUser_AB_unique" ON "_ConversationToConversationUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ConversationToConversationUser_B_index" ON "_ConversationToConversationUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "StudyGroup"("buttonId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationUser" ADD CONSTRAINT "ConversationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("buttonId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationUser" ADD CONSTRAINT "ConversationUser_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("buttonId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationUserToUser" ADD FOREIGN KEY ("A") REFERENCES "ConversationUser"("buttonId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationUserToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("buttonId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToConversationUser" ADD FOREIGN KEY ("A") REFERENCES "Conversation"("buttonId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToConversationUser" ADD FOREIGN KEY ("B") REFERENCES "ConversationUser"("buttonId") ON DELETE CASCADE ON UPDATE CASCADE;
