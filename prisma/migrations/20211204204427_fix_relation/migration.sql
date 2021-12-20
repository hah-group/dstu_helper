/*
  Warnings:

  - You are about to drop the `_ConversationToConversationUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ConversationUserToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConversationUser" DROP CONSTRAINT "ConversationUser_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "ConversationUser" DROP CONSTRAINT "ConversationUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToConversationUser" DROP CONSTRAINT "_ConversationToConversationUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToConversationUser" DROP CONSTRAINT "_ConversationToConversationUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationUserToUser" DROP CONSTRAINT "_ConversationUserToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationUserToUser" DROP CONSTRAINT "_ConversationUserToUser_B_fkey";

-- DropTable
DROP TABLE "_ConversationToConversationUser";

-- DropTable
DROP TABLE "_ConversationUserToUser";

-- AddForeignKey
ALTER TABLE "ConversationUser" ADD CONSTRAINT "ConversationUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("buttonId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationUser" ADD CONSTRAINT "ConversationUser_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("buttonId") ON DELETE RESTRICT ON UPDATE CASCADE;
